import { useState, useEffect, useMemo } from "react";
import { KanbanColumn } from "./KanbanColumn";
import type { Lead } from "./PipelineCard";
import { Button } from "@/components/ui/button";
import { Plus, FileBarChart } from "lucide-react";
import { toast } from "sonner";
import { LeadDetailDialog } from "./LeadDetailDialog";
import { supabase } from "@/integrations/supabase/client";
import { StageTransitionDialog } from "./StageTransitionDialog";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { PipelineCard } from "./PipelineCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type StageColor = "blue" | "purple" | "amber" | "green" | "red" | "pink" | "indigo" | "cyan" | "gray";

// Interface para etapa de pipeline
interface Stage {
  id: string;
  name: string;
  order: number;
  color: StageColor;
  pipeline_id: string;
}

// Interface para Negócio (Deal)
interface Deal {
  id: string;
  name: string;
  value: number;
  pipeline_stage_id: string;
  user_id: string;
  created_at: string;
  lead_id: string;
  leads: { // Dados da tabela 'leads'
    name: string;
    company: string | null;
  } | null;
}

interface KanbanBoardProps {
  pipelineId: string;
}

// Função para buscar etapas do pipeline
const fetchStages = async (pipelineId: string): Promise<Stage[]> => {
  const { data, error } = await supabase
    .from("pipeline_stages")
    .select("*")
    .eq("pipeline_id", pipelineId)
    .order("order", { ascending: true });
  if (error) throw new Error(error.message);
  return data as Stage[];
};

// Função para buscar negócios (deals)
const fetchDeals = async (pipelineId: string): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from("deals")
    .select("*, leads(name, company)")
    .eq("pipeline_id", pipelineId);
  if (error) throw new Error(error.message);
  return data as Deal[];
};

export function KanbanBoard({ pipelineId }: KanbanBoardProps) {
  const queryClient = useQueryClient();

  // Estados do componente
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [activeNewLeadStage, setActiveNewLeadStage] = useState<string | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [targetStageId, setTargetStageId] = useState<string | null>(null);
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);

  // Buscando dados com React Query
  const { data: stages = [], isLoading: isLoadingStages } = useQuery<Stage[]>({
    queryKey: ["pipelineStages", pipelineId],
    queryFn: () => fetchStages(pipelineId),
    enabled: !!pipelineId,
  });

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
        .update({ pipeline_stage_id: newStageId })
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
    // Mapeia o Deal para o tipo Lead esperado pelo diálogo
    const leadForDialog: Lead = {
      id: deal.id,
      name: deal.leads?.name || deal.name,
      company: deal.leads?.company,
      phone: "N/A", // Este dado viria de um join mais completo
      salesperson: "N/A",
      tags: [],
      value: deal.value,
      date: new Date(deal.created_at).toLocaleDateString(),
      activities: false,
    };
    setSelectedLead(leadForDialog);
    setIsDetailDialogOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'lead') {
      setDraggedDeal(event.active.data.current.lead as Deal);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over?.data.current?.type === 'column') {
      setTargetStageId(over.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    setDraggedDeal(null);
    setTargetStageId(null);

    if (over && draggedDeal && targetStageId && draggedDeal.pipeline_stage_id !== targetStageId) {
      updateDealStageMutation.mutate({ dealId: draggedDeal.id, newStageId: targetStageId });
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
  });

  if (isLoadingStages || isLoadingDeals) {
    return <div className="flex items-center justify-center h-full"><p>Carregando pipeline...</p></div>;
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
              leads={dealsByStage[stage.id]?.map(mapDealToLead) || []}
              totalValue={(dealsByStage[stage.id] || []).reduce((sum, deal) => sum + deal.value, 0)}
              count={(dealsByStage[stage.id] || []).length}
              color={stage.color}
              onColorChange={() => {}} // Implementar mutação de cor
              onCardClick={(lead) => handleCardClick(deals.find(d => d.id === lead.id)!)}
              onAddClick={() => {}} // Implementar criação de negócio
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
              <PipelineCard lead={mapDealToLead(draggedDeal)} onCardClick={() => {}} />
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