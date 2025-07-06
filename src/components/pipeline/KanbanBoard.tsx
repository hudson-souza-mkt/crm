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

// Função para buscar negócios (deals)
const fetchDeals = async (pipelineId: string): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from("deals")
    .select("*, leads(name, company)")
    .eq("pipeline_id", pipelineId);
  if (error) throw new Error(error.message);
  return data as Deal[];
};

interface KanbanBoardProps {
  pipelineId: string;
}

export function KanbanBoard({ pipelineId }: KanbanBoardProps) {
  const queryClient = useQueryClient();

  // Estados do componente
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [targetStageId, setTargetStageId] = useState<string | null>(null);

  // Buscando dados com React Query
  const { data: stages = [], isLoading: isLoadingStages } = usePipelineStages(pipelineId);

  const { data: deals = [], isLoading: isLoadingDeals } = useQuery<Deal[]>({
    queryKey: ["deals", pipelineId],
    queryFn: () => fetchDeals(pipelineId),
    enabled: !!pipelineId,
  });

  // Mutação para atualizar a etapa de um negócio
  const updateDealStageMutation = useMutation({
    mutationFn: async ({ dealId, newStageId }: { dealId: string, newStageId: string }) => {
      const { error } = await supabase
        .from("deals")
        .update({ pipeline_stage_id: newStageId, updated_at: new Date().toISOString() })
        .eq("id", dealId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Negócio movido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["deals", pipelineId] });
    },
    onError: (error) => {
      toast.error(`Falha ao mover negócio: ${error.message}`);
    },
  });

  // Agrupando negócios por etapa
  const dealsByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.id] = deals.filter(deal => deal.pipeline_stage_id === stage.id);
      return acc;
    }, {} as Record<string, Deal[]>);
  }, [deals, stages]);

  // Sensores para o DND kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCardClick = (deal: Deal) => {
    const leadForDialog: Lead = {
      id: deal.id,
      name: deal.leads?.name || deal.name,
      company: deal.leads?.company,
      phone: "N/A",
      salesperson: "N/A",
      tags: [],
      value: deal.value,
      date: new Date(deal.created_at).toLocaleDateString(),
      activities: false,
      stageUpdatedAt: deal.updated_at,
    };
    setSelectedLead(leadForDialog);
    setIsDetailDialogOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'lead') {
      const dealId = event.active.id;
      const deal = deals.find(d => d.id === dealId);
      if (deal) setDraggedDeal(deal);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over?.data.current?.type === 'column') {
      setTargetStageId(over.id as string);
    } else {
      setTargetStageId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (draggedDeal && over && over.id && draggedDeal.pipeline_stage_id !== over.id) {
      updateDealStageMutation.mutate({ dealId: draggedDeal.id, newStageId: over.id as string });
    }
    
    setDraggedDeal(null);
    setTargetStageId(null);
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

  if (isLoadingStages) {
    return (
      <div className="flex overflow-x-auto pb-6 gap-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80 space-y-2">
            <Skeleton className="h-10 w-full" />
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
        onDragOver={handleDragOver}
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
              onAddClick={() => {}}
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
        lead={selectedLead}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}