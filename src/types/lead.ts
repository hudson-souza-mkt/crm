export type LeadSource = 'chat' | 'manual' | 'import' | 'webhook';
export type LeadStatus = 'new' | 'qualified' | 'negotiating' | 'won' | 'lost';

export interface UTMs {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  document?: string;
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
  utms?: UTMs;
}