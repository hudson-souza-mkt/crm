export type ContactAttemptType = 
  | 'call'
  | 'whatsapp'
  | 'email'
  | 'sms'
  | 'linkedin'
  | 'meeting'
  | 'visit'
  | 'other';

export type ContactAttemptStatus = 
  | 'success'           // Contato realizado com sucesso
  | 'no_answer'         // Não atendeu/respondeu
  | 'busy'              // Ocupado
  | 'invalid'           // Número/email inválido
  | 'refused'           // Recusou o contato
  | 'scheduled'         // Agendou para outro momento
  | 'interested'        // Demonstrou interesse
  | 'not_interested'    // Não demonstrou interesse
  | 'callback_requested' // Solicitou retorno
  | 'failed';           // Falha técnica

export interface ContactAttempt {
  id: string;
  leadId: string;
  leadName: string;
  type: ContactAttemptType;
  status: ContactAttemptStatus;
  channel: string; // WhatsApp, Telefone, Email específico, etc.
  duration?: number; // Duração em segundos (para ligações)
  notes?: string;
  nextFollowUp?: Date;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
  tags: string[];
  outcome?: string; // Resultado específico
  cost?: number; // Custo da tentativa (se aplicável)
}

export interface ContactAttemptSummary {
  leadId: string;
  totalAttempts: number;
  successfulAttempts: number;
  lastAttempt?: Date;
  firstAttempt?: Date;
  averageTimeBetweenAttempts: number; // em horas
  attemptsByType: Record<ContactAttemptType, number>;
  attemptsByStatus: Record<ContactAttemptStatus, number>;
  mostEffectiveType?: ContactAttemptType;
  conversionStatus: 'pending' | 'converted' | 'lost';
  conversionDate?: Date;
  attemptsUntilConversion?: number;
}

export interface ContactAttemptMetrics {
  totalAttempts: number;
  averageAttemptsPerLead: number;
  averageAttemptsUntilConversion: number;
  successRate: number;
  conversionRate: number;
  topPerformingChannels: {
    type: ContactAttemptType;
    attempts: number;
    successRate: number;
    conversionRate: number;
  }[];
  attemptsTrend: {
    date: Date;
    attempts: number;
    conversions: number;
  }[];
  leadsWithMostAttempts: {
    leadId: string;
    leadName: string;
    attempts: number;
    status: string;
  }[];
}

export interface ContactAttemptFilters {
  leadId?: string;
  type?: ContactAttemptType[];
  status?: ContactAttemptStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  createdBy?: string;
  hasNotes?: boolean;
  hasFollowUp?: boolean;
}