export type AgendaItemType = 'task' | 'message' | 'call' | 'meeting' | 'email' | 'follow-up';
export type AgendaStatus = 'pending' | 'completed' | 'cancelled' | 'in-progress';
export type MessageChannel = 'whatsapp' | 'email' | 'sms';

export interface AgendaItem {
  id: string;
  leadId: string;
  leadName: string;
  type: AgendaItemType;
  title: string;
  description?: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: AgendaStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Para mensagens automáticas
  messageTemplate?: string;
  messageChannel?: MessageChannel;
  
  // Para tarefas
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration?: number; // em minutos
  
  // Para reuniões/calls
  meetingLink?: string;
  attendees?: string[];
  
  // Metadados
  tags?: string[];
  notes?: string;
}

export interface AgendaFilter {
  leadId?: string;
  type?: AgendaItemType;
  status?: AgendaStatus;
  dateFrom?: Date;
  dateTo?: Date;
  createdBy?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: MessageChannel;
  subject?: string; // Para emails
  content: string;
  variables: string[]; // Variáveis disponíveis como {nome}, {empresa}, etc.
  isDefault: boolean;
}