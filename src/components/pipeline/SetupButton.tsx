import { Button } from "@/components/ui/button";
import { setupDefaultPipeline } from "@/lib/setup-pipeline";
import { toast } from "sonner";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface SetupButtonProps {
  pipelineId: string;
}

export function SetupButton({ pipelineId }: SetupButtonProps) {
  const [loading, setLoading] = useState(false);
  
  const handleSetup = async () => {
    if (!pipelineId) {
      toast.error("Selecione um pipeline antes de configurar.");
      return;
    }

    setLoading(true);
    try {
      const result = await setupDefaultPipeline(pipelineId);
      if (result.success) {
        toast.success("Pipeline configurado com sucesso! Recarregando a página...");
        // Recarregar a página para mostrar as novas etapas
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Erro ao configurar pipeline. Verifique o console para mais detalhes.");
      }
    } catch (error) {
      console.error("Erro ao configurar pipeline:", error);
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleSetup} 
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : null}
      {loading ? "Configurando..." : "Configurar Funil de Exemplo"}
    </Button>
  );
}