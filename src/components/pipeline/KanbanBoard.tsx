import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import type { Lead } from "./PipelineCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { LeadDetailDialog } from "./LeadDetailDialog";
import { supabase } from "@/integrations/supabase/client";
import type { Stage } from "@/components/settings/PipelineSettings";

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
      activities: false,
      document: "111.222.333-44",
      utms: {
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "vendas_software_2024",
        utm_term: "crm_para_vendas",
        utm_content: "anuncio_principal"
      }
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
      activities: false,
      document: "12.345.678/0001-99",
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
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pipeline_stages")
      .select("id, name, order, color")
      .order("order", { ascending: true });

    if (error) {
      toast.error("Falha ao carregar as etapas do pipeline.");
      console.error(error);
    } else {
      setStages(data as Stage[]);
    }
    setLoading(false);
  };

  const handleCardClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDialogOpen(true);
  };
  
  const getTotalValue = (leads: Lead[]) => {
    return leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  };
  
  const handleColorChange = async (stageId: string, color: StageColor) => {
    const { error } = await supabase
      .from("pipeline_stages")
      .update({ color })
      .eq("id", stageId);

    if (error) {
      toast.error("Falha ao atualizar a cor da etapa.");
    } else {
      toast.success("Cor da etapa atualizada!");
      fetchStages(); // Recarrega para refletir a mudança
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-full"><p>Carregando pipeline...</p></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex overflow-x-auto pb-6 gap-5">
        {stages.map((stage) => (
          <KanbanColumn 
            key={stage.id} 
            title={stage.name} 
            leads={mockLeads[stage.name] || []} // Temporariamente usando mock data
            totalValue={getTotalValue(mockLeads[stage.name] || [])}
            count={(mockLeads[stage.name] || []).length}
            color={stage.color as StageColor}
            onColorChange={(color) => handleColorChange(stage.id, color as StageColor)}
            onCardClick={handleCardClick}
          />
        ))}
        <div className="flex-shrink-0 w-80 h-16 flex items-center justify-center">
          <Button variant="outline" className="w-full bg-white/80 border-dashed border-2">
            <Plus className="h-4 w-4 mr-2" />
            Nova coluna
          </Button>
        </div>
      </div>
      <LeadDetailDialog 
        lead={selectedLead}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}