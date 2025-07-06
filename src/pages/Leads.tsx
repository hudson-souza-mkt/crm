import { useState } from "react";
import { LeadList } from "@/components/leads/LeadList";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { LeadImportDialog } from "@/components/leads/LeadImportDialog";
import { LeadSegmentsNav } from "@/components/leads/LeadSegmentsNav";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Filter, Users, UserPlus, UserCheck, DollarSign, Calendar } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DealDetailDialog } from "@/components/pipeline/DealDetailDialog";
import { Lead as ListLead } from "@/types/lead";
import { Deal } from "@/types/pipeline";

// Função para mapear o tipo de lead da lista para o tipo de lead do diálogo de detalhes
const mapListLeadToDetailLead = (listLead: ListLead): Deal => {
  // Esta função se torna um pouco mais complexa, pois precisamos criar um objeto Deal
  // a partir de um Lead. Em um app real, provavelmente buscaríamos o deal associado.
  return {
    id: listLead.id, // Usando o ID do lead como placeholder
    name: listLead.name,
    value: listLead.value || 0,
    pipeline_stage_id: '', // Não temos essa info aqui
    pipeline_id: '', // Nem essa
    user_id: '', // Nem essa
    created_at: listLead.createdAt.toISOString(),
    updated_at: listLead.updatedAt.toISOString(),
    lead_id: listLead.id,
    leads: {
      name: listLead.name,
      company: listLead.company || null,
    }
  };
};

export default function Leads() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState("all");

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleLeadClick = (lead: ListLead) => {
    // Por enquanto, vamos apenas logar. A lógica de abrir detalhes de um lead
    // a partir daqui pode ser refinada depois.
    console.log("Lead clicado:", lead);
    toast.info("Visualização de detalhes do lead a ser implementada.");
    // const detailDeal = mapListLeadToDetailLead(lead);
    // setSelectedDeal(detailDeal);
    // setIsDetailDialogOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
      <aside>
        <LeadSegmentsNav activeSegment={activeSegment} setActiveSegment={setActiveSegment} />
      </aside>

      <div className="flex flex-col gap-6">
        {/* Dashboard de métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            title="Total de Contatos"
            value="2.347"
            icon={Users}
            change="+12% vs. mês passado"
            changeType="increase"
          />
          <MetricCard
            title="Leads Ativos"
            value="1.879"
            icon={UserPlus}
            change="+8.1% vs. mês passado"
            changeType="increase"
          />
          <MetricCard
            title="Clientes"
            value="468"
            icon={UserCheck}
            change="+15.3% vs. mês passado"
            changeType="increase"
          />
          <MetricCard
            title="Ticket Médio"
            value="R$ 1.250,00"
            icon={DollarSign}
            change="+5.2% vs. mês passado"
            changeType="increase"
          />
          <MetricCard
            title="LTV/Meses"
            value="4.2"
            icon={Calendar}
            change="+0.3 vs. mês passado"
            changeType="increase"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Leads e Clientes</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setFilterOpen(!filterOpen)}
              className="gap-1"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setImportDialogOpen(true)}
              className="gap-1"
            >
              <Upload className="h-4 w-4" />
              Importar
            </Button>
            <Button 
              onClick={() => setAddDialogOpen(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Novo Lead
            </Button>
          </div>
        </div>

        <LeadList filterOpen={filterOpen} onLeadClick={handleLeadClick} />
        
        <LeadFormDialog 
          open={addDialogOpen} 
          onOpenChange={setAddDialogOpen} 
          onSubmit={() => {}} // Será conectado em breve
        />
        
        <LeadImportDialog 
          open={importDialogOpen} 
          onOpenChange={setImportDialogOpen} 
        />

        <DealDetailDialog
          deal={selectedDeal}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />
      </div>
    </div>
  );
}