import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  Plus, 
  Columns, 
  MoreHorizontal,
  Pencil,
  Trash2,
  GripVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Pipeline {
  id: string;
  name: string;
}

interface PipelineGroup {
  id: string;
  name: string;
  pipelines: Pipeline[];
}

interface PipelineGroupListProps {
  activeGroupId: string;
  activePipelineId: string;
  setActiveGroupId: (id: string) => void;
  setActivePipelineId: (id: string) => void;
}

interface SortablePipelineProps {
  pipeline: Pipeline;
  groupId: string;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Componente para um pipeline arrastável
function SortablePipeline({ 
  pipeline, 
  groupId, 
  isActive, 
  onClick, 
  onEdit, 
  onDelete 
}: SortablePipelineProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: pipeline.id,
    data: {
      type: 'pipeline',
      pipeline,
      groupId
    }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between rounded-md p-2",
        isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/30",
        isDragging && "border border-dashed border-primary"
      )}
      {...attributes}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-2 flex-1 text-sm text-left"
      >
        <Columns className="h-4 w-4" />
        {pipeline.name}
      </button>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar pipeline
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir pipeline
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-grab"
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Componente para o overlay de arrasto
function DraggingPipelineOverlay({ pipeline }: { pipeline: Pipeline }) {
  return (
    <div className="flex items-center gap-2 bg-background border rounded-md p-2 shadow-md w-[200px]">
      <Columns className="h-4 w-4" />
      <span className="text-sm">{pipeline.name}</span>
    </div>
  );
}

export function PipelineGroupList({ 
  activeGroupId, 
  activePipelineId, 
  setActiveGroupId, 
  setActivePipelineId 
}: PipelineGroupListProps) {
  // Estado inicial com dados de exemplo
  const [groups, setGroups] = useState<PipelineGroup[]>([
    {
      id: "group1",
      name: "Aquisição",
      pipelines: [
        { id: "pipeline1", name: "Funil de Qualificação" },
        { id: "pipeline2", name: "Funil de Conversão" }
      ]
    },
    {
      id: "group2",
      name: "Vendas",
      pipelines: [
        { id: "pipeline3", name: "Produtos Digitais" },
        { id: "pipeline4", name: "Consultoria" }
      ]
    },
    {
      id: "group3",
      name: "Pós-venda",
      pipelines: [
        { id: "pipeline5", name: "Onboarding" },
        { id: "pipeline6", name: "Fidelização" }
      ]
    }
  ]);

  // Estado para expansão de grupos
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "group1": true,
    "group2": true,
    "group3": true
  });

  // Estado para diálogos
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [newPipelineDialogOpen, setNewPipelineDialogOpen] = useState(false);
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);
  const [editPipelineDialogOpen, setEditPipelineDialogOpen] = useState(false);
  
  // Estado para edição
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingPipelineId, setEditingPipelineId] = useState<string | null>(null);
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);
  
  // Estado para formulários
  const [newGroupName, setNewGroupName] = useState("");
  const [newPipelineName, setNewPipelineName] = useState("");

  // Estado para o drag and drop
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragItem, setActiveDragItem] = useState<Pipeline | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);

  // Configurando sensores para o drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Manipuladores de eventos
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("O nome do grupo não pode estar vazio");
      return;
    }

    const newGroup: PipelineGroup = {
      id: `group${Date.now()}`,
      name: newGroupName,
      pipelines: []
    };

    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setNewGroupDialogOpen(false);
    toast.success("Grupo criado com sucesso!");
  };

  const handleCreatePipeline = () => {
    if (!newPipelineName.trim() || !targetGroupId) {
      toast.error("O nome do pipeline e o grupo são obrigatórios");
      return;
    }

    const newPipeline: Pipeline = {
      id: `pipeline${Date.now()}`,
      name: newPipelineName
    };

    setGroups(groups.map(group => {
      if (group.id === targetGroupId) {
        return {
          ...group,
          pipelines: [...group.pipelines, newPipeline]
        };
      }
      return group;
    }));

    setNewPipelineName("");
    setNewPipelineDialogOpen(false);
    toast.success("Pipeline criado com sucesso!");
  };

  const handleEditGroup = () => {
    if (!newGroupName.trim() || !editingGroupId) return;

    setGroups(groups.map(group => {
      if (group.id === editingGroupId) {
        return {
          ...group,
          name: newGroupName
        };
      }
      return group;
    }));

    setNewGroupName("");
    setEditingGroupId(null);
    setEditGroupDialogOpen(false);
    toast.success("Grupo atualizado com sucesso!");
  };

  const handleEditPipeline = () => {
    if (!newPipelineName.trim() || !editingPipelineId || !targetGroupId) return;

    setGroups(groups.map(group => {
      if (group.id === targetGroupId) {
        return {
          ...group,
          pipelines: group.pipelines.map(pipeline => {
            if (pipeline.id === editingPipelineId) {
              return {
                ...pipeline,
                name: newPipelineName
              };
            }
            return pipeline;
          })
        };
      }
      return group;
    }));

    setNewPipelineName("");
    setEditingPipelineId(null);
    setTargetGroupId(null);
    setEditPipelineDialogOpen(false);
    toast.success("Pipeline atualizado com sucesso!");
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
    toast.success("Grupo excluído com sucesso!");
  };

  const handleDeletePipeline = (groupId: string, pipelineId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          pipelines: group.pipelines.filter(pipeline => pipeline.id !== pipelineId)
        };
      }
      return group;
    }));
    toast.success("Pipeline excluído com sucesso!");
  };

  const openEditGroupDialog = (group: PipelineGroup) => {
    setEditingGroupId(group.id);
    setNewGroupName(group.name);
    setEditGroupDialogOpen(true);
  };

  const openEditPipelineDialog = (groupId: string, pipeline: Pipeline) => {
    setTargetGroupId(groupId);
    setEditingPipelineId(pipeline.id);
    setNewPipelineName(pipeline.name);
    setEditPipelineDialogOpen(true);
  };

  const openNewPipelineDialog = (groupId: string) => {
    setTargetGroupId(groupId);
    setNewPipelineName("");
    setNewPipelineDialogOpen(true);
  };

  // Manipuladores para drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);
    
    // Encontra o item sendo arrastado
    const draggedItem = groups
      .flatMap(group => group.pipelines)
      .find(pipeline => pipeline.id === active.id);
    
    if (draggedItem) {
      setActiveDragItem(draggedItem);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // Verificar se estamos arrastando sobre um grupo
    const isOverGroup = over.data.current?.type === 'group';
    if (isOverGroup) {
      setActiveDropZone(over.id as string);
    } else {
      setActiveDropZone(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveDragId(null);
      setActiveDragItem(null);
      setActiveDropZone(null);
      return;
    }
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) {
      setActiveDragId(null);
      setActiveDragItem(null);
      setActiveDropZone(null);
      return;
    }
    
    // Dados do item sendo arrastado
    const activeData = active.data.current;
    const overData = over.data.current;
    
    // Origem do pipeline
    const sourceGroupId = activeData?.groupId;
    const sourceGroup = groups.find(g => g.id === sourceGroupId);
    
    if (!sourceGroup) {
      setActiveDragId(null);
      setActiveDragItem(null);
      setActiveDropZone(null);
      return;
    }
    
    // Verifica se estamos movendo para outro grupo
    if (overData?.type === 'group') {
      const targetGroupId = overId as string;
      const targetGroup = groups.find(g => g.id === targetGroupId);
      
      if (targetGroup && sourceGroupId !== targetGroupId) {
        // Move o pipeline para outro grupo
        const newGroups = groups.map(group => {
          if (group.id === sourceGroupId) {
            return {
              ...group,
              pipelines: group.pipelines.filter(p => p.id !== activeId)
            };
          }
          if (group.id === targetGroupId) {
            const pipelineToMove = sourceGroup.pipelines.find(p => p.id === activeId);
            if (pipelineToMove) {
              return {
                ...group,
                pipelines: [...group.pipelines, pipelineToMove]
              };
            }
          }
          return group;
        });
        
        setGroups(newGroups);
        toast.success("Pipeline movido para outro grupo");
      }
    } else {
      // Reordenando dentro do mesmo grupo
      const targetData = over.data.current;
      const targetGroupId = targetData?.groupId;
      
      if (sourceGroupId === targetGroupId) {
        const pipelineIndex = sourceGroup.pipelines.findIndex(p => p.id === activeId);
        const overIndex = sourceGroup.pipelines.findIndex(p => p.id === overId);
        
        if (pipelineIndex !== -1 && overIndex !== -1) {
          const newGroups = groups.map(group => {
            if (group.id === sourceGroupId) {
              const newPipelines = arrayMove(
                group.pipelines,
                pipelineIndex,
                overIndex
              );
              
              return {
                ...group,
                pipelines: newPipelines
              };
            }
            return group;
          });
          
          setGroups(newGroups);
          toast.success("Pipeline reordenado");
        }
      }
    }
    
    setActiveDragId(null);
    setActiveDragItem(null);
    setActiveDropZone(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Pipelines</h2>
          <Button size="sm" onClick={() => setNewGroupDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Grupo
          </Button>
        </div>

        <div className="space-y-1">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className={cn(
                "space-y-1",
                activeDropZone === group.id && "bg-muted/80 rounded-md"
              )}
              data-type="group"
              data-id={group.id}
            >
              <div 
                className="flex items-center justify-between rounded-md hover:bg-muted/50 p-2"
                data-type="group-header"
                data-id={group.id}
              >
                <button
                  onClick={() => toggleGroupExpansion(group.id)}
                  className="flex items-center gap-2 flex-1 text-sm font-medium text-left"
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedGroups[group.id] && "transform rotate-90"
                    )}
                  />
                  {group.name}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({group.pipelines.length})
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      openNewPipelineDialog(group.id);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditGroupDialog(group)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar grupo
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir grupo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {expandedGroups[group.id] && (
                <div className="ml-6 space-y-1">
                  <SortableContext 
                    items={group.pipelines.map(p => p.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    {group.pipelines.map((pipeline) => (
                      <SortablePipeline
                        key={pipeline.id}
                        pipeline={pipeline}
                        groupId={group.id}
                        isActive={activePipelineId === pipeline.id}
                        onClick={() => {
                          setActiveGroupId(group.id);
                          setActivePipelineId(pipeline.id);
                        }}
                        onEdit={() => openEditPipelineDialog(group.id, pipeline)}
                        onDelete={() => handleDeletePipeline(group.id, pipeline.id)}
                      />
                    ))}
                  </SortableContext>

                  {group.pipelines.length === 0 && (
                    <button
                      onClick={() => openNewPipelineDialog(group.id)}
                      className="flex items-center gap-2 w-full text-sm text-left text-muted-foreground p-2 rounded-md hover:bg-muted/30"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar pipeline
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Overlay para o elemento sendo arrastado */}
        <DragOverlay>
          {activeDragItem ? <DraggingPipelineOverlay pipeline={activeDragItem} /> : null}
        </DragOverlay>

        {/* Diálogo para novo grupo */}
        <Dialog open={newGroupDialogOpen} onOpenChange={setNewGroupDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar novo grupo</DialogTitle>
              <DialogDescription>
                Adicione um novo grupo para organizar seus pipelines.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="group-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: Aquisição, Vendas, Onboarding..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewGroupDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateGroup}>Criar grupo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para novo pipeline */}
        <Dialog open={newPipelineDialogOpen} onOpenChange={setNewPipelineDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar novo pipeline</DialogTitle>
              <DialogDescription>
                Adicione um novo pipeline ao grupo selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pipeline-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="pipeline-name"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: Funil de Qualificação, Vendas de Produtos..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewPipelineDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePipeline}>Criar pipeline</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar grupo */}
        <Dialog open={editGroupDialogOpen} onOpenChange={setEditGroupDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar grupo</DialogTitle>
              <DialogDescription>
                Altere o nome do grupo selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-group-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="edit-group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditGroupDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditGroup}>Salvar alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar pipeline */}
        <Dialog open={editPipelineDialogOpen} onOpenChange={setEditPipelineDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar pipeline</DialogTitle>
              <DialogDescription>
                Altere o nome do pipeline selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-pipeline-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="edit-pipeline-name"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditPipelineDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditPipeline}>Salvar alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndContext>
  );
}