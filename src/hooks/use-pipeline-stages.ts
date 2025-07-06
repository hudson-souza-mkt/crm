import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PipelineStage } from "@/types/pipeline";

const fetchStages = async (pipelineId: string): Promise<PipelineStage[]> => {
  if (!pipelineId) {
    return [];
  }

  const { data, error } = await supabase
    .from("pipeline_stages")
    .select("*")
    .eq("pipeline_id", pipelineId)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as PipelineStage[];
};

export function usePipelineStages(pipelineId: string) {
  return useQuery<PipelineStage[]>({
    queryKey: ["pipelineStages", pipelineId],
    queryFn: () => fetchStages(pipelineId),
    enabled: !!pipelineId, // A query só será executada se pipelineId não for nulo
  });
}