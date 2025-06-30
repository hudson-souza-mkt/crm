import { useState } from "react";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { PipelineFilters } from "@/components/pipeline/PipelineFilters";
import { PipelineGroupList } from "@/components/pipeline/PipelineGroupList";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pipelines() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("group1");
  const [activePipelineId, setActivePipelineId] = useState("pipeline1");
  const [pipelineMenuCollapsed, setPipelineMenuCollapsed] = useState(false);
  
  // Mapeamento de nomes de pipelines (em um app real, isso viria de uma API)
  const pipelineNames = {
    "pipeline1": "Funil de Qualificação",
    "pipeline2": "Funil de Conversão",
    "pipeline3": "Produtos Digitais",
    "pipeline4": "Consultoria",
    "pipeline5": "Onboarding",
    "pipeline6": "Fidelização"
  };
  
  const togglePipelineMenu = () => {
    setPipelineMenuCollapsed(!pipelineMenuCollapsed);
  };
  
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] relative">
      <aside 
        className={cn(
          "border-r border-border bg-card relative transition-all duration-300 ease-in-out h-full overflow-y-auto",
          pipelineMenuCollapsed ? "w-0 opacity-0" : "w-[240px] opacity-100"
        )}
      >
        <PipelineGroupList 
          activeGroupId={activeGroupId}
          activePipelineId={activePipelineId}
          setActiveGroupId={setActiveGroupId}
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
        onClick={togglePipelineMenu}
      >
        {pipelineMenuCollapsed ? 
          <ChevronRight className="h-4 w-4" /> : 
          <ChevronLeft className="h-4 w-4" />
        }
      </Button>
      
      <div className={cn(
        "flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out",
        pipelineMenuCollapsed ? "w-full pl-4" : "flex-1 p-4"
      )}>
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