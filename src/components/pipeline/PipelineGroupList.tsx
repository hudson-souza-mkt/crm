import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  Plus, 
  Columns, 
  MoreHorizontal,
  Pencil,
  Trash2
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

  return (
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
          <div key={group.id} className="space-y-1">
            <div className="flex items-center justify-between rounded-md hover:bg-muted/50 p-2">
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
                {group.pipelines.map((pipeline) => (
                  <div
                    key={pipeline.id}
                    className={cn(
                      "flex items-center justify-between rounded-md p-2",
                      activePipelineId === pipeline.id
                        ? "bg-muted text-primary font-medium"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <button
                      onClick={() => {
                        setActiveGroupId(group.id);
                        setActivePipelineId(pipeline.id);
                      }}
                      className="flex items-center gap-2 flex-1 text-sm text-left"
                    >
                      <Columns className="h-4 w-4" />
                      {pipeline.name}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditPipelineDialog(group.id, pipeline)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar pipeline
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeletePipeline(group.id, pipeline.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir pipeline
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

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
  );
}