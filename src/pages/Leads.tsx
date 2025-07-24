import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Filter, Users, UserPlus, UserCheck, DollarSign, Calendar } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { LeadDetailDialog } from "@/components/pipeline/LeadDetailDialog";

// Interface unificada para Lead
export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  salesperson: string;
  tags: string[];
  value: number;
  date: string;
  priority?: 'red' | 'green';
  activities: boolean;
  document?: string;
  stage: string;
  stageUpdatedAt: string;
  utms?: Record<string, string>;
  atRisk?: boolean;
}

// Dados de exemplo atualizados com a nova interface
const mockLeads: Lead[] = [
  { 
    id: "1", 
    name: "Hudson Souza", 
    company: "Acme Corp", 
    phone: "(11) 98765-4321", 
    salesperson: "Amanda Vendas", 
    tags: ["potencial", "software"], 
    value: 0, 
    date: "13/06/2025",
    priority: "red",
    activities: false,
    stage: "Novo Lead",
    stageUpdatedAt: new Date().toISOString(),
  },
  { 
    id: "2", 
    name: "Maria Oliveira", 
    company: "Tech Solutions", 
    phone: "(21) 91234-5678", 
    salesperson: "Carlos Almeida", 
    tags: ["novo", "médio porte"], 
    value: 0, 
    date: "15/06/2025",
    activities: true,
    stage: "Novo Lead",
    stageUpdatedAt: new Date().toISOString(),
  },
  { 
    id: "4", 
    name: "João Pereira", 
    company: "Empresa Regional", 
    phone: "(31) 99999-8888", 
    salesperson: "Carlos Almeida", 
    tags: ["consultoria"], 
    value: 500, 
    date: "13/06/2025",
    priority: "green",
    activities: false,
    stage: "Qualificação",
    stageUpdatedAt: new Date().toISOString(),
  },
  { 
    id: "7", 
    name: "Fernanda Lima", 
    company: "Empresa ABC", 
    phone: "(11) 96666-5555", 
    salesperson: "Carlos Almeida", 
    tags: ["software", "médio porte"], 
    value: 3500, 
    date: "25/06/2025",
    activities: true,
    stage: "Proposta",
    stageUpdatedAt: new Date().toISOString(),
  },
  { 
    id: "10", 
    name: "Ricardo Santos", 
    company: "Santos Digital", 
    phone: "(47) 98888-7777", 
    salesperson: "Amanda Vendas", 
    tags: ["tech", "fidelizado"], 
    value: 7800, 
    date: "05/06/2025",
    activities: false,
    stage: "Ganho",
    stageUpdatedAt: new Date().toISOString(),
  },
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus leads em um só lugar.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total de Leads" 
          value={leads.length.toString()} 
          icon={Users} 
          change="+12% vs mês passado" 
        />
        <MetricCard 
          title="Novos Leads (Mês)" 
          value="32" 
          icon={UserPlus} 
          change="+8% vs mês passado" 
        />
        <MetricCard 
          title="Leads Convertidos" 
          value="18" 
          icon={UserCheck} 
          change="-2% vs mês passado" 
        />
        <MetricCard 
          title="Valor em Aberto" 
          value={`R$ ${leads.reduce((acc, l) => acc + l.value, 0).toLocaleString()}`} 
          icon={DollarSign} 
          change="+20% vs mês passado" 
        />
      </div>

      {/* Filtros e Tabela */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Buscar por nome ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Valor (R$)</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} onClick={() => handleRowClick(lead)} className="cursor-pointer">
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.salesperson}</TableCell>
                  <TableCell>{lead.value.toLocaleString()}</TableCell>
                  <TableCell>{lead.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {lead.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Diálogo de Detalhes do Lead */}
      <LeadDetailDialog
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={() => setSelectedLead(null)}
      />
    </div>
  );
}