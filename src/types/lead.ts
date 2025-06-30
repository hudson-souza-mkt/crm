export type LeadSource = 'chat' | 'manual' | 'import' | 'webhook';
export type LeadStatus = 'new' | 'qualified' | 'negotiating' | 'won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  funnel?: string;
  stage?: string;
  tags: string[];
  notes?: string;
  value?: number;
  createdAt: Date;
  updatedAt: Date;
  lastContact?: Date;
  assignedTo?: string;
}