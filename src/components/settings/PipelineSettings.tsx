import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ColorPicker } from "@/components/pipeline/ColorPicker";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface Stage {
  id: string;
  name: string;
  order: number;
  color: string;
}

interface SortableStageItemProps {
  stage: Stage;
  onEdit: (stage: Stage) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
}

function SortableStageItem({ stage, onEdit, onDelete, onColorChange }: SortableStageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/50"
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </Button>
        <ColorPicker selectedColor={stage.color} onColorChange={(color) => onColorChange(stage.id, color)} />
        <span className="font-medium">{stage.name}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(stage)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => onDelete(stage.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function PipelineSettings() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [stageName, setStageName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pipeline_stages")
      .select("id, name, order, color")
      .order("order", { ascending: true });

    if (error) {
      toast.error("Falha ao buscar etapas do pipeline.");
      console.error(error);
    } else {
      setStages(data as Stage[]);
    }
    setLoading(false);
  };

  const openDialog = (stage: Stage | null = null) => {
    setEditingStage(stage);
    setStageName(stage ? stage.name : "");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!stageName.trim()) {
      toast.error("O nome da etapa não pode estar vazio.");
      return;
    }

    if (editingStage) {
      // Update
      const { error } = await supabase
        .from("pipeline_stages")
        .update({ name: stageName })
        .eq("id", editingStage.id);

      if (error) {
        toast.error("Falha ao atualizar a etapa.");
      } else {
        toast.success("Etapa atualizada com sucesso!");
        fetchStages();
      }
    } else {
      // Create
      const newOrder = stages.length > 0 ? Math.max(...stages.map(s => s.order)) + 1 : 0;
      const { error } = await supabase
        .from("pipeline_stages")
        .insert({ name: stageName, order: newOrder, color: 'blue' });

      if (error) {
        toast.error("Falha ao criar a etapa.");
      } else {
        toast.success("Etapa criada com sucesso!");
        fetchStages();
      }
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("pipeline_stages").delete().eq("id", id);
    if (error) {
      toast.error("Falha ao excluir a etapa.");
    } else {
      toast.success("Etapa excluída com sucesso!");
      fetchStages();
    }
  };

  const handleColorChange = async (id: string, color: string) => {
    const { error } = await supabase
      .from("pipeline_stages")
      .update({ color })
      .eq("id", id);

    if (error) {
      toast.error("Falha ao atualizar a cor da etapa.");
    } else {
      toast.success("Cor da etapa atualizada!");
      fetchStages();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = stages.findIndex((s) => s.id === active.id);
      const newIndex = stages.findIndex((s) => s.id === over?.id);
      const newOrderStages = arrayMove(stages, oldIndex, newIndex);
      setStages(newOrderStages);

      // Update order in Supabase
      const updates = newOrderStages.map((stage, index) =>
        supabase.from('pipeline_stages').update({ order: index }).eq('id', stage.id)
      );
      
      const results = await Promise.all(updates);
      const hasError = results.some(res => res.error);

      if (hasError) {
        toast.error("Falha ao reordenar as etapas. Recarregando...");
        fetchStages(); // Revert on error
      } else {
        toast.success("Etapas reordenadas com sucesso!");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Funil de Vendas</h2>
        <p className="text-muted-foreground mt-2">
          Gerencie as etapas do seu funil de vendas.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Etapa
        </Button>
      </div>

      <div className="p-4 border rounded-lg space-y-3">
        {loading ? (
          <p>Carregando etapas...</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {stages.map((stage) => (
                <SortableStageItem
                  key={stage.id}
                  stage={stage}
                  onEdit={openDialog}
                  onDelete={handleDelete}
                  onColorChange={handleColorChange}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
        {stages.length === 0 && !loading && (
          <p className="text-muted-foreground text-center py-4">Nenhuma etapa criada ainda.</p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStage ? "Editar etapa" : "Nova etapa"}</DialogTitle>
            <DialogDescription>
              {editingStage ? "Altere o nome da etapa." : "Crie uma nova etapa para seu funil."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage-name" className="text-right">
                Nome
              </Label>
              <Input
                id="stage-name"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="col-span-3"
                placeholder="Ex: Qualificação"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}