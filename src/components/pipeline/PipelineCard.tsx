import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  Building, 
  Calendar,
  DollarSign,
  Clock,
  User,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isValid } from "date-fns";
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

  const formatDate = (date?: Date) => {
    if (!date || !isValid(date)) return null;
    try {
      return format(date, "dd/MM", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return null;
    }
  };

  const handleQuickAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    
    switch (action) {
      case 'call':
        if (lead.phone) {
          window.open(`tel:${lead.phone}`);
        }
        break;
      case 'email':
        if (lead.email) {
          window.open(`mailto:${lead.email}`);
        }
        break;
      case 'whatsapp':
        if (lead.phone) {
          const cleanPhone = lead.phone.replace(/\D/g, '');
          window.open(`https://wa.me/55${cleanPhone}`);
        }
        break;
      case 'edit':
        // Implementar edição
        console.log('Editar lead:', lead.id);
        break;
      case 'delete':
        // Implementar exclusão
        console.log('Excluir lead:', lead.id);
        break;
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 p-4 cursor-pointer 
        hover:shadow-md transition-all duration-200 border-l-4 relative group
        ${getPriorityColor(lead.priority)}
        ${isDragging ? 'rotate-3 shadow-lg' : ''}
      `}
      onClick={() => onCardClick(lead)}
    >
      {/* Ícones de Ação Rápida */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          {lead.phone && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 hover:bg-green-100"
              onClick={(e) => handleQuickAction(e, 'call')}
              title="Ligar"
            >
              <Phone className="h-3 w-3 text-green-600" />
            </Button>
          )}
          
          {lead.phone && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 hover:bg-green-100"
              onClick={(e) => handleQuickAction(e, 'whatsapp')}
              title="WhatsApp"
            >
              <MessageSquare className="h-3 w-3 text-green-600" />
            </Button>
          )}
          
          {lead.email && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 hover:bg-blue-100"
              onClick={(e) => handleQuickAction(e, 'email')}
              title="Email"
            >
              <Mail className="h-3 w-3 text-blue-600" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'edit')}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => handleQuickAction(e, 'delete')}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Header com Avatar e Nome */}
      <div className="flex items-start gap-3 mb-3 pr-8">
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
            <span>{formatDate(lead.lastContact) || "—"}</span>
          </div>
        )}
      </div>

      {/* Data de fechamento esperada */}
      {lead.expectedCloseDate && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Previsão: {formatDate(lead.expectedCloseDate) || "—"}</span>
          </div>
        </div>
      )}
    </div>
  );
}