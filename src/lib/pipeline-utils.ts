import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Lead } from "@/components/pipeline/PipelineCard";

// Etapas padrão do funil de vendas
export const DEFAULT_PIPELINE_STAGES = [
  { name: "Novo Lead", color: "blue", order: 0 },
  { name: "Qualificação", color: "purple", order: 1 },
  { name: "Apresentação", color: "amber", order: 2 },
  { name: "Proposta", color: "indigo", order: 3 },
  { name: "Negociação", color: "pink", order: 4 },
  { name: "Ganho", color: "green", order: 5 },
  { name: "Perdido", color: "red", order: 6 },
];

/**
 * Cria etapas padrão de pipeline se não existirem
 */
export async function ensureDefaultPipelineStages() {
  // Verifica se já existem etapas
  const { data: existingStages, error: fetchError } = await supabase
    .from("pipeline_stages")
    .select("id")
    .limit(1);

  if (fetchError) {
    console.error("Erro ao verificar etapas existentes:", fetchError);
    return false;
  }

  // Se já existem etapas, não precisamos criar as padrões
  if (existingStages && existingStages.length > 0) {
    return true;
  }

  // Cria as etapas padrão
  const { error: insertError } = await supabase
    .from("pipeline_stages")
    .insert(DEFAULT_PIPELINE_STAGES);

  if (insertError) {
    console.error("Erro ao criar etapas padrão:", insertError);
    toast.error("Não foi possível criar as etapas padrão do pipeline.");
    return false;
  }

  toast.success("Etapas padrão do pipeline criadas com sucesso!");
  return true;
}

/**
 * Atualiza a etapa de um lead/negócio
 */
export async function updateLeadStage(leadId: string, stageId: string, reason?: string, comments?: string) {
  // Aqui vamos simular a atualização, já que ainda não temos a tabela de negócios
  // Em um sistema real, faríamos algo como:
  // await supabase.from("deals").update({ stage_id: stageId }).eq("id", leadId);
  
  console.log(`Atualizando lead ${leadId} para a etapa ${stageId}`);
  
  if (reason || comments) {
    // Registrar no histórico (se tivéssemos uma tabela de histórico)
    console.log(`Motivo: ${reason || 'Não informado'}`);
    console.log(`Comentários: ${comments || 'Nenhum'}`);
    
    // Em um sistema real, faríamos algo como:
    // await supabase.from("stage_transitions").insert({
    //   lead_id: leadId,
    //   stage_id: stageId,
    //   reason,
    //   comments,
    //   created_at: new Date()
    // });
  }
  
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retorna sucesso simulado
  return { success: true };
}

/**
 * Verifica se um lead pode ser movido para uma determinada etapa
 * (implementação de "gatekeepers" do pipeline)
 */
export function canMoveLeadToStage(lead: any, stageName: string) {
  // Regras de validação para cada etapa
  const validationRules: Record<string, (lead: any) => { valid: boolean; message?: string }> = {
    "Proposta": (lead) => {
      if (!lead.value || lead.value <= 0) {
        return { 
          valid: false, 
          message: "O lead precisa ter um valor definido para avançar para a etapa de Proposta." 
        };
      }
      return { valid: true };
    },
    "Ganho": (lead) => {
      if (!lead.value || lead.value <= 0) {
        return { 
          valid: false, 
          message: "O lead precisa ter um valor definido para ser marcado como Ganho." 
        };
      }
      return { valid: true };
    }
  };

  // Se não há regra específica para esta etapa, permite a movimentação
  if (!validationRules[stageName]) {
    return { valid: true };
  }

  // Caso contrário, aplica a regra de validação
  return validationRules[stageName](lead);
}

/**
 * Calcula estatísticas para um grupo de leads por etapa
 */
export function calculatePipelineStats(leadsByStage: Record<string, Lead[]>) {
  const stats = {
    totalLeads: 0,
    totalValue: 0,
    // Contagens por etapa, valor por etapa, etc.
    byStage: {} as Record<string, { count: number; value: number }>
  };
  
  // Cálculo do total de leads e valor total
  Object.keys(leadsByStage).forEach(stageName => {
    const leads = leadsByStage[stageName] || [];
    const stageValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const stageCount = leads.length;
    
    stats.totalLeads += stageCount;
    stats.totalValue += stageValue;
    
    stats.byStage[stageName] = {
      count: stageCount,
      value: stageValue
    };
  });
  
  return stats;
}

/**
 * Verifica se um lead está estagnado (muito tempo na mesma etapa)
 */
export function isLeadStagnated(lead: Lead, thresholdDays = 7) {
  if (!lead.stageUpdatedAt) return false;
  
  const updatedDate = new Date(lead.stageUpdatedAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - updatedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > thresholdDays;
}

/**
 * Identifica leads em risco com base em critérios
 * como tempo na etapa, valor, etc.
 */
export function identifyLeadsAtRisk(leads: Lead[]): Lead[] {
  return leads.map(lead => {
    // Critérios de risco:
    // 1. Mais de 14 dias na mesma etapa e valor > 1000
    const isStagnated = isLeadStagnated(lead, 14);
    const isHighValue = lead.value > 1000;
    
    const atRisk = isStagnated && isHighValue;
    
    return {
      ...lead,
      atRisk
    };
  });
}