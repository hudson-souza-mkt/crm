import { useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import type { Lead } from "./PipelineCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

export type StageColor = "blue" | "purple" | "amber" | "green" | "red" | "pink" | "indigo" | "cyan" | "gray";

const mockLeads: Record<string, Lead[]> = {
  "Novo Lead": [
    { 
      id: "1", 
      name: "Hudson Souza", 
      company: "Sem empresa",
      phone: "(11) 98765-4321", 
      salesperson: "Hudson Souza Souza", 
      tags: [], 
      value: 0, 
      date: "13/06/2025",
      priority: "red",
      activities: false
    },
    { 
      id: "2", 
      name: "Maria Oliveira", 
      company: "Tech Solutions",
      phone: "(21) 91234-5678", 
      salesperson: "Ana Silva", 
      tags: [], 
      value: 0, 
      date: "15/06/2025",
      activities: false
    },
  ],
  "Qualificação": [
    { 
      id: "3", 
      name: "Hudson Souza", 
      company: "Sem empresa",
      phone: "(31) 99999-8888", 
      salesperson: "Hudson Souza Souza", 
      tags: [], 
      value: 500, 
      date: "13/06/2025",
      priority: "green",
      activities: false
    },
  ],
  "Conversando": [
    { 
      id: "4", 
      name: "Carlos Mendes", 
      company: "Startup XYZ",
      phone: "(21) 97777-8888", 
      salesperson: "Hudson Souza Souza", 
      tags: [], 
      value: 1200, 
      date: "20/06/2025",
      priority: "green",
      activities: false
    },
  ],
  "Proposta": [
    { 
      id: "5", 
      name: "Fernanda Lima", 
      company: "Empresa ABC",
      phone: "(11) 96666-5555", 
      salesperson: "Ana Silva", 
      tags: [], 
      value: 3500, 
      date: "25/06/2025",
      activities: false
    },
  ],
};

export function KanbanBoard() {
  const stages = ["Novo Lead", "Qualificação", "Conversando", "Proposta"];
  
  // Estado para armazenar as cores de cada etapa
  const [stageColors, setStageColors] = useState<Record<string, StageColor>>({
    "Novo Lead": "blue",
    "Qualificação": "purple",
    "Conversando": "amber",
    "Proposta": "green"
  });
  
  const getTotalValue = (leads: Lead[]) => {
    return leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  };
  
  const handleColorChange = (stage: string, color: StageColor) => {
    setStageColors((prev) => ({
      ...prev,
      [stage]: color
    }));
    
    toast.success(`Cor da etapa "${stage}" alterada com sucesso!`);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Aquisição e Qualificação</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white">
            <ArrowUpDown className="h-4 w-4" />
            <span>Ordenação</span>
          </Button>
        </div>
      </div>
      
      <div className="flex overflow-x-auto pb-6 gap-5">
        {stages.map((stage) => (
          <KanbanColumn 
            key={stage} 
            title={stage} 
            leads={mockLeads[stage] || []} 
            totalValue={getTotalValue(mockLeads[stage] || [])}
            count={(mockLeads[stage] || []).length}
            color={stageColors[stage]}
            onColorChange={(color) => handleColorChange(stage, color as StageColor)}
          />
        ))}
        <div className="flex-shrink-0 w-80 h-16 flex items-center justify-center">
          <Button variant="outline" className="w-full bg-white/80 border-dashed border-2">
            <Plus className="h-4 w-4 mr-2" />
            Nova coluna
          </Button>
        </div>
      </div>
    </div>
  );
}