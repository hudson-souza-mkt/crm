import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DealDetailDialog } from "./DealDetailDialog";
import { supabase } from "@/integrations/supabase/client";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { PipelineCard } from "./PipelineCard";
import type { Deal, PipelineStage } from "@/types/deal";

export type StageColor = "blue" | "purple" | "amber" | "green" | "red" | "pink" | "indigo" | "cyan" | "gray";

export function KanbanBoard() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [activeNewLeadStage, setActiveNewLeadStage] = useState<string | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const stagesPromise = supabase
      .from('pipeline_stages')
      .select('*')
      .order('order', { ascending: true });
      
    const dealsPromise = supabase
      .from('deals')
      .select('*, leads(*)');

    const [{ data: stagesData, error: stagesError }, { data: dealsData, error: dealsError }] = await Promise.all([stagesPromise, dealsPromise]);

    if (stagesError) {
      toast.error('Falha ao buscar as etapas do pipeline.');
      console.error('Stages Error:', stagesError);
    } else {
      setStages(stagesData as PipelineStage[]);
    }

    if (dealsError) {
      toast.error('Falha ao buscar os negócios.');
      console.error('Deals Error:', dealsError);
    } else {
      setDeals(dealsData as Deal[]);
    }
    
    setLoading(false);
  };

  const handleCardClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDetailDialogOpen(true);
  };
  
  const getTotalValue = (dealsInStage: Deal[]) => {
    return dealsInStage.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };
  
  const handleColorChange = async (stageId: string, color: string) => {
    const { error } = await supabase
      .from('pipeline_stages')
      .update({ color })
      .eq('id', stageId);

    if (error) {
      toast.error("Falha ao atualizar a cor da etapa.");
    } else {
      toast.success("Cor da etapa atualizada!");
      fetchData();
    }
  };

  const handleNewLeadClick = (stageId: string) => {
    setActiveNewLeadStage(stageId);
    setIsNewLeadDialogOpen(true);
  };

  const handleCreateLead = async (leadData: any) => {
    // Em um app real, criaríamos o lead e depois o negócio.
    // Por simplicidade, vamos apenas logar por enquanto.
    console.log("Criar novo lead e negócio na etapa:", activeNewLeadStage, leadData);
    toast.info("Funcionalidade de criação de negócio em desenvolvimento.");
    setIsNewLeadDialogOpen(false);
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'deal') {
      setDraggedDeal(event.active.data.current.deal);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedDeal(null);

    if (!over || active.id === over.id) return;

    const dealId = active.id as string;
    const newStageId = over.data.current?.stageId as string;
    const originalStageId = active.data.current?.deal.pipeline_stage_id;

    if (newStageId && newStageId !== originalStageId) {
      // Otimisticamente atualiza a UI
      setDeals(prevDeals => prevDeals.map(d => 
        d.id === dealId ? { ...d, pipeline_stage_id: newStageId } : d
      ));

      const { error } = await supabase
        .from('deals')
        .update({ pipeline_stage_id: newStageId, updated_at: new Date().toISOString() })
        .eq('id', dealId);

      if (error) {
        toast.error(`Falha ao mover o negócio.`);
        // Reverte a UI em caso de erro
        setDeals(prevDeals => prevDeals.map(d => 
          d.id === dealId ? { ...d, pipeline_stage_id: originalStageId } : d
        ));
      } else {
        toast.success("Negócio movido com sucesso!");
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><p>Carregando pipeline...</p></div>;
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
          {stages.map((stage) => {
            const dealsInStage = deals.filter(d => d.pipeline_stage_id === stage.id);
            return (
              <KanbanColumn 
                key={stage.id} 
                id={stage.id}
                title={stage.name} 
                deals={dealsInStage}
                totalValue={getTotalValue(dealsInStage)}
                count={dealsInStage.length}
                color={stage.color as StageColor}
                onColorChange={handleColorChange}
                onCardClick={handleCardClick}
                onAddClick={() => handleNewLeadClick(stage.id)}
              />
            );
          })}
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
              <PipelineCard deal={draggedDeal} onCardClick={() => {}} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      <DealDetailDialog 
        deal={selectedDeal}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      
      <LeadFormDialog
        open={isNewLeadDialogOpen}
        onOpenChange={setIsNewLeadDialogOpen}
        onSubmit={handleCreateLead}
      />
    </div>
  );
}