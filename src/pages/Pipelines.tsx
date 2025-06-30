import { useState } from "react";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { PipelineFilters } from "@/components/pipeline/PipelineFilters";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown } from "lucide-react";

export default function Pipelines() {
  const [filterOpen, setFilterOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Aquisição e Qualificação</h1>
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
  );
}