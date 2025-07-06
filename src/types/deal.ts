import type { Lead } from './lead';

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  lead_id: string;
  pipeline_stage_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  
  // Dados aninhados da tabela 'leads'
  leads: Lead;
}