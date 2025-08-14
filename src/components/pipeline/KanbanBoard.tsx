import { useState, useEffect, useMemo } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { ActionModals } from "./ActionModals";
import type { Lead } from "./PipelineCard";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  FileBarChart, 
  Kanban, 
  List, 
  Filter, 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal, 
  ArrowUpDown, 
  Check, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Search,
  Phone,
  Mail,
  MessageSquare,
  Calendar as CalendarIcon,
  Heart,
  FileText,
  CheckSquare,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { LeadDetailDialog } from "./LeadDetailDialog";
import { supabase } from "@/lib/supabase";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

// Leads mockados com dados mais completos para as ações rápidas
const mockLeads: Record<string, Lead[]> = {
  "Novo Lead": [
    { 
      id: "1", 
      name: "Hudson Souza", 
      company: "Acme Corp",
      phone: "(11) 98765-4321",
      email: "hudson@acmecorp.com",
      salesperson: "Amanda Vendas", 
      tags: ["potencial", "software"], 
      value: 0, 
      date: "13/06/2025",
      priority: "red",
      activities: false,
      document: "111.222.333-44",
      stage: "Novo Lead",
      stageUpdatedAt: "2025-06-10T10:00:00Z",
      isFavorite: true,
      lastContact: "Ontem",
      tasksCount: 2,
      notesCount: 1,
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
      email: "maria@techsolutions.com",
      salesperson: "Carlos Almeida", 
      tags: ["novo", "médio porte"], 
      value: 0, 
      date: "15/06/2025",
      activities: true,
      document: "12.345.678/0001-99",
      stage: "Novo Lead",
      stageUpdatedAt: new Date().toISOString(),
      lastContact: "2 dias atrás",
      tasksCount: 1,
      notesCount: 3,
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
      priority: "green",
      tasksCount: 0,
      notesCount: 0,
    },
  ],
  "Qualificação": [
    { 
      id: "4", 
      name: "João Pereira", 
      company: "Empresa Regional",
      phone: "(31) 99999-8888",
      email: "joao@empresaregional.com",
      salesperson: "Carlos Almeida", 
      tags: ["consultoria"], 
      value: 500, 
      date: "13/06/2025",
      priority: "green",
      activities: false,
      stage: "Qualificação",
      stageUpdatedAt: "2025-06-01T09:15:00Z",
      atRisk: true,
      lastContact: "1 semana atrás",
      tasksCount: 3,
      notesCount: 2,
    },
    { 
      id: "5", 
      name: "Ana Silva", 
      company: "Consultoria Silva",
      phone: "(11) 95555-4444",
      email: "ana@consultoriasilva.com",
      salesperson: "Amanda Vendas", 
      tags: ["consultoria", "pequeno porte"], 
      value: 750, 
      date: "10/06/2025",
      activities: false,
      stage: "Qualificação",
      stageUpdatedAt: "2025-06-05T11:30:00Z",
      isFavorite: true,
      lastContact: "Hoje",
      tasksCount: 1,
      notesCount: 4,
    },
  ],
  "Apresentação": [
    { 
      id: "6", 
      name: "Carlos Mendes", 
      company: "Startup XYZ",
      phone: "(21) 97777-8888",
      email: "carlos@startupxyz.com",
      salesperson: "Amanda Vendas", 
      tags: ["tech", "startup"], 
      value: 1200, 
      date: "20/06/2025",
      priority: "green",
      activities: false,
      stage: "Apresentação",
      stageUpdatedAt: "2025-06-18T16:45:00Z",
      lastContact: "3 dias atrás",
      tasksCount: 2,
      notesCount: 1,
    },
  ],
  "Proposta": [
    { 
      id: "7", 
      name: "Fernanda Lima", 
      company: "Empresa ABC",
      phone: "(11) 96666-5555",
      email: "fernanda@empresaabc.com",
      salesperson: "Carlos Almeida", 
      tags: ["software", "médio porte"], 
      value: 3500, 
      date: "25/06/2025",
      activities: false,
      stage: "Proposta",
      stageUpdatedAt: "2025-06-20T11:20:00Z",
      lastContact: "Ontem",
      tasksCount: 1,
      notesCount: 2,
    },
    { 
      id: "8", 
      name: "Roberto Ferreira", 
      company: "Indústria Nacional",
      phone: "(21) 99876-5432",
      email: "roberto@industrianacional.com",
      salesperson: "Amanda Vendas", 
      tags: ["indústria", "alto valor"], 
      value: 12000, 
      date: "22/06/2025",
      priority: "red",
      activities: false,
      stage: "Proposta",
      stageUpdatedAt: "2025-06-22T09:10:00Z",
      isFavorite: true,
      lastContact: "2 horas atrás",
      tasksCount: 4,
      notesCount: 6,
    },
  ],
  "Negociação": [
    { 
      id: "9", 
      name: "Luciana Martins", 
      company: "Comércio Digital",
      phone: "(11) 97777-6666",
      email: "luciana@comerciodigital.com",
      salesperson: "Carlos Almeida", 
      tags: ["e-commerce", "médio porte"], 
      value: 5800, 
      date: "18/06/2025",
      activities: false,
      stage: "Negociação",
      stageUpdatedAt: "2025-06-18T14:25:00Z",
      lastContact: "1 dia atrás",
      tasksCount: 2,
      notesCount: 3,
    },
  ],
  "Ganho": [
    { 
      id: "10", 
      name: "Ricardo Santos", 
      company: "Santos Digital",
      phone: "(47) 98888-7777",
      email: "ricardo@santosdigital.com",
      salesperson: "Amanda Vendas", 
      tags: ["tech", "fidelizado"], 
      value: 7800, 
      date: "05/06/2025",
      activities: false,
      stage: "Ganho",
      stageUpdatedAt: "2025-06-25T10:00:00Z",
      lastContact: "1 semana atrás",
      tasksCount: 0,
      notesCount: 5,
    },
    { 
      id: "11", 
      name: "Gabriela Costa", 
      company: "Agência de Viagens",
      phone: "(11) 99876-5432",
      email: "gabriela@agenciaviagens.com",
      salesperson: "Carlos Almeida", 
      tags: ["serviços", "recorrente"], 
      value: 4200, 
      date: "10/06/2025",
      activities: false,
      stage: "Ganho",
      stageUpdatedAt: "2025-06-27T15:20:00Z",
      isFavorite: true,
      lastContact: "3 dias atrás",
      tasksCount: 1,
      notesCount: 2,
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
      lastContact: "2 semanas atrás",
      tasksCount: 0,
      notesCount: 1,
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

export function KanbanBoard() {
  // Estados existentes
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
  const [localLeads, setLocalLeads] = useState<Record<string, Lead[]>>(mockLeads);
  const [stats] = useState(mockStats);

  // Estado para controlar a visualização (kanban ou lista)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  
  // Estados para a visualização em lista
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string | null>(null);

  // Novos estados para ações rápidas
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<Lead | null>(null);

  // Sensores para o DND kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Convertendo leads do formato de objeto para array para a visualização em lista
  const allLeadsList = useMemo(() => {
    const allLeads: Lead[] = [];
    Object.entries(localLeads).forEach(([stageName, stageLeads]) => {
      stageLeads.forEach(lead => {
        // Garantir que o stage está definido
        allLeads.push({
          ...lead,
          stage: lead.stage || stageName
        });
      });
    });
    return allLeads;
  }, [localLeads]);
  
  // Aplicar ordenação e filtros na lista
  const filteredAndSortedLeads = useMemo(() => {
    let results = [...allLeadsList];
    
    // Aplicar filtro de pesquisa
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(lead => 
        lead.name.toLowerCase().includes(searchLower) || 
        (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
        (lead.email && lead.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Aplicar filtro de etapa
    if (stageFilter) {
      results = results.filter(lead => lead.stage === stageFilter);
    }
    
    // Aplicar ordenação
    results.sort((a, b) => {
      let aValue: any = a[sortColumn as keyof Lead];
      let bValue: any = b[sortColumn as keyof Lead];
      
      // Tratamentos especiais para alguns campos
      if (sortColumn === "value") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (sortColumn === "tags") {
        aValue = aValue ? aValue.join(", ") : "";
        bValue = bValue ? bValue.join(", ") : "";
      } else if (sortColumn === "date" || sortColumn === "stageUpdatedAt") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (aValue === bValue) return 0;
      
      const result = aValue > bValue ? 1 : -1;
      return sortDirection === "asc" ? result : -result;
    });
    
    return results;
  }, [allLeadsList, searchTerm, stageFilter, sortColumn, sortDirection]);
  
  // Função para manipular a ordenação
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Inverter direção se clicar na mesma coluna
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // Nova coluna, definir como ascendente
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Função para selecionar/deselecionar todos os leads
  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredAndSortedLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredAndSortedLeads.map(lead => lead.id));
    }
  };
  
  // Função para alternar seleção de um lead
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeadIds(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId) 
        : [...prev, leadId]
    );
  };

  const handleCardClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailDialogOpen(true);
  };
  
  const getTotalValue = (leads: Lead[]) => {
    return leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  };
  
  const handleColorChange = async (stageId: string, color: StageColor) => {
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
    const newLead: Lead = {
      id: `new-${Date.now()}`,
      name: leadData.name,
      company: leadData.company || "",
      phone: leadData.phone,
      email: leadData.email || "",
      salesperson: leadData.assignedTo || "Carlos Almeida",
      tags: [],
      value: leadData.value || 0,
      date: new Date().toLocaleDateString('pt-BR'),
      activities: false,
      document: leadData.document,
      stage: activeNewLeadStage || "Novo Lead",
      stageUpdatedAt: new Date().toISOString(),
      tasksCount: 0,
      notesCount: 0,
    };

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

  // Handlers para ações rápidas
  const handleQuickAction = (action: string, lead: Lead) => {
    setSelectedLeadForAction(lead);
    
    switch (action) {
      case 'whatsapp':
        handleWhatsAppAction(lead);
        break;
      case 'call':
        handleCallAction(lead);
        break;
      case 'email':
        handleEmailAction(lead);
        break;
      case 'schedule':
        setActiveModal('schedule');
        break;
      case 'tasks':
        setActiveModal('task');
        break;
      case 'notes':
        setActiveModal('note');
        break;
      case 'favorite':
        handleFavoriteAction(lead);
        break;
      case 'edit':
        handleEditAction(lead);
        break;
      default:
        console.log(`Ação ${action} não implementada`);
    }
  };

  const handleWhatsAppAction = (lead: Lead) => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${lead.name}, tudo bem? Sou da ${lead.company || 'nossa empresa'} e gostaria de conversar com você sobre nossa proposta.`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
    toast.success(`WhatsApp aberto para ${lead.name}`);
  };

  const handleCallAction = (lead: Lead) => {
    window.open(`tel:${lead.phone}`, '_self');
    toast.success(`Ligação iniciada para ${lead.name}`);
  };

  const handleEmailAction = (lead: Lead) => {
    if (lead.email) {
      const subject = encodeURIComponent(`Proposta comercial - ${lead.company || lead.name}`);
      const body = encodeURIComponent(`Olá ${lead.name},\n\nEspero que esteja bem. Gostaria de apresentar nossa proposta comercial...\n\nAtenciosamente,\n${lead.salesperson}`);
      window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_self');
      toast.success(`Email aberto para ${lead.name}`);
    } else {
      toast.error("Email não cadastrado para este lead");
    }
  };

  const handleFavoriteAction = (lead: Lead) => {
    setLocalLeads(prev => {
      const stageName = lead.stage || "Novo Lead";
      return {
        ...prev,
        [stageName]: prev[stageName]?.map(l => 
          l.id === lead.id ? { ...l, isFavorite: !l.isFavorite } : l
        ) || []
      };
    });
    toast.success(lead.isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
  };

  const handleEditAction = (lead: Lead) => {
    // Abrir modal de edição (usando o dialog de detalhes)
    setSelectedLead(lead);
    setIsDetailDialogOpen(true);
  };

  const handleModalSubmit = (action: string, data: any) => {
    switch (action) {
      case 'schedule':
        toast.success(`Reunião agendada para ${data.leadName} em ${data.date?.toLocaleDateString('pt-BR')} às ${data.time}`);
        break;
      case 'task':
        toast.success(`Tarefa "${data.title}" criada para ${data.leadName}`);
        // Atualizar contador de tarefas
        if (selectedLeadForAction) {
          setLocalLeads(prev => {
            const stageName = selectedLeadForAction.stage || "Novo Lead";
            return {
              ...prev,
              [stageName]: prev[stageName]?.map(l => 
                l.id === selectedLeadForAction.id ? { ...l, tasksCount: (l.tasksCount || 0) + 1 } : l
              ) || []
            };
          });
        }
        break;
      case 'note':
        toast.success(`Nota "${data.title}" adicionada para ${data.leadName}`);
        // Atualizar contador de notas
        if (selectedLeadForAction) {
          setLocalLeads(prev => {
            const stageName = selectedLeadForAction.stage || "Novo Lead";
            return {
              ...prev,
              [stageName]: prev[stageName]?.map(l => 
                l.id === selectedLeadForAction.id ? { ...l, notesCount: (l.notesCount || 0) + 1 } : l
              ) || []
            };
          });
        }
        break;
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedLeadForAction(null);
  };
  
  // Handlers para drag and drop (mantidos iguais)
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
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
    
    setDraggedLead(null);
    
    if (!over || !targetStage) {
      setTargetStage(null);
      return;
    }
    
    if (draggedLead?.stage === targetStage) {
      setTargetStage(null);
      return;
    }
    
    if (draggedLead) {
      if (targetStage === "Proposta" && (!draggedLead.value || draggedLead.value === 0)) {
        setValidationMessage("O lead precisa ter um valor definido para avançar para a etapa de Proposta.");
        setIsConfirmDialogOpen(true);
        return;
      }
      
      if (targetStage === "Ganho" || targetStage === "Perdido") {
        setIsTransitionDialogOpen(true);
        return;
      }
      
      moveLead(draggedLead, targetStage);
    }
    
    setTargetStage(null);
  };

  const handleTransitionConfirm = (reason: string, comments: string) => {
    if (draggedLead && targetStage) {
      const message = targetStage ===  "Ganho" 
        ? `Parabéns! Negócio ${draggedLead.name} foi ganho. Motivo: ${reason}`
        : `Negócio ${draggedLead.name} foi marcado como perdido. Motivo: ${reason}`;
        
      toast.success(message);
      moveLead(draggedLead, targetStage);
    }
    
    setIsTransitionDialogOpen(false);
  };

  const moveLead = (lead: Lead, toStage: string) => {
    const fromStage = lead.stage || "Novo Lead";
    
    setLocalLeads(prev => {
      const updatedFromStage = prev[fromStage]?.filter(l => l.id !== lead.id) || [];
      
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
  
  // Funções para ações em massa na visualização em lista
  const handleBulkStageChange = (newStage: string) => {
    if (selectedLeadIds.length === 0) return;
    
    // Para cada lead selecionado, alteramos o estágio
    selectedLeadIds.forEach(leadId => {
      const lead = allLeadsList.find(l => l.id === leadId);
      if (lead && lead.stage !== newStage) {
        moveLead(lead, newStage);
      }
    });
    
    toast.success(`${selectedLeadIds.length} leads movidos para ${newStage}`);
    setSelectedLeadIds([]);
  };
  
  const handleBulkDelete = () => {
    if (selectedLeadIds.length === 0) return;
    
    if (confirm(`Tem certeza que deseja excluir ${selectedLeadIds.length} leads?`)) {
      setLocalLeads(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(stageName => {
          updated[stageName] = updated[stageName].filter(
            lead => !selectedLeadIds.includes(lead.id)
          );
        });
        return updated;
      });
      
      toast.success(`${selectedLeadIds.length} leads excluídos com sucesso`);
      setSelectedLeadIds([]);
    }
  };
  
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "—";
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><p>Carregando pipeline...</p></div>;
  }

  // Aqui vamos renderizar o componente adequado com base no viewMode
  const renderContent = () => {
    if (viewMode === "kanban") {
      return (
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
                onQuickAction={handleQuickAction}
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
            {draggedLead ? (
              <div className="w-80">
                <PipelineCard lead={draggedLead} onCardClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      );
    } else {
      // Visualização em lista
      return (
        <div className="bg-white rounded-lg border shadow">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar leads..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select
                  value={stageFilter || ""}
                  onValueChange={(value) => setStageFilter(value || null)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as etapas</SelectItem>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.name}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="default" size="sm" onClick={() => setIsNewLeadDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </div>
            
            {selectedLeadIds.length > 0 && (
              <div className="bg-muted p-2 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{selectedLeadIds.length} leads selecionados</span>
                  
                  <Select onValueChange={handleBulkStageChange}>
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue placeholder="Mover para..." />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.name}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-red-600"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8"
                  onClick={() => setSelectedLeadIds([])}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={selectedLeadIds.length > 0 && selectedLeadIds.length === filteredAndSortedLeads.length} 
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Lead
                      {sortColumn === "name" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("company")}>
                    <div className="flex items-center">
                      Empresa
                      {sortColumn === "company" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("stage")}>
                    <div className="flex items-center">
                      Etapa
                      {sortColumn === "stage" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("value")}>
                    <div className="flex items-center">
                      Valor
                      {sortColumn === "value" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("salesperson")}>
                    <div className="flex items-center">
                      Responsável
                      {sortColumn === "salesperson" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center">
                      Previsão
                      {sortColumn === "date" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("lastContact")}>
                    <div className="flex items-center">
                      Último Contato
                      {sortColumn === "lastContact" && (
                        sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center h-24 text-muted-foreground">
                      Nenhum lead encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedLeads.map((lead) => (
                    <TableRow key={lead.id} className="group">
                      <TableCell>
                        <Checkbox 
                          checked={selectedLeadIds.includes(lead.id)} 
                          onCheckedChange={() => toggleLeadSelection(lead.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell 
                        className="font-medium cursor-pointer"
                        onClick={() => handleCardClick(lead)}
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8 border">
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {lead.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {lead.name}
                              {lead.isFavorite && (
                                <Heart className="h-3 w-3 text-red-500 fill-current" />
                              )}
                            </div>
                            {lead.email && <div className="text-xs text-muted-foreground">{lead.email}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.company || "—"}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={lead.stage}
                          onValueChange={(value) => moveLead(lead, value)}
                        >
                          <SelectTrigger className="h-8 w-[150px]">
                            <SelectValue>{lead.stage}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {stages.map((stage) => (
                              <SelectItem key={stage.id} value={stage.name}>
                                {stage.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatCurrency(lead.value)}</TableCell>
                      <TableCell>{lead.salesperson || "—"}</TableCell>
                      <TableCell>{lead.date || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags && lead.tags.length > 0 ? (
                            lead.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                          {lead.tags && lead.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lead.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{lead.lastContact || "—"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {lead.phone && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleQuickAction('whatsapp', lead)}
                            >
                              <MessageSquare className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {lead.phone && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleQuickAction('call', lead)}
                            >
                              <Phone className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {lead.email && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleQuickAction('email', lead)}
                            >
                              <Mail className="h-4 w-4 text-orange-600" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCardClick(lead)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditAction(lead)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleQuickAction('favorite', lead)}>
                                <Heart className={`h-4 w-4 mr-2 ${lead.isFavorite ? "text-red-500 fill-current" : ""}`} />
                                {lead.isFavorite ? "Desfavoritar" : "Favoritar"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleQuickAction('schedule', lead)}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Agendar reunião
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleQuickAction('tasks', lead)}>
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Adicionar tarefa
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleQuickAction('notes', lead)}>
                                <FileText className="h-4 w-4 mr-2" />
                                Adicionar nota
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja excluir o lead ${lead.name}?`)) {
                                    setLocalLeads(prev => {
                                      const updated = { ...prev };
                                      const stageName = lead.stage || "Novo Lead";
                                      updated[stageName] = updated[stageName].filter(l => l.id !== lead.id);
                                      return updated;
                                    });
                                    toast.success(`Lead ${lead.name} excluído com sucesso`);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Modificação do "Resumo do funil" para incluir visualizações */}
      <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center">
          <h3 className="text-sm font-medium mr-4">Visualizações:</h3>
          <div className="flex bg-gray-100 rounded-md p-1">
            <button 
              onClick={() => setViewMode("kanban")} 
              className={`px-3 py-1 text-sm rounded-md flex items-center gap-1.5 ${viewMode === "kanban" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-kanban size-4"
              >
                <path d="M6 5v11"/>
                <path d="M12 5v6"/>
                <path d="M18 5v14"/>
              </svg>
              Kanban
            </button>
            <button 
              onClick={() => setViewMode("list")} 
              className={`px-3 py-1 text-sm rounded-md flex items-center gap-1.5 ${viewMode === "list" ? "bg-primary text-white" : "hover:bg-gray-200"}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-list size-4"
              >
                <line x1="8" x2="21" y1="6" y2="6"/>
                <line x1="8" x2="21" y1="12" y2="12"/>
                <line x1="8" x2="21" y1="18" y2="18"/>
                <line x1="3" x2="3.01" y1="6" y2="6"/>
                <line x1="3" x2="3.01" y1="12" y2="12"/>
                <line x1="3" x2="3.01" y1="18" y2="18"/>
              </svg>
              Lista
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FileBarChart className="h-4 w-4" />
            Estatísticas
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          
          <Button size="sm" className="flex items-center gap-1" onClick={() => setIsNewLeadDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Negócio
          </Button>
        </div>
      </div>
      
      {/* Conteúdo principal baseado no modo de visualização */}
      {renderContent()}
      
      {/* Diálogos existentes */}
      <LeadDetailDialog 
        lead={selectedLead}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      
      <LeadFormDialog
        open={isNewLeadDialogOpen}
        onOpenChange={setIsNewLeadDialogOpen}
        onSubmit={handleCreateLead}
      />
      
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
      
      <StageTransitionDialog
        open={isTransitionDialogOpen}
        onOpenChange={setIsTransitionDialogOpen}
        fromStage={draggedLead?.stage || ""}
        toStage={targetStage || ""}
        isClosing={targetStage === "Ganho" || targetStage === "Perdido"}
        onConfirm={handleTransitionConfirm}
      />

      {/* Novos modais para ações rápidas */}
      <ActionModals
        lead={selectedLeadForAction}
        activeModal={activeModal}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}