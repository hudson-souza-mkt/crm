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
import { 
  MoreHorizontal, MessageCircle, TrendingUp, Clock, Target, 
  Trophy, Medal, Gem, UserCheck, UserMinus, AlertCircle, BellRing
} from "lucide-react";
import { toast } from "sonner";
import { useContactAttempts } from "@/hooks/useContactAttempts";

// Adicionar campos para classificação ABC e status de cliente
export interface EnhancedLead extends Lead {
  classification?: 'A' | 'B' | 'C';
  clientStatus?: 'active' | 'inactive' | 'lead';
  leadQuality?: 'hot' | 'warm' | 'cold';
  lifetime?: number; // Valor vitalício em R$
  lastPurchase?: Date;
  purchaseCount?: number;
}

// Mock data atualizado com informações de segmentação
export const mockLeads: EnhancedLead[] = [
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
    },
    classification: "B",
    clientStatus: "active",
    leadQuality: "hot",
    lifetime: 12500,
    lastPurchase: new Date("2023-05-20"),
    purchaseCount: 3
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
    assignedTo: "Carlos Vendas",
    classification: "A",
    clientStatus: "active",
    leadQuality: "hot",
    lifetime: 67800,
    lastPurchase: new Date("2023-06-01"),
    purchaseCount: 5
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
    assignedTo: "Ana Sales",
    classification: "A",
    clientStatus: "active",
    leadQuality: "hot",
    lifetime: 125000,
    lastPurchase: new Date("2023-05-15"),
    purchaseCount: 6
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
    assignedTo: "Marcos Suporte",
    classification: "B",
    clientStatus: "active",
    leadQuality: "hot",
    lifetime: 36000,
    lastPurchase: new Date("2023-06-05"),
    purchaseCount: 3
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
    assignedTo: "",
    clientStatus: "lead",
    leadQuality: "warm",
  },
  {
    id: "6",
    name: "Carla Ferreira",
    phone: "(21) 99876-5432",
    email: "carla@example.com",
    company: "Modas CF",
    source: "manual",
    status: "lost",
    funnel: "Vendas",
    stage: "Perdido",
    tags: ["varejo", "pequeno porte"],
    notes: "Cliente optou por solução do concorrente - preço menor",
    value: 3500,
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-06-01"),
    lastContact: new Date("2023-06-01"),
    assignedTo: "Carlos Vendas",
    classification: "C",
    clientStatus: "inactive",
    leadQuality: "cold",
    lifetime: 3500,
    lastPurchase: new Date("2023-01-15"),
    purchaseCount: 1
  },
  {
    id: "7",
    name: "Roberto Almeida",
    phone: "(11) 97777-8888",
    email: "roberto@example.com",
    company: "Supermercados RA",
    source: "import",
    status: "qualified",
    funnel: "Vendas",
    stage: "Demonstração",
    tags: ["varejo", "médio porte"],
    notes: "Demonstração agendada para próxima semana",
    value: 18000,
    createdAt: new Date("2023-06-05"),
    updatedAt: new Date("2023-06-15"),
    lastContact: new Date("2023-06-15"),
    assignedTo: "Ana Sales",
    clientStatus: "lead",
    leadQuality: "hot",
  }
];

interface LeadListProps {
  filterOpen: boolean;
  onLeadClick: (lead: Lead) => void;
}

export function LeadList({ filterOpen, onLeadClick }: LeadListProps) {
  const [leads] = useState<EnhancedLead[]>(mockLeads);
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
  
  const getClassificationBadge = (classification?: 'A' | 'B' | 'C') => {
    if (!classification) return null;
    
    const badges = {
      A: {
        icon: Trophy,
        classes: "bg-amber-50 text-amber-700 border-amber-200",
        tooltip: "Cliente A - Alto valor"
      },
      B: {
        icon: Medal,
        classes: "bg-slate-50 text-slate-700 border-slate-200",
        tooltip: "Cliente B - Médio valor"
      },
      C: {
        icon: Gem,
        classes: "bg-indigo-50 text-indigo-700 border-indigo-200",
        tooltip: "Cliente C - Baixo valor"
      }
    };
    
    const { icon: Icon, classes, tooltip } = badges[classification];
    
    return (
      <Badge variant="outline" className={`${classes} gap-1`} title={tooltip}>
        <Icon className="h-3 w-3" />
        {classification}
      </Badge>
    );
  };
  
  const getClientStatusBadge = (clientStatus?: 'active' | 'inactive' | 'lead', leadQuality?: 'hot' | 'warm' | 'cold') => {
    if (!clientStatus) return null;
    
    const badges = {
      active: {
        icon: UserCheck,
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        tooltip: "Cliente ativo"
      },
      inactive: {
        icon: UserMinus,
        classes: "bg-rose-50 text-rose-700 border-rose-200",
        tooltip: "Cliente inativo"
      },
      lead: {
        icon: leadQuality === 'hot' ? BellRing : 
              leadQuality === 'warm' ? Target : AlertCircle,
        classes: leadQuality === 'hot' ? "bg-blue-50 text-blue-700 border-blue-200" : 
                leadQuality === 'warm' ? "bg-purple-50 text-purple-700 border-purple-200" : 
                "bg-slate-50 text-slate-700 border-slate-200",
        tooltip: leadQuality === 'hot' ? "Lead quente" : 
                leadQuality === 'warm' ? "Lead morno" : "Lead frio"
      }
    };
    
    const { icon: Icon, classes, tooltip } = badges[clientStatus];
    
    return (
      <Badge variant="outline" className={`${classes} gap-1`} title={tooltip}>
        <Icon className="h-3 w-3" />
        {clientStatus === 'lead' ? `Lead ${leadQuality || ''}` : 
         clientStatus === 'active' ? 'Ativo' : 'Inativo'}
      </Badge>
    );
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
  
  const getDaysSinceLastPurchase = (lastPurchase?: Date) => {
    if (!lastPurchase) return null;
    const days = Math.floor((new Date().getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24));
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
              <TableHead>Segmento</TableHead>
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
              const daysSinceLastPurchase = getDaysSinceLastPurchase(lead.lastPurchase);
              
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
                    <div className="flex flex-col gap-1">
                      {getClassificationBadge(lead.classification)}
                      {getClientStatusBadge(lead.clientStatus, lead.leadQuality)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{lead.value ? `R$ ${lead.value.toFixed(2)}` : "—"}</span>
                      {lead.lifetime && (
                        <span className="text-xs text-muted-foreground">
                          LTV: R$ {lead.lifetime.toLocaleString('pt-BR')}
                        </span>
                      )}
                      {lead.purchaseCount && (
                        <span className="text-xs text-muted-foreground">
                          {lead.purchaseCount} {lead.purchaseCount === 1 ? 'compra' : 'compras'}
                        </span>
                      )}
                    </div>
                  </TableCell>
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
                      
                      {lead.lastPurchase && (
                        <div className="mt-1">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Última compra: {daysSinceLastPurchase === 0 ? 'Hoje' : 
                              daysSinceLastPurchase === 1 ? 'Ontem' : 
                              `${daysSinceLastPurchase} dias atrás`}
                          </div>
                        </div>
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
                          <DropdownMenuItem>Alterar segmento</DropdownMenuItem>
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