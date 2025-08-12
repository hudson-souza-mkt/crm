import { useState, useEffect } from "react";
import { AgendaItem, AgendaFilter, AgendaItemType, AgendaStatus } from "@/types/agenda";
import { toast } from "sonner";

// Mock data expandido para demonstração
const mockAgendaItems: AgendaItem[] = [
  // Agendamentos de hoje
  {
    id: "agenda-1",
    leadId: "1",
    leadName: "Hudson Souza",
    type: "call",
    title: "Ligação de follow-up - Proposta comercial",
    description: "Ligar para discutir os detalhes da proposta enviada ontem. Focar nos benefícios e ROI.",
    scheduledDate: new Date(),
    scheduledTime: "09:30",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "high",
    estimatedDuration: 30
  },
  {
    id: "agenda-2",
    leadId: "2",
    leadName: "Maria Silva",
    type: "message",
    title: "Envio automático de material educativo",
    description: "Enviar e-book sobre automação de vendas",
    scheduledDate: new Date(),
    scheduledTime: "11:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    messageTemplate: "Olá {nome}! Como prometido, segue o e-book sobre automação de vendas que vai revolucionar seus processos. Qualquer dúvida, estou à disposição! 📚",
    messageChannel: "whatsapp"
  },
  {
    id: "agenda-3",
    leadId: "3",
    leadName: "João Santos",
    type: "meeting",
    title: "Apresentação da proposta - Reunião de fechamento",
    description: "Apresentar proposta final e negociar condições de pagamento",
    scheduledDate: new Date(),
    scheduledTime: "14:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "urgent",
    estimatedDuration: 60,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    attendees: ["joao@empresa.com", "amanda@spacesales.com"]
  },
  {
    id: "agenda-4",
    leadId: "4",
    leadName: "Ana Costa",
    type: "task",
    title: "Preparar proposta personalizada",
    description: "Criar apresentação customizada com cases de sucesso do setor de e-commerce",
    scheduledDate: new Date(),
    scheduledTime: "16:30",
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    priority: "medium",
    estimatedDuration: 90,
    tags: ["proposta", "e-commerce", "personalizada"]
  },

  // Agendamentos de ontem (atrasados)
  {
    id: "agenda-5",
    leadId: "5",
    leadName: "Pedro Oliveira",
    type: "call",
    title: "Ligação de prospecção - Primeiro contato",
    description: "Primeira ligação para apresentar a empresa e identificar necessidades",
    scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ontem
    scheduledTime: "15:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "medium",
    estimatedDuration: 20
  },

  // Agendamentos de amanhã
  {
    id: "agenda-6",
    leadId: "6",
    leadName: "Luciana Ferreira",
    type: "email",
    title: "Envio de proposta comercial",
    description: "Enviar proposta detalhada com valores e condições",
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
    scheduledTime: "10:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    priority: "high"
  },
  {
    id: "agenda-7",
    leadId: "7",
    leadName: "Roberto Lima",
    type: "message",
    title: "Lembrete de reunião",
    description: "Lembrar sobre a reunião agendada para sexta-feira",
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
    scheduledTime: "16:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    messageTemplate: "Oi {nome}! Lembrando que temos nossa reunião agendada para sexta-feira às 14h. Confirma sua presença? Vou apresentar uma solução incrível para sua empresa! 🚀",
    messageChannel: "whatsapp"
  },

  // Agendamentos da próxima semana
  {
    id: "agenda-8",
    leadId: "8",
    leadName: "Fernanda Rocha",
    type: "meeting",
    title: "Demo do produto - Apresentação técnica",
    description: "Demonstração completa da plataforma com foco nas funcionalidades técnicas",
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Em 3 dias
    scheduledTime: "09:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    priority: "high",
    estimatedDuration: 45,
    meetingLink: "https://zoom.us/j/123456789",
    attendees: ["fernanda@techcorp.com", "carlos@spacesales.com", "suporte@spacesales.com"]
  },
  {
    id: "agenda-9",
    leadId: "9",
    leadName: "Marcos Almeida",
    type: "call",
    title: "Follow-up pós-demo",
    description: "Ligar para coletar feedback da demonstração e identificar próximos passos",
    scheduledDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Em 4 dias
    scheduledTime: "11:30",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "medium",
    estimatedDuration: 25
  },
  {
    id: "agenda-10",
    leadId: "10",
    leadName: "Carla Mendes",
    type: "task",
    title: "Pesquisar concorrentes do cliente",
    description: "Fazer análise competitiva do setor de logística para personalizar abordagem",
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Em 5 dias
    scheduledTime: "13:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    priority: "low",
    estimatedDuration: 120,
    tags: ["pesquisa", "concorrência", "logística"]
  },

  // Agendamentos da semana seguinte
  {
    id: "agenda-11",
    leadId: "11",
    leadName: "Rafael Barbosa",
    type: "follow-up",
    title: "Follow-up trimestral - Cliente ativo",
    description: "Verificar satisfação e identificar oportunidades de upsell",
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Em 1 semana
    scheduledTime: "14:30",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "medium",
    estimatedDuration: 30
  },
  {
    id: "agenda-12",
    leadId: "12",
    leadName: "Juliana Campos",
    type: "message",
    title: "Envio de case de sucesso",
    description: "Compartilhar case similar do setor de educação",
    scheduledDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // Em 8 dias
    scheduledTime: "10:30",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    messageTemplate: "Olá {nome}! Lembra que você mencionou interesse em ver cases do setor educacional? Encontrei um case perfeito que mostra como uma escola aumentou suas matrículas em 40% usando nossa solução. Quer que eu apresente? 📈",
    messageChannel: "email"
  },

  // Agendamentos do mês
  {
    id: "agenda-13",
    leadId: "13",
    leadName: "Bruno Martins",
    type: "meeting",
    title: "Reunião de renovação de contrato",
    description: "Negociar renovação anual e apresentar novos módulos",
    scheduledDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Em 15 dias
    scheduledTime: "15:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "urgent",
    estimatedDuration: 90,
    meetingLink: "https://teams.microsoft.com/l/meetup-join/19%3a...",
    attendees: ["bruno@empresa.com", "amanda@spacesales.com", "gerente@spacesales.com"]
  },
  {
    id: "agenda-14",
    leadId: "14",
    leadName: "Patrícia Gomes",
    type: "task",
    title: "Elaborar proposta de integração",
    description: "Criar proposta técnica para integração com ERP SAP",
    scheduledDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Em 20 dias
    scheduledTime: "09:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    priority: "high",
    estimatedDuration: 180,
    tags: ["integração", "SAP", "técnica"]
  },

  // Alguns agendamentos concluídos para mostrar histórico
  {
    id: "agenda-15",
    leadId: "15",
    leadName: "Ricardo Souza",
    type: "call",
    title: "Ligação de qualificação",
    description: "Qualificar lead e identificar budget",
    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    scheduledTime: "11:00",
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "medium",
    estimatedDuration: 20,
    notes: "Lead qualificado com budget de R$ 50k. Próximo passo: enviar proposta."
  },
  {
    id: "agenda-16",
    leadId: "16",
    leadName: "Camila Torres",
    type: "email",
    title: "Envio de material institucional",
    description: "Enviar apresentação da empresa e cases de sucesso",
    scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    scheduledTime: "14:00",
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    notes: "Material enviado. Cliente demonstrou interesse em agendar demo."
  },

  // Agendamento cancelado
  {
    id: "agenda-17",
    leadId: "17",
    leadName: "Eduardo Silva",
    type: "meeting",
    title: "Reunião de apresentação",
    description: "Apresentar solução para o setor de varejo",
    scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Ontem
    scheduledTime: "16:00",
    status: "cancelled",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "medium",
    estimatedDuration: 60,
    notes: "Cliente cancelou por conflito de agenda. Reagendar para próxima semana."
  },

  // Agendamentos variados para testar filtros
  {
    id: "agenda-18",
    leadId: "18",
    leadName: "Larissa Moura",
    type: "message",
    title: "Envio de proposta via WhatsApp",
    description: "Enviar link da proposta personalizada",
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Em 2 dias
    scheduledTime: "08:30",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    messageTemplate: "Bom dia {nome}! Finalizei sua proposta personalizada. Acesse o link para visualizar: [link]. Estou disponível para esclarecer qualquer dúvida! 💼",
    messageChannel: "whatsapp"
  },
  {
    id: "agenda-19",
    leadId: "19",
    leadName: "Thiago Reis",
    type: "task",
    title: "Atualizar CRM com informações do lead",
    description: "Inserir dados coletados na ligação de qualificação",
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Amanhã
    scheduledTime: "17:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Carlos Vendedor",
    priority: "low",
    estimatedDuration: 15,
    tags: ["CRM", "atualização", "dados"]
  },
  {
    id: "agenda-20",
    leadId: "20",
    leadName: "Vanessa Lima",
    type: "follow-up",
    title: "Follow-up pós-proposta",
    description: "Verificar se cliente analisou a proposta e coletar feedback",
    scheduledDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // Em 6 dias
    scheduledTime: "10:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "high",
    estimatedDuration: 25
  }
];

interface UseAgendaManagerProps {
  leadId?: string;
  onItemUpdate?: (item: AgendaItem) => void;
}

export function useAgendaManager({ leadId, onItemUpdate }: UseAgendaManagerProps = {}) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(mockAgendaItems);
  const [filter, setFilter] = useState<AgendaFilter>({ leadId });

  useEffect(() => {
    if (leadId) {
      setFilter(prev => ({ ...prev, leadId }));
    }
  }, [leadId]);

  const getFilteredItems = () => {
    return agendaItems.filter(item => {
      if (filter.leadId && item.leadId !== filter.leadId) return false;
      if (filter.type && item.type !== filter.type) return false;
      if (filter.status && item.status !== filter.status) return false;
      if (filter.dateFrom && item.scheduledDate < filter.dateFrom) return false;
      if (filter.dateTo && item.scheduledDate > filter.dateTo) return false;
      if (filter.createdBy && item.createdBy !== filter.createdBy) return false;
      return true;
    });
  };

  const createAgendaItem = (itemData: Partial<AgendaItem>): AgendaItem => {
    const newItem: AgendaItem = {
      id: `agenda-${Date.now()}`,
      leadId: itemData.leadId || "",
      leadName: itemData.leadName || "",
      type: itemData.type || "task",
      title: itemData.title || "",
      description: itemData.description,
      scheduledDate: itemData.scheduledDate || new Date(),
      scheduledTime: itemData.scheduledTime || "09:00",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: itemData.createdBy || "Usuário Atual",
      ...itemData
    };

    setAgendaItems(prev => [...prev, newItem]);
    toast.success(`${getTypeLabel(newItem.type)} agendado para ${newItem.scheduledDate.toLocaleDateString('pt-BR')} às ${newItem.scheduledTime}`);
    
    if (onItemUpdate) {
      onItemUpdate(newItem);
    }

    return newItem;
  };

  const updateAgendaItem = (id: string, updates: Partial<AgendaItem>) => {
    setAgendaItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date() }
        : item
    ));

    const updatedItem = agendaItems.find(item => item.id === id);
    if (updatedItem && onItemUpdate) {
      onItemUpdate({ ...updatedItem, ...updates });
    }
  };

  const deleteAgendaItem = (id: string) => {
    setAgendaItems(prev => prev.filter(item => item.id !== id));
    toast.success("Agendamento removido");
  };

  const completeAgendaItem = (id: string) => {
    updateAgendaItem(id, { status: "completed" });
    toast.success("Agendamento marcado como concluído");
  };

  const cancelAgendaItem = (id: string) => {
    updateAgendaItem(id, { status: "cancelled" });
    toast.success("Agendamento cancelado");
  };

  const getTypeLabel = (type: AgendaItemType): string => {
    const labels = {
      task: "Tarefa",
      message: "Mensagem",
      call: "Ligação",
      meeting: "Reunião",
      email: "Email",
      "follow-up": "Follow-up"
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: AgendaStatus): string => {
    const labels = {
      pending: "Pendente",
      completed: "Concluído",
      cancelled: "Cancelado",
      "in-progress": "Em andamento"
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent": return "text-red-600 bg-red-50";
      case "high": return "text-orange-600 bg-orange-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: AgendaStatus) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "cancelled": return "text-red-600 bg-red-50";
      case "in-progress": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return {
    agendaItems: getFilteredItems(),
    filter,
    setFilter,
    createAgendaItem,
    updateAgendaItem,
    deleteAgendaItem,
    completeAgendaItem,
    cancelAgendaItem,
    getTypeLabel,
    getStatusLabel,
    getPriorityColor,
    getStatusColor
  };
}