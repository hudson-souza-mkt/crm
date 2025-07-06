import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeadFilters } from "./LeadFilters";
import { Lead, LeadSource, LeadStatus } from "@/types/lead";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const fetchLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  // Precisamos garantir que os dados retornados correspondam à interface Lead
  return data.map(lead => ({
    ...lead,
    tags: lead.tags || [],
    createdAt: new Date(lead.created_at),
    updatedAt: new Date(lead.updated_at),
    lastContact: lead.last_contact ? new Date(lead.last_contact) : undefined,
  })) as Lead[];
};

interface LeadListProps {
  filterOpen: boolean;
  onLeadClick: (lead: Lead) => void;
}

export function LeadList({ filterOpen, onLeadClick }: LeadListProps) {
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: fetchLeads,
  });
  
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
    return sources[source] || "Desconhecida";
  };
  
  const getStatusColor = (status: LeadStatus) => {
    const colors = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      qualified: "bg-purple-50 text-purple-700 border-purple-200",
      negotiating: "bg-amber-50 text-amber-700 border-amber-200",
      won: "bg-green-50 text-green-700 border-green-200",
      lost: "bg-gray-50 text-gray-700 border-gray-200"
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
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
              <TableHead>Valor</TableHead>
              <TableHead>Último Contato</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={10}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              leads.map(lead => (
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
                      {lead.stage || lead.status}
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
                  <TableCell>{lead.value ? `R$ ${lead.value.toFixed(2)}` : "—"}</TableCell>
                  <TableCell>{lead.lastContact?.toLocaleDateString() || "—"}</TableCell>
                  <TableCell>{lead.assignedTo || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}