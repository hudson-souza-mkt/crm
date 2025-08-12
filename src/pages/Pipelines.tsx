import { useState } from "react";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { PipelineFilters } from "@/components/pipeline/PipelineFilters";
import { PipelineGroupList } from "@/components/pipeline/PipelineGroupList";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown, ChevronLeft, ChevronRight, Calendar, Timer, Columns } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SetupButton } from "@/components/pipeline/SetupButton";

export default function Pipelines() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("group1");
  const [activePipelineId, setActivePipelineId] = useState("pipeline1");
  const [pipelineMenuCollapsed, setPipelineMenuCollapsed] = useState(false);
  const [sortOption, setSortOption] = useState("date-desc");
  
  // Mapeamento de nomes de pipelines (em um app real, isso viria de uma API)
  const pipelineNames: Record<string, string> = {
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
    <div className="flex h-[calc(100vh-theme(spacing.16))] sm:h-[calc(100vh-theme(spacing.20))] relative">
      <aside 
        className={cn(
          "border-r border-border bg-white relative transition-all duration-300 ease-in-out h-full overflow-y-auto",
          pipelineMenuCollapsed ? "w-0 opacity-0" : "w-[260px] sm:w-[280px] opacity-100"
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
        variant="outline" 
        size="icon" 
        className={cn(
          "absolute top-[60px] sm:top-[70px] z-50 h-7 w-7 sm:h-8 sm:w-8 rounded-sm border shadow-sm bg-white transition-all duration-300",
          pipelineMenuCollapsed ? "left-2" : "left-[250px] sm:left-[270px]"
        )}
        onClick={togglePipelineMenu}
      >
        {pipelineMenuCollapsed ? 
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" /> : 
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        }
      </Button>
      
      <div className={cn(
        "flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out bg-white",
        pipelineMenuCollapsed ? "w-full pl-3 sm:pl-4" : "flex-1 p-3 sm:p-4"
      )}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Columns className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold truncate">
                {pipelineNames[activePipelineId] || "Pipeline"}
              </h1>
            </div>
            <div className="hidden sm:block">
              <SetupButton />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] bg-white h-8 sm:h-9 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  <SelectValue placeholder="Ordenar por..." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Data (mais recente)</SelectItem>
                <SelectItem value="date-asc">Data (mais antigo)</SelectItem>
                <SelectItem value="value-desc">Valor (maior primeiro)</SelectItem>
                <SelectItem value="value-asc">Valor (menor primeiro)</SelectItem>
                <SelectItem value="time-desc">
                  <div className="flex items-center">
                    <Timer className="h-4 w-4 mr-1" />
                    <span>Mais tempo na etapa</span>
                  </div>
                </SelectItem>
                <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 h-8 sm:h-9 text-xs sm:text-sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </div>
        
        {filterOpen && (
          <div className="mb-4 sm:mb-6">
            <PipelineFilters />
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
}