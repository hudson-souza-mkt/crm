import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Skeleton } from "@/components/ui/skeleton";

interface Pipeline {
  id: string;
  name: string;
  group_id: string;
  order: number;
}

interface PipelineGroup {
  id: string;
  name: string;
  pipelines: Pipeline[];
}

interface PipelineGroupListProps {
  activePipelineId: string;
  setActivePipelineId: (id: string) => void;
}

// --- Funções de Fetch e Mutate ---

const fetchPipelineData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const { data: groups, error: groupsError } = await supabase
    .from("pipeline_groups")
    .select("id, name")
    .eq("user_id", user.id);
  if (groupsError) throw groupsError;

  const { data: pipelines, error: pipelinesError } = await supabase
    .from("pipelines")
    .select("id, name, group_id, order")
    .eq("user_id", user.id)
    .order("order");
  if (pipelinesError) throw pipelinesError;

  return groups.map(group => ({
    ...group,
    pipelines: pipelines.filter(p => p.group_id === group.id),
  }));
};

// --- Componentes ---

function SortablePipeline({ pipeline, isActive, onClick, onEdit, onDelete }: {
  pipeline: Pipeline;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: pipeline.id,
    data: { type: 'pipeline', pipeline }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
    >
      <button
        onClick={onClick}
        className="flex items-center gap-2 flex-1 text-sm text-left"
        {...attributes}
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
            <DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-grab" {...listeners}>
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function DraggingPipelineOverlay({ pipeline }: { pipeline: Pipeline }) {
  return (
    <div className="flex items-center gap-2 bg-background border rounded-md p-2 shadow-md w-[200px]">
      <Columns className="h-4 w-4" />
      <span className="text-sm">{pipeline.name}</span>
    </div>
  );
}

export function PipelineGroupList({ activePipelineId, setActivePipelineId }: PipelineGroupListProps) {
  const queryClient = useQueryClient();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [dialogState, setDialogState] = useState<{
    type: 'newGroup' | 'editGroup' | 'newPipeline' | 'editPipeline' | null;
    data?: any;
  }>({ type: null });
  const [formName, setFormName] = useState("");
  const [activeDragItem, setActiveDragItem] = useState<Pipeline | null>(null);

  const { data: groups = [], isLoading } = useQuery<PipelineGroup[]>({
    queryKey: ["pipelineData"],
    queryFn: fetchPipelineData,
    onSuccess: (data) => {
      // Expandir todos os grupos por padrão ao carregar
      const initialExpansion: Record<string, boolean> = {};
      data.forEach(g => initialExpansion[g.id] = true);
      setExpandedGroups(initialExpansion);
    }
  });

  const allPipelines = useMemo(() => groups.flatMap(g => g.pipelines), [groups]);

  const mutationOptions = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pipelineData"] }),
    onError: (error: any) => toast.error(`Erro: ${error.message}`),
  };

  const createGroupMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { error } = await supabase.from("pipeline_groups").insert({ name, user_id: user.id });
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Grupo criado!");
      setDialogState({ type: null });
      mutationOptions.onSuccess();
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      const { error } = await supabase.from("pipeline_groups").update({ name }).eq("id", id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Grupo atualizado!");
      setDialogState({ type: null });
      mutationOptions.onSuccess();
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pipeline_groups").delete().eq("id", id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Grupo excluído!");
      mutationOptions.onSuccess();
    }
  });

  const createPipelineMutation = useMutation({
    mutationFn: async ({ name, groupId }: { name: string, groupId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const group = groups.find(g => g.id === groupId);
      const order = group ? group.pipelines.length : 0;
      const { error } = await supabase.from("pipelines").insert({ name, group_id: groupId, user_id: user.id, order });
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Pipeline criado!");
      setDialogState({ type: null });
      mutationOptions.onSuccess();
    }
  });

  const updatePipelineMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      const { error } = await supabase.from("pipelines").update({ name }).eq("id", id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Pipeline atualizado!");
      setDialogState({ type: null });
      mutationOptions.onSuccess();
    }
  });

  const deletePipelineMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pipelines").delete().eq("id", id);
      if (error) throw error;
    },
    ...mutationOptions,
    onSuccess: () => {
      toast.success("Pipeline excluído!");
      mutationOptions.onSuccess();
    }
  });

  const updatePipelineOrderMutation = useMutation({
    mutationFn: async (updates: { id: string; order: number; group_id?: string }[]) => {
      const { error } = await supabase.from("pipelines").upsert(updates);
      if (error) throw error;
    },
    ...mutationOptions
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const pipeline = allPipelines.find(p => p.id === active.id);
    if (pipeline) setActiveDragItem(pipeline);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);
    if (!over || active.id === over.id) return;

    const sourcePipeline = allPipelines.find(p => p.id === active.id);
    if (!sourcePipeline) return;

    const sourceGroup = groups.find(g => g.id === sourcePipeline.group_id);
    const overIsGroup = over.data.current?.type === 'group';
    const targetGroupId = overIsGroup ? over.id as string : allPipelines.find(p => p.id === over.id)?.group_id;
    const targetGroup = groups.find(g => g.id === targetGroupId);

    if (!sourceGroup || !targetGroup) return;

    let newGroups = JSON.parse(JSON.stringify(groups));
    const sourceGroupIndex = newGroups.findIndex((g: PipelineGroup) => g.id === sourceGroup.id);
    const sourcePipelineIndex = newGroups[sourceGroupIndex].pipelines.findIndex((p: Pipeline) => p.id === active.id);
    
    const [movedPipeline] = newGroups[sourceGroupIndex].pipelines.splice(sourcePipelineIndex, 1);

    const targetGroupIndex = newGroups.findIndex((g: PipelineGroup) => g.id === targetGroup.id);
    const targetPipelineIndex = overIsGroup ? newGroups[targetGroupIndex].pipelines.length : newGroups[targetGroupIndex].pipelines.findIndex((p: Pipeline) => p.id === over.id);

    newGroups[targetGroupIndex].pipelines.splice(targetPipelineIndex, 0, movedPipeline);

    const updates: { id: string; order: number; group_id: string }[] = [];
    newGroups.forEach((group: PipelineGroup) => {
      group.pipelines.forEach((pipeline: Pipeline, index: number) => {
        updates.push({ id: pipeline.id, order: index, group_id: group.id });
      });
    });

    updatePipelineOrderMutation.mutate(updates);
  };

  const openDialog = (type: typeof dialogState.type, data?: any) => {
    setFormName(data?.name || "");
    setDialogState({ type, data });
  };

  const handleDialogSubmit = () => {
    if (!formName.trim()) return toast.error("O nome não pode estar vazio.");
    switch (dialogState.type) {
      case 'newGroup':
        createGroupMutation.mutate(formName);
        break;
      case 'editGroup':
        updateGroupMutation.mutate({ id: dialogState.data.id, name: formName });
        break;
      case 'newPipeline':
        createPipelineMutation.mutate({ name: formName, groupId: dialogState.data.id });
        break;
      case 'editPipeline':
        updatePipelineMutation.mutate({ id: dialogState.data.id, name: formName });
        break;
    }
  };

  const dialogDetails = {
    newGroup: { title: "Criar novo grupo", desc: "Adicione um novo grupo para organizar seus pipelines." },
    editGroup: { title: "Editar grupo", desc: "Altere o nome do grupo." },
    newPipeline: { title: "Criar novo pipeline", desc: "Adicione um novo pipeline ao grupo." },
    editPipeline: { title: "Editar pipeline", desc: "Altere o nome do pipeline." },
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Pipelines</h2>
          <Button size="sm" onClick={() => openDialog('newGroup')}>
            <Plus className="mr-2 h-4 w-4" /> Novo Grupo
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-1">
            {groups.map((group) => (
              <div key={group.id} data-type="group" data-id={group.id}>
                <div className="flex items-center justify-between rounded-md hover:bg-muted/50 p-2">
                  <button onClick={() => setExpandedGroups(p => ({ ...p, [group.id]: !p[group.id] }))} className="flex items-center gap-2 flex-1 text-sm font-medium text-left">
                    <ChevronRight className={cn("h-4 w-4 transition-transform", expandedGroups[group.id] && "transform rotate-90")} />
                    {group.name}
                    <span className="text-xs text-muted-foreground ml-1">({group.pipelines.length})</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog('newPipeline', group)}><Plus className="h-4 w-4" /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDialog('editGroup', group)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteGroupMutation.mutate(group.id)}><Trash2 className="mr-2 h-4 w-4" />Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {expandedGroups[group.id] && (
                  <div className="ml-6 space-y-1">
                    <SortableContext items={group.pipelines.map(p => p.id)} strategy={verticalListSortingStrategy}>
                      {group.pipelines.map((pipeline) => (
                        <SortablePipeline
                          key={pipeline.id}
                          pipeline={pipeline}
                          isActive={activePipelineId === pipeline.id}
                          onClick={() => setActivePipelineId(pipeline.id)}
                          onEdit={() => openDialog('editPipeline', pipeline)}
                          onDelete={() => deletePipelineMutation.mutate(pipeline.id)}
                        />
                      ))}
                    </SortableContext>
                    {group.pipelines.length === 0 && (
                      <button onClick={() => openDialog('newPipeline', group)} className="flex items-center gap-2 w-full text-sm text-left text-muted-foreground p-2 rounded-md hover:bg-muted/30">
                        <Plus className="h-4 w-4" /> Adicionar pipeline
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <DragOverlay>
        {activeDragItem ? <DraggingPipelineOverlay pipeline={activeDragItem} /> : null}
      </DragOverlay>

      <Dialog open={!!dialogState.type} onOpenChange={(open) => !open && setDialogState({ type: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogDetails[dialogState.type!]?.title}</DialogTitle>
            <DialogDescription>{dialogDetails[dialogState.type!]?.desc}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogState({ type: null })}>Cancelar</Button>
            <Button onClick={handleDialogSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}