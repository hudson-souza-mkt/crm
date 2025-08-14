import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { PipelineColumn } from "@/components/pipeline/PipelineColumn";
import { PipelineCard, type Lead } from "@/components/pipeline/PipelineCard";
import { PipelineCardModal } from "@/components/pipeline/PipelineCardModal";
import { StageTransitionDialog } from "@/components/pipeline/StageTransitionDialog";
import { PipelineTable } from "@/components/pipeline/PipelineTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Kanban, List, Plus, Upload, Download } from "lucide-react";

// Mock data com informações financeiras expandidas
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 98765-4321",
    email: "joao@example.com",
    company: "ABC Corp",
    stage: "Novo Lead",
    value: 15000,
    discount: 10, // 10% de desconto
    shippingCost: 500,
    expectedCloseDate: new Date("2024-02-15"),
    createdAt: new Date("2024-01-10"),
    stageUpdatedAt: new Date("2024-01-10"),
    assignedTo: "Ana Sales",
    tags: ["software", "médio porte"],
    notes: "Cliente interessado em solução completa de CRM",
    priority: "high",
    lastContact: new Date("2024-01-15"),
    nextFollowUp: new Date("2024-01-20"),
    tasksCount: 3,
    notesCount: 2,
    isFavorite: true
  },
  {
    id: "2",
    name: "Maria Santos",
    phone: "(21) 98765-1234",
    email: "maria@techsolutions.com",
    company: "Tech Solutions",
    stage: "Qualificação",
    value: 25000,
    discount: 5, // 5% de desconto
    shippingCost: 800,
    expectedCloseDate: new Date("2024-02-28"),
    createdAt: new Date("2024-01-05"),
    stageUpdatedAt: new Date("2024-01-12"),
    assignedTo: "Carlos Vendas",
    tags: ["enterprise", "tech"],
    notes: "Empresa em crescimento, precisa de solução escalável",
    priority: "high",
    lastContact: new Date("2024-01-18"),
    tasksCount: 1,
    notesCount: 4,
    isFavorite: false
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    phone: "(31) 91234-5678",
    email: "pedro@construtora.com",
    company: "Construtora Oliveira",
    stage: "Apresentação",
    value: 45000,
    discount: 0,
    shippingCost: 1200,
    expectedCloseDate: new Date("2024-03-10"),
    createdAt: new Date("2023-12-20"),
    stageUpdatedAt: new Date("2024-01-08"),
    assignedTo: "Ana Sales",
    tags: ["construção", "alto valor"],
    notes: "Projeto de grande porte, múltiplas filiais",
    priority: "high",
    lastContact: new Date("2024-01-16"),
    tasksCount: 5,
    notesCount: 1,
    isFavorite: true
  },
  {
    id: "4",
    name: "Ana Pereira",
    phone: "(11) 97654-3210",
    email: "ana@consultoria.com",
    company: "Consultoria AP",
    stage: "Proposta",
    value: 18000,
    discount: 15, // 15% de desconto
    shippingCost: 300,
    expectedCloseDate: new Date("2024-02-05"),
    createdAt: new Date("2023-12-15"),
    stageUpdatedAt: new Date("2024-01-14"),
    assignedTo: "Carlos Vendas",
    tags: ["consultoria", "recorrente"],
    notes: "Cliente já conhece nossa solução, negociando valores",
    priority: "medium",
    lastContact: new Date("2024-01-17"),
    tasksCount: 2,
    notesCount: 0,
    isFavorite: false
  },
  {
    id: "5",
    name: "Lucas Mendes",
    phone: "(47) 98888-7777",
    email: "lucas@startup.com",
    company: "StartupTech",
    stage: "Negociação",
    value: 8000,
    discount: 20, // 20% de desconto para startup
    shippingCost: 200,
    expectedCloseDate: new Date("2024-01-30"),
    createdAt: new Date("2023-12-01"),
    stageUpdatedAt: new Date("2024-01-15"),
    assignedTo: "Ana Sales",
    tags: ["startup", "desconto"],
    notes: "Startup em fase inicial, negociando condições especiais",
    priority: "medium",
    lastContact: new Date("2024-01-19"),
    tasksCount: 0,
    notesCount: 3,
    isFavorite: false
  },
  {
    id: "6",
    name: "Fernanda Costa",
    phone: "(85) 99999-8888",
    email: "fernanda@ecommerce.com",
    company: "E-commerce Plus",
    stage: "Ganho",
    value: 32000,
    discount: 8,
    shippingCost: 600,
    expectedCloseDate: new Date("2024-01-25"),
    createdAt: new Date("2023-11-20"),
    stageUpdatedAt: new Date("2024-01-20"),
    assignedTo: "Carlos Vendas",
    tags: ["e-commerce", "fechado"],
    notes: "Contrato assinado! Iniciar onboarding na próxima semana",
    priority: "high",
    lastContact: new Date("2024-01-20"),
    tasksCount: 1,
    notesCount: 1,
    isFavorite: true
  },
  {
    id: "7",
    name: "Roberto Lima",
    phone: "(62) 97777-6666",
    email: "", // Sem email para testar estado disabled
    company: "Indústria Lima",
    stage: "Qualificação",
    value: 12000,
    discount: 0,
    shippingCost: 400,
    expectedCloseDate: new Date("2024-02-20"),
    createdAt: new Date("2024-01-08"),
    stageUpdatedAt: new Date("2024-01-08"),
    assignedTo: "Ana Sales",
    tags: ["indústria"],
    notes: "Contato apenas por telefone",
    priority: "low",
    lastContact: new Date("2024-01-14"),
    tasksCount: 0,
    notesCount: 0,
    isFavorite: false
  }
];

const stages = [
  "Novo Lead",
  "Qualificação", 
  "Apresentação",
  "Proposta",
  "Negociação",
  "Ganho",
  "Perdido"
];

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [transitionDialogOpen, setTransitionDialogOpen] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<{
    leadId: string;
    fromStage: string;
    toStage: string;
  } | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const getLeadsByStage = (stage: string) => {
    return leads.filter(lead => lead.stage === stage);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const leadId = active.id as string;
    const newStage = over.id as string;
    const lead = leads.find(l => l.id === leadId);
    
    if (!lead || lead.stage === newStage) {
      setActiveId(null);
      return;
    }

    // Verificar se é uma transição para "Ganho" ou "Perdido"
    const isClosing = newStage === "Ganho" || newStage === "Perdido";
    
    if (isClosing) {
      setPendingTransition({
        leadId,
        fromStage: lead.stage,
        toStage: newStage
      });
      setTransitionDialogOpen(true);
    } else {
      // Mudança normal de etapa
      handleStageChange(leadId, newStage);
    }
    
    setActiveId(null);
  };

  const handleStageChange = (leadId: string, newStage: string, reason?: string, comments?: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, stage: newStage, stageUpdatedAt: new Date() }
          : lead
      )
    );
    
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      toast.success(`${lead.name} movido para ${newStage}`);
      
      if (reason || comments) {
        console.log(`Transição registrada:`, { leadId, newStage, reason, comments });
      }
    }
  };

  const handleTransitionConfirm = (reason: string, comments: string) => {
    if (pendingTransition) {
      handleStageChange(
        pendingTransition.leadId, 
        pendingTransition.toStage, 
        reason, 
        comments
      );
    }
    setTransitionDialogOpen(false);
    setPendingTransition(null);
  };

  const handleCardClick = (lead: Lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleLeadUpdate = (leadId: string, updates: Partial<Lead>) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, ...updates } : lead
      )
    );
    
    // Atualizar o lead selecionado se for o mesmo
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, ...updates } : null);
    }
  };
  
  const handleDeleteLead = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    toast.success("Lead excluído com sucesso!");
  };

  const activeLead = activeId ? leads.find(lead => lead.id === activeId) : null;

  return (
    <div className="space-y-6">
      {/* Header com título e ações */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pipeline de Vendas</h1>
        
        <div className="flex flex-wrap gap-2">
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as "kanban" | "list")}
            className="mr-auto sm:mr-0"
          >
            <TabsList>
              <TabsTrigger value="kanban" className="flex items-center gap-1">
                <Kanban className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              Importar
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Novo Negócio
            </Button>
          </div>
        </div>
      </div>
      
      {/* Visão Kanban */}
      {viewMode === "kanban" && (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-x-auto">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="flex gap-6 p-6 min-w-max">
                {stages.map(stage => (
                  <PipelineColumn
                    key={stage}
                    title={stage}
                    leads={getLeadsByStage(stage)}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>
              
              <DragOverlay>
                {activeLead ? (
                  <PipelineCard 
                    lead={activeLead} 
                    onCardClick={() => {}} 
                    isDragging 
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      )}
      
      {/* Visão em Lista */}
      {viewMode === "list" && (
        <PipelineTable 
          leads={leads}
          stages={stages}
          onStageChange={handleStageChange}
          onLeadUpdate={handleLeadUpdate}
          onDeleteLead={handleDeleteLead}
        />
      )}

      {/* Modal de detalhes do lead */}
      {selectedLead && (
        <PipelineCardModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          lead={selectedLead}
          onStageChange={handleStageChange}
          onLeadUpdate={handleLeadUpdate}
        />
      )}

      {/* Dialog de transição de etapa */}
      {pendingTransition && (
        <StageTransitionDialog
          open={transitionDialogOpen}
          onOpenChange={setTransitionDialogOpen}
          fromStage={pendingTransition.fromStage}
          toStage={pendingTransition.toStage}
          isClosing={pendingTransition.toStage === "Ganho" || pendingTransition.toStage === "Perdido"}
          onConfirm={handleTransitionConfirm}
        />
      )}
    </div>
  );
}