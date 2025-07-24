import { useState, useEffect } from "react";
import { KanbanColumn } from "@/components/pipeline/KanbanColumn";
import type { Lead } from "@/components/pipeline/PipelineCard";
import { Button } from "@/components/ui/button";
import { Plus, FileBarChart } from "lucide-react";
import { toast } from "sonner";
import { LeadDetailDialog } from "@/components/pipeline/LeadDetailDialog";
import { supabase } from "@/integrations/supabase/client";
import { StageTransitionDialog } from "@/components/pipeline/StageTransitionDialog";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { PipelineCard } from "@/components/pipeline/PipelineCard";
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

export type StageColor = "blue" | "purple" | "amber" | "green" | "red" | "pink" | "indigo" | "cyan" | "gray";

// Interface para etapa de pipeline
interface Stage {
  id: string;
  name: string;
  order: number;
  color: StageColor;
}

// Etapas mockadas para ilustração
const mockStages: Stage[] = [
  { id: "stage1", name: "Novo Lead", order: 0, color: "blue" },
  { id: "stage2", name: "Qualificação", order: 1, color: "purple" },
  { id: "stage3", name: "Apresentação", order: 2, color: "amber" },
  { id: "stage4", name: "Proposta", order: 3, color: "indigo" },
  { id: "stage5", name: "Negociação", order: 4, color: "pink" },
  { id: "stage6", name: "Ganho", order: 5, color: "green" },
  { id: "stage7", name: "Perdido", order: 6, color: "red" }
];

// Leads mockados para ilustração, com diferentes características e estados
const mockLeads: Record<string, Lead[]> = {
  "Novo Lead": [
    { 
      id: "1", 
      name: "Hudson Souza", 
      company: "Acme Corp",
      phone: "(11) 98765-4321", 
      salesperson: "Amanda Vendas", 
      tags: ["potencial", "software"], 
      value: 0, 
      date: "13/06/2025",
      priority: "red",
      activities: false,
      document: "111.222.333-44",
      stage: "Novo Lead",
      stageUpdatedAt: "2025-06-10T10:00:00Z",
      utms: {
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "vendas_software_2024"
      }
    },
    { 
      id: "2", 
      name: "Maria Oliveira", 
      company: "Tech Solutions",
      phone: "(21) 91234-5678", 
      salesperson: "Carlos Almeida", 
      tags: ["novo", "médio porte"], 
      value: 0, 
      date: "15/06/2025",
      activities: false,
      document: "12.345.678/0001-99",
      stage: "Novo Lead",
      stageUpdatedAt: new Date().toISOString(),
    },
    { 
      id: "3", 
      name: "Felipe Ribeiro", 
      company: "Startup Inovadora",
      phone: "(31) 99876-5432", 
      salesperson: "Amanda Vendas", 
      tags: ["tech", "indicação"], 
      value: 0, 
      date: "25/06/2025",
      activities: false,
      stage: "Novo Lead",
      stageUpdatedAt: new Date().toISOString(),
    },
  ],
  "Qualificação": [
    { 
      id: "4", 
      name: "João Pereira", 
      company: "Empresa Regional",
      phone: "(31) 99999-8888", 
      salesperson: "Carlos Almeida", 
      tags: ["consultoria"], 
      value: 500, 
      date: "13/06/2025",
      priority: "green",
      activities: false,
      stage: "Qualificação",
      stageUpdatedAt: "2025-06-01T09:15:00Z",
      atRisk: true
    },
    { 
      id: "5", 
      name: "Ana Silva", 
      company: "Consultoria Silva",
      phone: "(11) 95555-4444", 
      salesperson: "Amanda Vendas", 
      tags: ["consultoria", "pequeno porte"], 
      value: 750, 
      date: "10/06/2025",
      activities: false,
      stage: "Qualificação",
      stageUpdatedAt: "2025-06-05T11:30:00Z"
    },
  ],
  "Apresentação": [
    { 
      id: "6", 
      name: "Carlos Mendes", 
      company: "Startup XYZ",
      phone: "(21) 97777-8888", 
      salesperson: "Amanda Vendas", 
      tags: ["tech", "startup"], 
      value: 1200, 
      date: "20/06/2025",
      priority: "green",
      activities: false,
      stage: "Apresentação",
      stageUpdatedAt: "2025-06-18T16:45:00Z",
    },
  ],
  "Proposta": [
    { 
      id: "7", 
      name: "Fernanda Lima", 
      company: "Empresa ABC",
      phone: "(11) 96666-5555", 
      salesperson: "Carlos Almeida", 
      tags: ["software", "médio porte"], 
      value: 3500, 
      date: "25/06/2025",
      activities: false,
      stage: "Proposta",
      stageUpdatedAt: "2025-06-20T11:20:00Z",
    },
    { 
      id: "8", 
      name: "Roberto Ferreira", 
      company: "Indústria Nacional",
      phone: "(21) 99876-5432", 
      salesperson: "Amanda Vendas", 
      tags: ["indústria", "alto valor"], 
      value: 12000, 
      date: "22/06/2025",
      priority: "red",
      activities: false,
      stage: "Proposta",
      stageUpdatedAt: "2025-06-22T09:10:00Z",
    },
  ],
  "Negociação": [
    { 
      id: "9", 
      name: "Luciana Martins", 
      company: "Comércio Digital",
      phone: "(11) 97777-6666", 
      salesperson: "Carlos Almeida", 
      tags: ["e-commerce", "médio porte"], 
      value: 5800, 
      date: "18/06/2025",
      activities: false,
      stage: "Negociação",
      stageUpdatedAt: "2025-06-18T14:25:00Z",
    },
  ],
  "Ganho": [
    { 
      id: "10", 
      name: "Ricardo Santos", 
      company: "Santos Digital",
      phone: "(47) 98888-7777", 
      salesperson: "Amanda Vendas", 
      tags: ["tech", "fidelizado"], 
      value: 7800, 
      date: "05/06/2025",
      activities: false,
      stage: "Ganho",
      stageUpdatedAt: "2025-06-25T10:00:00Z",
    },
    { 
      id: "11", 
      name: "Gabriela Costa", 
      company: "Agência de Viagens",
      phone: "(11) 99876-5432", 
      salesperson: "Carlos Almeida", 
      tags: ["serviços", "recorrente"], 
      value: 4200, 
      date: "10/06/2025",
      activities: false,
      stage: "Ganho",
      stageUpdatedAt: "2025-06-27T15:20:00Z",
    },
  ],
  "Perdido": [
    { 
      id: "12", 
      name: "Amanda Carvalho", 
      company: "Consultoria Amanda",
      phone: "(11) 95555-4444", 
      salesperson: "Carlos Almeida", 
      tags: ["consultoria"], 
      value: 2500, 
      date: "01/06/2025",
      activities: false,
      stage: "Perdido",
      stageUpdatedAt: "2025-06-15T17:30:00Z",
    },
  ],
};

// Estatísticas mockadas para o resumo do funil
const mockStats = {
  totalLeads: 12,
  totalValue: 38250,
  byStage: {
    "Novo Lead": { count: 3, value: 0 },
    "Qualificação": { count: 2, value: 1250 },
    "Apresentação": { count: 1, value: 1200 },
    "Proposta": { count: 2, value: 15500 },
    "Negociação": { count: 1, value: 5800 },
    "Ganho": { count: 2, value: 12000 },
    "Perdido": { count: 1, value: 2500 }
  }
};

export default function Pipelines() {
  // Usando dados mockados para ilustrar como o funil deve parecer
  const [stages, setStages] = useState<Stage[]>(mockStages);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isNewLeadDialogOpen, setIsNewLeadDialogOpen] = useState(false);
  const [activeNewLeadStage, setActiveNewLeadStage] = useState<string | null>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [targetStage, setTargetStage] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);
  
  // Estado local para armazenar os leads e permitir arrastar entre colunas
  const [localLeads, setLocalLeads] = useState<Record<string, Lead[]>>(mockLeads);
  const [stats] = useState(mockStats);

  // Sensores para o DND kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCardClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailDialogOpen(true);
  };
  
  const getTotalValue = (leads: Lead[]) => {
    return leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  };
  
  const handleColorChange = async (stageId: string, color: StageColor) => {
    // Atualiza localmente para demo
    setStages(prev => 
      prev.map(stage => stage.id === stageId ? {...stage, color} : stage)
    );
    toast.success("Cor da etapa atualizada!");
  };

  const handleNewLeadClick = (stageName: string) => {
    setActiveNewLeadStage(stageName);
    setIsNewLeadDialogOpen(true);
  };

  const handleCreateLead = (leadData: any) => {
    // Cria um novo lead para a demonstração
    const newLead: Lead = {
      id: `new-${Date.now()}`,
      name: leadData.name,
      company: leadData.company || "",
      phone: leadData.phone,
      salesperson: leadData.assignedTo || "Carlos Almeida",
      tags: [],
      value: leadData.value || 0,
      date: new Date().toLocaleDateString('pt-BR'),
      activities: false,
      document: leadData.document,
      stage: activeNewLeadStage || "Novo Lead",
      stageUpdatedAt: new Date().toISOString(),
    };

    // Adiciona o novo lead ao estado local
    setLocalLeads(prev => {
      const stageName = activeNewLeadStage || "Novo Lead";
      return {
        ...prev,
        [stageName]: [...(prev[stageName] || []), newLead]
      };
    });

    toast.success(`Lead ${leadData.name} criado com sucesso!`);
    setIsNewLeadDialogOpen(false);
  };
  
  // Handlers para drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Encontrar o lead que está sendo arrastado
    if (active.data.current?.type === 'lead') {
      setDraggedLead(active.data.current.lead);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    if (over && over.data.current?.type === 'column') {
      setTargetStage(over.data.current.stage);
    } else {
      setTargetStage(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    
    // Resetar estados
    setDraggedLead(null);
    
    // Se não dropou em nenhuma coluna, não faz nada
    if (!over || !targetStage) {
      setTargetStage(null);
      return;
    }
    
    // Verificar se a etapa alvo é a mesma que a atual
    if (draggedLead?.stage === targetStage) {
      setTargetStage(null);
      return;
    }
    
    // Validações específicas para demonstração
    if (draggedLead) {
      // Exemplo de validação: precisa ter valor para mover para Proposta
      if (targetStage === "Proposta" && (!draggedLead.value || draggedLead.value === 0)) {
        setValidationMessage("O lead precisa ter um valor definido para avançar para a etapa de Proposta.");
        setIsConfirmDialogOpen(true);
        return;
      }
      
      // Se a etapa alvo for "Ganho" ou "Perdido", abrir o diálogo de transição
      if (targetStage === "Ganho" || targetStage === "Perdido") {
        setIsTransitionDialogOpen(true);
        return;
      }
      
      // Se não precisa de validação, mover o lead diretamente
      moveLead(draggedLead, targetStage);
    }
    
    setTargetStage(null);
  };

  const handleTransitionConfirm = (reason: string, comments: string) => {
    if (draggedLead && targetStage) {
      const message = targetStage === "Ganho" 
        ? `Parabéns! Negócio ${draggedLead.name} foi ganho. Motivo: ${reason}`
        : `Negócio ${draggedLead.name} foi marcado como perdido. Motivo: ${reason}`;
        
      toast.success(message);
      moveLead(draggedLead, targetStage);
    }
    
    setIsTransitionDialogOpen(false);
  };

  const moveLead = (lead: Lead, toStage: string) => {
    // Remove o lead da etapa atual
    const fromStage = lead.stage || "Novo Lead";
    
    setLocalLeads(prev => {
      // Remove o lead da etapa atual
      const updatedFromStage = prev[fromStage]?.filter(l => l.id !== lead.id) || [];
      
      // Adiciona o lead à nova etapa com timestamp atualizado
      const updatedLead = {
        ...lead,
        stage: toStage,
        stageUpdatedAt: new Date().toISOString()
      };
      
      return {
        ...prev,
        [fromStage]: updatedFromStage,
        [toStage]: [...(prev[toStage] || []), updatedLead]
      };
    });
    
    toast.success(`Lead ${lead.name} movido para ${toStage}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><p>Carregando pipeline...</p></div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Estatísticas do funil */}
      <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg border shadow-sm">
        <div>
          <h3 className="font-medium text-sm">Resumo do funil</h3>
          <p className="text-xs text-muted-foreground">
            Total: {stats.totalLeads} negócios / R$ {stats.totalValue.toFixed(2)}
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <FileBarChart className="h-4 w-4 mr-2" />
              Estatísticas detalhadas
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Estatísticas por etapa</h4>
              <div className="text-xs space-y-1">
                {stages.map(stage => (
                  <div key={stage.id} className="flex justify-between items-center">
                    <span>{stage.name}</span>
                    <span>
                      {stats.byStage[stage.name]?.count || 0} leads / 
                      R$ {(stats.byStage[stage.name]?.value || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Dica para o usuário */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <p>
          <strong>Nota:</strong> Esta é uma visualização ilustrativa do funil de vendas. Você pode interagir com os 
          elementos para ver como funcionaria em um ambiente real. Experimente arrastar cards entre colunas, 
          criar novos leads e visualizar os detalhes!
        </p>
      </div>
      
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
              leads={localLeads[stage.name] || []}
              totalValue={getTotalValue(localLeads[stage.name] || [])}
              count={(localLeads[stage.name] || []).length}
              color={stage.color}
              onColorChange={(color) => handleColorChange(stage.id, color as StageColor)}
              onCardClick={handleCardClick}
              onAddClick={() => handleNewLeadClick(stage.name)}
            />
          ))}
          <div className="flex-shrink-0 w-80 h-16 flex items-center justify-center">
            <Button variant="outline" className="w-full bg-white/80 border-dashed border-2">
              <Plus className="h-4 w-4 mr-2" />
              Nova coluna
            </Button>
          </div>
        </div>
        
        {/* Overlay para arrastar */}
        <DragOverlay>
          {draggedLead ? (
            <div className="w-80">
              <PipelineCard lead={draggedLead} onCardClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {/* Diálogo de detalhes do lead */}
      <LeadDetailDialog 
        lead={selectedLead}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      
      {/* Diálogo para criar novo lead */}
      <LeadFormDialog
        open={isNewLeadDialogOpen}
        onOpenChange={setIsNewLeadDialogOpen}
        onSubmit={handleCreateLead}
      />
      
      {/* Diálogo de validação */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ação não permitida
            </AlertDialogTitle>
            <AlertDialogDescription>
              {validationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Entendi</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Diálogo de transição de etapa */}
      <StageTransitionDialog
        open={isTransitionDialogOpen}
        onOpenChange={setIsTransitionDialogOpen}
        fromStage={draggedLead?.stage || ""}
        toStage={targetStage || ""}
        isClosing={targetStage === "Ganho" || targetStage === "Perdido"}
        onConfirm={handleTransitionConfirm}
      />
    </div>
  );
}