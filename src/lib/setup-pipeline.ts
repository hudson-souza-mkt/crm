import { supabase } from "@/integrations/supabase/client";

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
 * Configura (ou reconfigura) as etapas padrão para um pipeline específico.
 * @param pipelineId O ID do pipeline a ser configurado.
 */
export async function setupDefaultPipeline(pipelineId: string) {
  if (!pipelineId) {
    return { success: false, error: new Error("ID do pipeline é obrigatório.") };
  }

  try {
    // 1. Limpa as etapas existentes para este pipeline para evitar duplicatas
    const { error: deleteError } = await supabase
      .from("pipeline_stages")
      .delete()
      .eq("pipeline_id", pipelineId);

    if (deleteError) {
      console.error("Erro ao limpar etapas existentes:", deleteError);
      return { success: false, error: deleteError };
    }

    // 2. Prepara as novas etapas com o ID do pipeline
    const stagesToInsert = DEFAULT_PIPELINE_STAGES.map(stage => ({
      ...stage,
      pipeline_id: pipelineId,
    }));

    // 3. Insere as novas etapas padrão
    const { error: insertError } = await supabase
      .from("pipeline_stages")
      .insert(stagesToInsert);

    if (insertError) {
      console.error("Erro ao inserir etapas padrão:", insertError);
      return { success: false, error: insertError };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro inesperado ao configurar pipeline:", error);
    return { success: false, error };
  }
}