import { useState, useEffect } from "react";
import { AgendaItem, AgendaFilter, AgendaItemType, AgendaStatus } from "@/types/agenda";
import { toast } from "sonner";

// Mock data para demonstração
const mockAgendaItems: AgendaItem[] = [
  {
    id: "agenda-1",
    leadId: "1",
    leadName: "Hudson Souza",
    type: "call",
    title: "Ligação de follow-up",
    description: "Ligar para discutir proposta comercial",
    scheduledDate: new Date(2025, 0, 15, 14, 30),
    scheduledTime: "14:30",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "high",
    estimatedDuration: 30
  },
  {
    id: "agenda-2",
    leadId: "1",
    leadName: "Hudson Souza",
    type: "message",
    title: "Envio automático de proposta",
    description: "Enviar proposta por WhatsApp",
    scheduledDate: new Date(2025, 0, 16, 9, 0),
    scheduledTime: "09:00",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    messageTemplate: "Olá {nome}, segue nossa proposta comercial em anexo. Qualquer dúvida, estou à disposição!",
    messageChannel: "whatsapp"
  },
  {
    id: "agenda-3",
    leadId: "1",
    leadName: "Hudson Souza",
    type: "task",
    title: "Preparar apresentação",
    description: "Criar slides personalizados para o cliente",
    scheduledDate: new Date(2025, 0, 14, 16, 0),
    scheduledTime: "16:00",
    status: "completed",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "Amanda Vendas",
    priority: "medium",
    estimatedDuration: 120
  }
];

interface AgendaManagerProps {
  leadId?: string;
  onItemUpdate?: (item: AgendaItem) => void;
}

export function AgendaManager({ leadId, onItemUpdate }: AgendaManagerProps) {
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