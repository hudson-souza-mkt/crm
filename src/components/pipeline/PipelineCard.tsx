import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, 
  Mail, 
  Building, 
  Calendar,
  DollarSign,
  Clock,
  User,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  source?: string;
  stage: string;
  value?: number;
  discount?: number; // Percentual de desconto
  shippingCost?: number; // Custo do frete
  expectedCloseDate?: Date;
  createdAt?: Date;
  stageUpdatedAt?: Date;
  assignedTo?: string;
  tags?: string[];
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  lastContact?: Date;
  nextFollowUp?: Date;
}

interface PipelineCardProps {
  lead: Lead;
  onCardClick: (lead: Lead) => void;
  isDragging?: boolean;
}

export function PipelineCard({ lead, onCardClick, isDragging }: PipelineCardProps) {
  const totalValue = (lead.value || 0) - ((lead.value || 0) * (lead.discount || 0) / 100) + (lead.shippingCost || 0);
  
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-4 cursor-pointer 
        hover:shadow-md transition-all duration-200 border-l-4
        ${getPriorityColor(lead.priority)}
        ${isDragging ? 'rotate-3 shadow-lg' : ''}
      `}
      onClick={() => onCardClick(lead)}
    >
      {/* Header com Avatar e Nome */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-8 w-8 border">
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {lead.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{lead.name}</h4>
          {lead.company && (
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <Building className="h-3 w-3" />
              {lead.company}
            </p>
          )}
        </div>
      </div>

      {/* Valor */}
      {lead.value && (
        <div className="mb-3">
          <div className="flex items-center gap-1 text-lg font-bold text-primary">
            <DollarSign className="h-4 w-4" />
            {formatCurrency(totalValue)}
          </div>
          {(lead.discount || lead.shippingCost) && (
            <div className="text-xs text-muted-foreground">
              {lead.discount && `Desc. ${lead.discount}%`}
              {lead.discount && lead.shippingCost && ' • '}
              {lead.shippingCost && `Frete ${formatCurrency(lead.shippingCost)}`}
            </div>
          )}
        </div>
      )}

      {/* Contato */}
      <div className="space-y-1 mb-3">
        {lead.phone && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span className="truncate">{lead.phone}</span>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {lead.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {lead.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{lead.tags.length - 2}
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {lead.assignedTo ? (
            <>
              <User className="h-3 w-3" />
              <span className="truncate">{lead.assignedTo}</span>
            </>
          ) : (
            <span>Não atribuído</span>
          )}
        </div>
        
        {lead.lastContact && (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{format(lead.lastContact, "dd/MM", { locale: ptBR })}</span>
          </div>
        )}
      </div>

      {/* Data de fechamento esperada */}
      {lead.expectedCloseDate && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Previsão: {format(lead.expectedCloseDate, "dd/MM", { locale: ptBR })}</span>
          </div>
        </div>
      )}
    </div>
  );
}