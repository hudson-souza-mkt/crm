import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { 
  ContactAttempt, 
  ContactAttemptSummary, 
  ContactAttemptMetrics,
  ContactAttemptType,
  ContactAttemptStatus,
  ContactAttemptFilters
} from "@/types/contact-attempt";

// Mock data para demonstração
const mockContactAttempts: ContactAttempt[] = [
  {
    id: "attempt-1",
    leadId: "1",
    leadName: "João Silva",
    type: "call",
    status: "no_answer",
    channel: "Telefone Principal",
    duration: 0,
    notes: "Não atendeu, deixei mensagem no WhatsApp",
    createdAt: new Date("2024-01-15T09:30:00"),
    createdBy: "user-1",
    createdByName: "Ana Sales",
    tags: ["primeira-tentativa"],
    nextFollowUp: new Date("2024-01-16T14:00:00")
  },
  {
    id: "attempt-2",
    leadId: "1",
    leadName: "João Silva",
    type: "whatsapp",
    status: "success",
    channel: "WhatsApp",
    notes: "Respondeu positivamente, demonstrou interesse no produto",
    createdAt: new Date("2024-01-16T14:15:00"),
    createdBy: "user-1",
    createdByName: "Ana Sales",
    tags: ["interessado", "follow-up"],
    outcome: "Agendou reunião para apresentação"
  },
  {
    id: "attempt-3",
    leadId: "1",
    leadName: "João Silva",
    type: "meeting",
    status: "success",
    channel: "Reunião Online",
    duration: 1800, // 30 minutos
    notes: "Apresentação realizada, cliente muito interessado. Solicitou proposta.",
    createdAt: new Date("2024-01-18T15:00:00"),
    createdBy: "user-1",
    createdByName: "Ana Sales",
    tags: ["apresentacao", "proposta-solicitada"],
    outcome: "Proposta enviada"
  },
  {
    id: "attempt-4",
    leadId: "2",
    leadName: "Maria Santos",
    type: "email",
    status: "success",
    channel: "Email Corporativo",
    notes: "Email de apresentação enviado com material institucional",
    createdAt: new Date("2024-01-20T10:00:00"),
    createdBy: "user-2",
    createdByName: "Carlos Vendas",
    tags: ["primeiro-contato", "material-enviado"]
  },
  {
    id: "attempt-5",
    leadId: "2",
    leadName: "Maria Santos",
    type: "call",
    status: "busy",
    channel: "Telefone Principal",
    duration: 0,
    notes: "Linha ocupada, tentarei novamente em 2 horas",
    createdAt: new Date("2024-01-20T14:30:00"),
    createdBy: "user-2",
    createdByName: "Carlos Vendas",
    tags: ["ocupado"],
    nextFollowUp: new Date("2024-01-20T16:30:00")
  }
];

export function useContactAttempts(leadId?: string) {
  const [contactAttempts, setContactAttempts] = useState<ContactAttempt[]>(mockContactAttempts);
  const [loading, setLoading] = useState(false);

  // Filtrar tentativas por lead se especificado
  const filteredAttempts = leadId 
    ? contactAttempts.filter(attempt => attempt.leadId === leadId)
    : contactAttempts;

  const createContactAttempt = async (attemptData: Omit<ContactAttempt, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>) => {
    setLoading(true);
    try {
      const newAttempt: ContactAttempt = {
        ...attemptData,
        id: `attempt-${Date.now()}`,
        createdAt: new Date(),
        createdBy: "current-user",
        createdByName: "Usuário Atual"
      };

      setContactAttempts(prev => [...prev, newAttempt]);
      toast.success("Tentativa de contato registrada com sucesso!");
      return newAttempt;
    } catch (error) {
      toast.error("Erro ao registrar tentativa de contato");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContactAttempt = async (id: string, updates: Partial<ContactAttempt>) => {
    setLoading(true);
    try {
      setContactAttempts(prev => prev.map(attempt => 
        attempt.id === id ? { ...attempt, ...updates } : attempt
      ));
      toast.success("Tentativa atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar tentativa");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteContactAttempt = async (id: string) => {
    setLoading(true);
    try {
      setContactAttempts(prev => prev.filter(attempt => attempt.id !== id));
      toast.success("Tentativa removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover tentativa");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getContactAttemptSummary = (leadId: string): ContactAttemptSummary => {
    const leadAttempts = contactAttempts.filter(attempt => attempt.leadId === leadId);
    
    if (leadAttempts.length === 0) {
      return {
        leadId,
        totalAttempts: 0,
        successfulAttempts: 0,
        averageTimeBetweenAttempts: 0,
        attemptsByType: {} as Record<ContactAttemptType, number>,
        attemptsByStatus: {} as Record<ContactAttemptStatus, number>,
        conversionStatus: 'pending'
      };
    }

    const sortedAttempts = leadAttempts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const successfulAttempts = leadAttempts.filter(attempt => 
      ['success', 'interested', 'scheduled'].includes(attempt.status)
    );

    // Calcular tempo médio entre tentativas
    let totalTimeBetween = 0;
    for (let i = 1; i < sortedAttempts.length; i++) {
      const timeDiff = sortedAttempts[i].createdAt.getTime() - sortedAttempts[i-1].createdAt.getTime();
      totalTimeBetween += timeDiff;
    }
    const averageTimeBetweenAttempts = sortedAttempts.length > 1 
      ? totalTimeBetween / (sortedAttempts.length - 1) / (1000 * 60 * 60) // em horas
      : 0;

    // Contar por tipo
    const attemptsByType = leadAttempts.reduce((acc, attempt) => {
      acc[attempt.type] = (acc[attempt.type] || 0) + 1;
      return acc;
    }, {} as Record<ContactAttemptType, number>);

    // Contar por status
    const attemptsByStatus = leadAttempts.reduce((acc, attempt) => {
      acc[attempt.status] = (acc[attempt.status] || 0) + 1;
      return acc;
    }, {} as Record<ContactAttemptStatus, number>);

    // Encontrar tipo mais efetivo
    const typeSuccessRates = Object.entries(attemptsByType).map(([type, count]) => {
      const typeAttempts = leadAttempts.filter(a => a.type === type as ContactAttemptType);
      const typeSuccesses = typeAttempts.filter(a => ['success', 'interested'].includes(a.status));
      return {
        type: type as ContactAttemptType,
        successRate: typeSuccesses.length / count
      };
    });
    const mostEffectiveType = typeSuccessRates.reduce((best, current) => 
      current.successRate > best.successRate ? current : best
    )?.type;

    return {
      leadId,
      totalAttempts: leadAttempts.length,
      successfulAttempts: successfulAttempts.length,
      lastAttempt: sortedAttempts[sortedAttempts.length - 1]?.createdAt,
      firstAttempt: sortedAttempts[0]?.createdAt,
      averageTimeBetweenAttempts,
      attemptsByType,
      attemptsByStatus,
      mostEffectiveType,
      conversionStatus: 'pending' // Seria determinado pela integração com o sistema de leads
    };
  };

  const getContactAttemptMetrics = (): ContactAttemptMetrics => {
    const totalAttempts = contactAttempts.length;
    const uniqueLeads = new Set(contactAttempts.map(a => a.leadId)).size;
    const averageAttemptsPerLead = uniqueLeads > 0 ? totalAttempts / uniqueLeads : 0;

    // Calcular taxa de sucesso
    const successfulAttempts = contactAttempts.filter(a => 
      ['success', 'interested', 'scheduled'].includes(a.status)
    ).length;
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;

    // Top performing channels
    const channelStats = contactAttempts.reduce((acc, attempt) => {
      if (!acc[attempt.type]) {
        acc[attempt.type] = { total: 0, successful: 0 };
      }
      acc[attempt.type].total++;
      if (['success', 'interested', 'scheduled'].includes(attempt.status)) {
        acc[attempt.type].successful++;
      }
      return acc;
    }, {} as Record<ContactAttemptType, { total: number; successful: number }>);

    const topPerformingChannels = Object.entries(channelStats).map(([type, stats]) => ({
      type: type as ContactAttemptType,
      attempts: stats.total,
      successRate: (stats.successful / stats.total) * 100,
      conversionRate: 0 // Seria calculado com dados de conversão real
    })).sort((a, b) => b.successRate - a.successRate);

    // Leads com mais tentativas
    const leadAttemptCounts = contactAttempts.reduce((acc, attempt) => {
      if (!acc[attempt.leadId]) {
        acc[attempt.leadId] = {
          leadId: attempt.leadId,
          leadName: attempt.leadName,
          attempts: 0,
          status: 'pending'
        };
      }
      acc[attempt.leadId].attempts++;
      return acc;
    }, {} as Record<string, { leadId: string; leadName: string; attempts: number; status: string }>);

    const leadsWithMostAttempts = Object.values(leadAttemptCounts)
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 10);

    return {
      totalAttempts,
      averageAttemptsPerLead,
      averageAttemptsUntilConversion: 3.2, // Mock - seria calculado com dados reais
      successRate,
      conversionRate: 15.5, // Mock - seria calculado com dados reais
      topPerformingChannels,
      attemptsTrend: [], // Seria populado com dados históricos
      leadsWithMostAttempts
    };
  };

  const getTypeLabel = (type: ContactAttemptType): string => {
    const labels: Record<ContactAttemptType, string> = {
      call: "Ligação",
      whatsapp: "WhatsApp",
      email: "Email",
      sms: "SMS",
      linkedin: "LinkedIn",
      meeting: "Reunião",
      visit: "Visita",
      other: "Outro"
    };
    return labels[type];
  };

  const getStatusLabel = (status: ContactAttemptStatus): string => {
    const labels: Record<ContactAttemptStatus, string> = {
      success: "Sucesso",
      no_answer: "Não Atendeu",
      busy: "Ocupado",
      invalid: "Inválido",
      refused: "Recusou",
      scheduled: "Agendado",
      interested: "Interessado",
      not_interested: "Não Interessado",
      callback_requested: "Solicitou Retorno",
      failed: "Falhou"
    };
    return labels[status];
  };

  const getStatusColor = (status: ContactAttemptStatus): string => {
    const colors: Record<ContactAttemptStatus, string> = {
      success: "text-green-600 bg-green-50 border-green-200",
      interested: "text-blue-600 bg-blue-50 border-blue-200",
      scheduled: "text-purple-600 bg-purple-50 border-purple-200",
      callback_requested: "text-indigo-600 bg-indigo-50 border-indigo-200",
      no_answer: "text-yellow-600 bg-yellow-50 border-yellow-200",
      busy: "text-orange-600 bg-orange-50 border-orange-200",
      not_interested: "text-red-600 bg-red-50 border-red-200",
      refused: "text-red-600 bg-red-50 border-red-200",
      invalid: "text-gray-600 bg-gray-50 border-gray-200",
      failed: "text-gray-600 bg-gray-50 border-gray-200"
    };
    return colors[status];
  };

  return {
    contactAttempts: filteredAttempts,
    loading,
    createContactAttempt,
    updateContactAttempt,
    deleteContactAttempt,
    getContactAttemptSummary,
    getContactAttemptMetrics,
    getTypeLabel,
    getStatusLabel,
    getStatusColor
  };
}