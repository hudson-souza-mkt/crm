export type StageColor = "blue" | "purple" | "amber" | "green" | "red" | "pink" | "indigo" | "cyan" | "gray";

// Interface para etapa de pipeline, baseada na tabela pipeline_stages
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: StageColor;
  pipeline_id: string;
  created_at: string;
  user_id: string;
}

// Interface para Negócio, baseada na tabela deals
export interface Deal {
  id: string;
  name: string;
  value: number;
  pipeline_stage_id: string;
  pipeline_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  lead_id: string;
  // Dados que virão do JOIN com a tabela 'leads'
  leads?: {
    name: string;
    company: string | null;
  } | null;
}