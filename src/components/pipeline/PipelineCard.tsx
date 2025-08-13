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
  Trash2,
  FileText,
  CheckSquare,
  Heart,
  Eye,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

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
  tasksCount?: number;
  notesCount?: number;
  isFavorite?: boolean;
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
      case 'whatsapp':
        if (lead.phone) {
          const cleanPhone = lead.phone.replace(/\D/g, '');
          window.open(`https://wa.me/55${cleanPhone}`);
          toast.success('Abrindo WhatsApp...');
        }
        break;
      case 'call':
        if (lead.phone) {
          window.open(`tel:${lead.phone}`);
          toast.success('Iniciando ligação...');
        }
        break;
      case 'schedule':
        toast.info('Abrindo agendamento...');
        // Implementar modal de agendamento
        console.log('Agendar reunião com:', lead.name);
        break;
      case 'email':
        if (lead.email) {
          window.open(`mailto:${lead.email}`);
          toast.success('Abrindo email...');
        }
        break;
      case 'tasks':
        toast.info('Visualizando tarefas...');
        console.log('Ver tarefas do lead:', lead.id);
        break;
      case 'notes':
        toast.info('Visualizando notas...');
        console.log('Ver notas do lead:', lead.id);
        break;
      case 'favorite':
        toast.success(lead.isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
        console.log('Toggle favorite:', lead.id);
        break;
      case 'edit':
        toast.info('Abrindo edição...');
        console.log('Editar lead:', lead.id);
        break;
      case 'details':
        onCardClick(lead);
        break;
      case 'new-task':
        toast.info('Criando nova tarefa...');
        console.log('Nova tarefa para:', lead.id);
        break;
      case 'new-note':
        toast.info('Criando nova nota...');
        console.log('Nova nota para:', lead.id);
        break;
    }
  };

  return (
    <TooltipProvider>
      <div
        className={`
          bg-white rounded-lg border border-gray-200 cursor-pointer 
          hover:shadow-md transition-all duration-200 border-l-4 overflow-hidden
          ${getPriorityColor(lead.priority)}
          ${isDragging ? 'rotate-3 shadow-lg' : ''}
        `}
        onClick={() => onCardClick(lead)}
      >
        {/* Conteúdo Principal */}
        <div className="p-4 pb-2">
          {/* Header com Avatar e Nome */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {lead.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm truncate">{lead.name}</h4>
                {lead.isFavorite && (
                  <Heart className="h-3 w-3 text-red-500 fill-current" />
                )}
              </div>
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

          {/* Footer com informações */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
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
            <div className="pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Previsão: {formatDate(lead.expectedCloseDate) || "—"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Barra de Ações Rápidas */}
        <div className="bg-gray-50/80 px-3 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* Ações Primárias */}
            <div className="flex items-center gap-1">
              {/* WhatsApp */}
              {lead.phone && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-green-100"
                      onClick={(e) => handleQuickAction(e, 'whatsapp')}
                    >
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>WhatsApp</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Telefone */}
              {lead.phone && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-blue-100"
                      onClick={(e) => handleQuickAction(e, 'call')}
                    >
                      <Phone className="h-4 w-4 text-blue-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ligar</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Agendamento */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-purple-100"
                    onClick={(e) => handleQuickAction(e, 'schedule')}
                  >
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Agendar</p>
                </TooltipContent>
              </Tooltip>

              {/* Email */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-orange-100"
                    onClick={(e) => handleQuickAction(e, 'email')}
                    disabled={!lead.email}
                  >
                    <Mail className={`h-4 w-4 ${lead.email ? 'text-orange-600' : 'text-gray-400'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{lead.email ? 'Enviar Email' : 'Email não disponível'}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Contadores e Menu */}
            <div className="flex items-center gap-1">
              {/* Contador de Tarefas */}
              {(lead.tasksCount || 0) > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 hover:bg-blue-100"
                      onClick={(e) => handleQuickAction(e, 'tasks')}
                    >
                      <CheckSquare className="h-3 w-3 text-blue-600 mr-1" />
                      <span className="text-xs font-medium text-blue-600">{lead.tasksCount}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{lead.tasksCount} tarefa(s)</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Contador de Notas */}
              {(lead.notesCount || 0) > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 hover:bg-amber-100"
                      onClick={(e) => handleQuickAction(e, 'notes')}
                    >
                      <FileText className="h-3 w-3 text-amber-600 mr-1" />
                      <span className="text-xs font-medium text-amber-600">{lead.notesCount}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{lead.notesCount} nota(s)</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Menu de Ações Secundárias */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  {/* Criar nova tarefa/nota se não houver */}
                  {(!lead.tasksCount || lead.tasksCount === 0) && (
                    <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'new-task')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Tarefa
                    </DropdownMenuItem>
                  )}
                  
                  {(!lead.notesCount || lead.notesCount === 0) && (
                    <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'new-note')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nova Nota
                    </DropdownMenuItem>
                  )}
                  
                  {((!lead.tasksCount || lead.tasksCount === 0) || (!lead.notesCount || lead.notesCount === 0)) && (
                    <DropdownMenuSeparator />
                  )}
                  
                  <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'favorite')}>
                    <Heart className={`mr-2 h-4 w-4 ${lead.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                    {lead.isFavorite ? 'Desfavoritar' : 'Favoritar'}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'edit')}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={(e) => handleQuickAction(e, 'details')}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}