import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeadFilters } from "./LeadFilters";
import { ContactAttemptButton } from "./ContactAttemptButton";
import { Lead, LeadSource, LeadStatus } from "@/types/lead";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle, TrendingUp, Clock, Target } from "lucide-react";
import { toast } from "sonner";
import { useContactAttempts } from "@/hooks/useContactAttempts";

// Mock data for leads (mantendo o mesmo)
export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "(11) 98765-4321",
    email: "joao@example.com",
    company: "ABC Corp",
    document: "111.222.333-44",
    source: "chat",
    status: "new",
    funnel: "Aquisição",
    stage: "Novo Lead",
    tags: ["potencial", "software"],
    notes: "Interessado em nosso produto principal",
    value: 5000,
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-15"),
    lastContact: new Date("2023-06-15"),
    assignedTo: "Ana Sales",
    utms: {
      utm_source: "facebook",
      utm_medium: "social",
      utm_campaign: "lancamento_feature_x",
    }
  },
  {
    id: "2",
    name: "Maria Santos",
    phone: "(21) 98765-1234",
    email: "maria@example.com",
    company: "Tech Solutions",
    document: "12.345.678/0001-99",
    source: "manual",
    status: "qualified",
    funnel: "Vendas",
    stage: "Qualificação",
    tags: ["tech", "médio porte"],
    notes: "Solicitou demonstração do produto",
    value: 8500,
    createdAt: new Date("2023-05-25"),
    updatedAt: new Date("2023-06-12"),
    lastContact: new Date("2023-06-12"),
    assignedTo: "Carlos Vendas"
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    phone: "(31) 91234-5678",
    email: "pedro@example.com",
    company: "Construtora Oliveira",
    source: "import",
    status: "negotiating",
    funnel: "Vendas",
    stage: "Proposta",
    tags: ["construção", "alto valor"],
    notes: "Enviada proposta comercial - aguardando retorno",
    value: 25000,
    createdAt: new Date("2023-04-18"),
    updatedAt: new Date("2023-06-10"),
    lastContact: new Date("2023-06-10"),
    assignedTo: "Ana Sales"
  },
  {
    id: "4",
    name: "Ana Pereira",
    phone: "(11) 97654-3210",
    email: "ana@example.com",
    company: "Consultoria AP",
    source: "webhook",
    status: "won",
    funnel: "Onboarding",
    stage: "Contrato",
    tags: ["consultoria", "fidelizado"],
    notes: "Contrato assinado - iniciar onboarding",
    value: 12000,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-06-08"),
    lastContact: new Date("2023-06-08"),
    assignedTo: "Marcos Suporte"
  },
  {
    id: "5",
    name: "Lucas Mendes",
    phone: "(47) 98888-7777",
    email: "lucas@example.com",
    company: "",
    source: "chat",
    status: "new",
    funnel: "Aquisição",
    stage: "Novo Lead",
    tags: ["individual", "baixo ticket"],
    notes: "Entrou em contato pelo chat - precisa de mais informações",
    value: 1200,
    createdAt: new Date("2023-06-14"),
    updatedAt: new Date("2023-06-14"),
    lastContact: new Date("2023-06-14"),
    assignedTo: ""
  }
];

interface LeadListProps {
  filterOpen: boolean;
  onLeadClick: (lead: Lead) => void;
}

export function LeadList({ filterOpen, onLeadClick }: LeadListProps) {
  const [leads] = useState<Lead[]>(mockLeads);
  const { getContactAttemptSummary } = useContactAttempts();
  
  const handleChatWithLead = (lead: Lead) => {
    toast.success(`Iniciando chat com ${lead.name}`);
  };
  
  const getSourceLabel = (source: LeadSource) => {
    const sources = {
      chat: "Chat",
      manual: "Manual",
      import: "Importação",
      webhook: "Sistema Externo"
    };
    return sources[source];
  };
  
  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      qualified: "bg-purple-50 text-purple-700 border-purple-200",
      negotiating: "bg-amber-50 text-amber-700 border-amber-200",
      won: "bg-green-50 text-green-700 border-green-200",
      lost: "bg-gray-50 text-gray-700 border-gray-200"
    };
    return colors[status];
  };

  const getAttemptStatusColor = (summary: any) => {
    if (summary.totalAttempts === 0) return "text-gray-400";
    
    const successRate = summary.successfulAttempts / summary.totalAttempts;
    if (successRate >= 0.7) return "text-green-600";
    if (successRate >= 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  const getDaysSinceLastAttempt = (lastAttempt?: Date) => {
    if (!lastAttempt) return null;
    const days = Math.floor((new Date().getTime() - lastAttempt.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };
  
  return (
    <div className="space-y-4">
      {filterOpen && <LeadFilters />}
      
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Tentativas</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Último Contato</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map(lead => {
              const attemptSummary = getContactAttemptSummary(lead.id);
              const daysSinceLastAttempt = getDaysSinceLastAttempt(attemptSummary.lastAttempt);
              
              return (
                <TableRow 
                  key={lead.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onLeadClick(lead)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {lead.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{lead.name}</span>
                        {lead.email && <span className="text-xs text-muted-foreground">{lead.email}</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.company || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      {getSourceLabel(lead.source)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(lead.status)}>
                      {lead.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {attemptSummary.totalAttempts > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Target className={`h-4 w-4 ${getAttemptStatusColor(attemptSummary)}`} />
                            <span className={`font-medium ${getAttemptStatusColor(attemptSummary)}`}>
                              {attemptSummary.totalAttempts}
                            </span>
                          </div>
                          
                          {attemptSummary.successfulAttempts > 0 && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {Math.round((attemptSummary.successfulAttempts / attemptSummary.totalAttempts) * 100)}%
                            </Badge>
                          )}
                          
                          {daysSinceLastAttempt !== null && daysSinceLastAttempt > 7 && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Clock className="h-3 w-3 mr-1" />
                              {daysSinceLastAttempt}d
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nenhuma</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{lead.value ? `R$ ${lead.value.toFixed(2)}` : "—"}</TableCell>
                  <TableCell>
                    <div>
                      {attemptSummary.lastAttempt ? (
                        <div>
                          <div className="text-sm">
                            {attemptSummary.lastAttempt.toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {daysSinceLastAttempt === 0 ? 'Hoje' : 
                             daysSinceLastAttempt === 1 ? 'Ontem' : 
                             `${daysSinceLastAttempt} dias atrás`}
                          </div>
                        </div>
                      ) : (
                        lead.lastContact?.toLocaleDateString('pt-BR') || "—"
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{lead.assignedTo || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ContactAttemptButton 
                        lead={lead} 
                        variant="ghost" 
                        size="sm"
                        showCount={false}
                      />
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatWithLead(lead);
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Criar negócio</DropdownMenuItem>
                          <DropdownMenuItem>Adicionar tag</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}