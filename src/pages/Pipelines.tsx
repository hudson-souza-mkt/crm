import { useState } from "react";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { PipelineFilters } from "@/components/pipeline/PipelineFilters";
import { PipelineGroupList } from "@/components/pipeline/PipelineGroupList";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown } from "lucide-react";

export default function Pipelines() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("group1");
  const [activePipelineId, setActivePipelineId] = useState("pipeline1");
  
  // Mapeamento de nomes de pipelines (em um app real, isso viria de uma API)
  const pipelineNames = {
    "pipeline1": "Funil de Qualificação",
    "pipeline2": "Funil de Conversão",
    "pipeline3": "Produtos Digitais",
    "pipeline4": "Consultoria",
    "pipeline5": "Onboarding",
    "pipeline6": "Fidelização"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 h-[calc(100vh-theme(spacing.16))]">
      <aside className="overflow-y-auto">
        <PipelineGroupList 
          activeGroupId={activeGroupId}
          activePipelineId={activePipelineId}
          setActiveGroupId={setActiveGroupId}
          setActivePipelineId={setActivePipelineId}
        />
      </aside>
      
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{pipelineNames[activePipelineId] || "Pipeline"}</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 bg-white"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white">
              <ArrowUpDown className="h-4 w-4" />
              <span>Ordenação</span>
            </Button>
          </div>
        </div>
        
        {filterOpen && (
          <div className="mb-6">
            <PipelineFilters />
          </div>
        )}
        
        <KanbanBoard />
      </div>
    </div>
  );
}