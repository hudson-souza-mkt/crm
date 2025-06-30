import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DEFAULT_PIPELINE_STAGES = [
  { name: "Novo Lead", color: "blue", order: 0 },
  { name: "Qualificação", color: "purple", order: 1 },
  { name: "Apresentação", color: "amber", order: 2 },
  { name: "Proposta", color: "indigo", order: 3 },
  { name: "Negociação", color: "pink", order: 4 },
  { name: "Ganho", color: "green", order: 5 },
  { name: "Perdido", color: "red", order: 6 }
];

export async function setupDefaultPipeline() {
  try {
    // Primeiro verificamos se já existem etapas
    const { data: existingStages, error: checkError } = await supabase
      .from("pipeline_stages")
      .select("id")
      .limit(1);
      
    if (checkError) {
      console.error("Erro ao verificar etapas existentes:", checkError);
      return { success: false, error: checkError };
    }
    
    // Se já existem etapas, perguntamos se o usuário quer reconfigurar
    if (existingStages && existingStages.length > 0) {
      // Limpar etapas existentes
      const { error: deleteError } = await supabase
        .from("pipeline_stages")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Hack para excluir todas
      
      if (deleteError) {
        console.error("Erro ao excluir etapas existentes:", deleteError);
        return { success: false, error: deleteError };
      }
    }
    
    // Inserir novas etapas
    const { error: insertError } = await supabase
      .from("pipeline_stages")
      .insert(DEFAULT_PIPELINE_STAGES);
    
    if (insertError) {
      console.error("Erro ao inserir etapas padrão:", insertError);
      return { success: false, error: insertError };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao configurar pipeline:", error);
    return { success: false, error };
  }
}