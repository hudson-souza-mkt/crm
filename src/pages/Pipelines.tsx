import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { PipelineFilters } from "@/components/pipeline/PipelineFilters";
import { PipelineGroupList } from "@/components/pipeline/PipelineGroupList";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown, ChevronLeft, ChevronRight, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SetupButton } from "@/components/pipeline/SetupButton";

// Função para buscar os pipelines do usuário
const fetchPipelines = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("pipelines")
    .select("id, name")
    .eq("user_id", user.id)
    .order("order");
  if (error) {
    console.error("Erro ao buscar pipelines:", error);
    return [];
  }
  return data;
};

export default function Pipelines() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activePipelineId, setActivePipelineId] = useState<string>("");
  const [pipelineMenuCollapsed, setPipelineMenuCollapsed] = useState(false);
  const [sortOption, setSortOption] = useState("date-desc");

  const { data: pipelines = [] } = useQuery({
    queryKey: ["pipelines"],
    queryFn: fetchPipelines,
  });

  // Define o primeiro pipeline como ativo quando os dados são carregados
  useEffect(() => {
    if (pipelines.length > 0 && !activePipelineId) {
      setActivePipelineId(pipelines[0].id);
    }
  }, [pipelines, activePipelineId]);

  const activePipelineName = pipelines.find(p => p.id === activePipelineId)?.name || "Pipeline";
  
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] relative">
      <aside 
        className={cn(
          "border-r border-border bg-card relative transition-all duration-300 ease-in-out h-full overflow-y-auto",
          pipelineMenuCollapsed ? "w-0 opacity-0" : "w-[240px] opacity-100"
        )}
      >
        <PipelineGroupList 
          activePipelineId={activePipelineId}
          setActivePipelineId={setActivePipelineId}
        />
      </aside>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "absolute top-[70px] z-50 h-10 w-10 rounded-full border shadow-sm bg-background transition-all duration-300",
          pipelineMenuCollapsed ? "left-2" : "left-[230px]"
        )}
        onClick={() => setPipelineMenuCollapsed(!pipelineMenuCollapsed)}
      >
        {pipelineMenuCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <div className={cn(
        "flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out",
        pipelineMenuCollapsed ? "w-full pl-4" : "flex-1 p-4"
      )}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{activePipelineName}</h1>
            {activePipelineId && <SetupButton pipelineId={activePipelineId} />}
          </div>
          <div className="flex gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[200px] bg-white">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar por..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Data (mais recente)</SelectItem>
                <SelectItem value="date-asc">Data (mais antigo)</SelectItem>
                <SelectItem value="value-desc">Valor (maior primeiro)</SelectItem>
                <SelectItem value="value-asc">Valor (menor primeiro)</SelectItem>
                <SelectItem value="time-desc">
                  <div className="flex items-center"><Timer className="h-4 w-4 mr-1" /><span>Mais tempo na etapa</span></div>
                </SelectItem>
                <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 bg-white"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </div>
        
        {filterOpen && (
          <div className="mb-6">
            <PipelineFilters />
          </div>
        )}
        
        {activePipelineId ? (
          <KanbanBoard pipelineId={activePipelineId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg font-medium">Nenhum pipeline selecionado.</p>
            <p className="text-muted-foreground">Crie um grupo e um pipeline na barra lateral para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}