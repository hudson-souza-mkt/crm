import { useState, useMemo } from "react";
import { KanbanColumn } from "./KanbanColumn";
import type { Lead } from "./PipelineCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { LeadDetailDialog } from "./LeadDetailDialog";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { PipelineCard } from "./PipelineCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePipelineStages } from "@/hooks/use-pipeline-stages";
import { Deal } from "@/types/pipeline";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog"; // Importando o formulário

interface KanbanBoardProps {
  pipelineId: string;
}

export function KanbanBoard({ pipelineId }: KanbanBoardProps) {
  const queryClient = useQueryClient();

  // Estados do componente
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [newDealStageId, setNewDealStageId] = useState<string | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  // Buscando dados com React Query
  const { data: stages = [], isLoading: isLoadingStages } = usePipelineStages(pipelineId);

  const { data: deals = [], isLoading: isLoadingDeals } = useQuery<Deal[]>({
    queryKey: ["deals", pipelineId],
    queryFn: () => fetchDeals(pipelineId),
    enabled: !!pipelineId,
  });

  // Mutação para criar Lead e Deal
  const createLeadAndDealMutation = useMutation({
    mutationFn: async (formData: any) => {
      // 1. Criar o Lead
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          source: formData.source,
          user_id: (await supabase.auth.getUser()).data.user?.id, // Adiciona o user_id
        })
        .select()
        .single();

      if (leadError) throw leadError;

      // 2. Criar o Deal associado
      const { error: dealError } = await supabase.from("deals").insert({
        name: `${formData.name} - Deal`,
        value: formData.value || 0,
        lead_id: leadData.id,
        pipeline_id: pipelineId,
        pipeline_stage_id: newDealStageId,
        user_id: (await supabase.auth.getUser()).data.user?.id, // Adiciona o user_id
      });

      if (dealError) throw dealError;
    },
    onSuccess: () => {
      toast.success("Novo negócio criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
      setIsFormDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Falha ao criar negócio: ${error.message}`);
    },
  });

  // Mutação para atualizar a etapa de um negócio
  const updateDealStageMutation = useMutation({
    mutationFn: async ({ dealId, newStageId }: { dealId: string, newStageId: string }) => {
      const { error } = await supabase
        .from("deals")
        .update({ pipeline_stage_id: newStageId, updated_at: new Date().toISOString() })
        .eq("id", dealId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Negócio movido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
    },
    onError: (error: any) => {
      toast.error(`Falha ao mover negócio: ${error.message}`);
    },
  });

  const dealsByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.id] = deals.filter(deal => deal.pipeline_stage_id === stage.id);
      return acc;
    }, {} as Record<string, Deal[]>);
  }, [deals, stages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCardClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDetailDialogOpen(true);
  };

  const handleAddClick = (stageId: string) => {
    setNewDealStageId(stageId);
    setIsFormDialogOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'lead') {
      const dealId = event.active.id as string;
      const deal = deals.find(d => d.id === dealId);
      if (deal) setDraggedDeal(deal);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedDeal(null);

    if (active && over && over.data.current?.type === 'column' && active.id !== over.id) {
      const dealId = active.id as string;
      const newStageId = over.id as string;
      updateDealStageMutation.mutate({ dealId, newStageId });
    }
  };
  
  const mapDealToLead = (deal: Deal): Lead => ({
    id: deal.id,
    name: deal.leads?.name || deal.name,
    company: deal.leads?.company,
    value: deal.value,
    date: new Date(deal.created_at).toLocaleDateString(),
    salesperson: "Não definido",
    phone: "Não definido",
    tags: [],
    activities: false,
    stageUpdatedAt: deal.updated_at,
  });

  if (isLoadingStages || isLoadingDeals) {
    return (
      <div className="flex overflow-x-auto pb-6 gap-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex overflow-x-auto pb-6 gap-5">
          {stages.map((stage) => (
            <KanbanColumn 
              key={stage.id} 
              id={stage.id}
              title={stage.name} 
              leads={(dealsByStage[stage.id] || []).map(mapDealToLead)}
              totalValue={(dealsByStage[stage.id] || []).reduce((sum, deal) => sum + deal.value, 0)}
              count={(dealsByStage[stage.id] || []).length}
              color={stage.color}
              onColorChange={() => {}}
              onCardClick={(lead) => handleCardClick(deals.find(d => d.id === lead.id)!)}
              onAddClick={() => handleAddClick(stage.id)}
            />
          ))}
          <div className="flex-shrink-0 w-80 h-16 flex items-center justify-center">
            <Button variant="outline" className="w-full bg-white/80 border-dashed border-2">
              <Plus className="h-4 w-4 mr-2" />
              Nova coluna
            </Button>
          </div>
        </div>
        
        <DragOverlay>
          {draggedDeal ? (
            <div className="w-80">
              <PipelineCard lead={mapDealToLead(draggedDeal)} onCardClick={() => {}} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      <LeadDetailDialog 
        deal={selectedDeal}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />

      <LeadFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={(values) => createLeadAndDealMutation.mutate(values)}
      />
    </div>
  );
}

// Função para buscar negócios (deals) - movida para o topo para melhor organização
const fetchDeals = async (pipelineId: string): Promise<Deal[]> => {
  if (!pipelineId) return [];
  const { data, error } = await supabase
    .from("deals")
    .select("*, leads(name, company)")
    .eq("pipeline_id", pipelineId);
  if (error) throw new Error(error.message);
  return data as Deal[];
};