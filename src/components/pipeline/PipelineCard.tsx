import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  CheckSquare,
  Clock,
  AlertTriangle,
  User,
  Building,
  DollarSign,
  MoreHorizontal,
  MessageSquareMore,
  CalendarPlus,
  PhoneCall,
  Edit,
  Eye,
  FileText,
  Star,
  StarOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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

export interface UTMs {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  salesperson: string;
  tags: string[];
  value?: number;
  date: string;
  priority?: "red" | "yellow" | "green";
  activities?: boolean;
  document?: string;
  stage?: string;
  stageUpdatedAt?: string;
  atRisk?: boolean;
  utms?: UTMs;
  isFavorite?: boolean;
  lastContact?: string;
  nextFollowUp?: string;
  tasksCount?: number;
  notesCount?: number;
}

interface PipelineCardProps {
  lead: Lead;
  onCardClick: (lead: Lead) => void;
  isDragging?: boolean;
}

export function PipelineCard({ lead, onCardClick, isDragging }: PipelineCardProps) {
  const [isFavorite, setIsFavorite] = useState(lead.isFavorite || false);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "red": return "bg-red-100 text-red-700 border-red-200";
      case "yellow": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "green": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTimeInStage = () => {
    if (!lead.stageUpdatedAt) return null;
    const stageDate = new Date(lead.stageUpdatedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - stageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 dia";
    if (diffDays < 7) return `${diffDays} dias`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas`;
    return `${Math.floor(diffDays / 30)} meses`;
  };

  // Ações rápidas
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${lead.name}, tudo bem? Sou da ${lead.company || 'nossa empresa'} e gostaria de conversar com você sobre nossa proposta.`);
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
    toast.success(`WhatsApp aberto para ${lead.name}`);
  };

  const handleScheduleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Aqui você integraria com um sistema de agendamento
    toast.success(`Agendamento iniciado para ${lead.name}`);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Aqui você integraria com um sistema de telefonia
    window.open(`tel:${lead.phone}`, '_self');
    toast.success(`Ligação iniciada para ${lead.name}`);
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lead.email) {
      const subject = encodeURIComponent(`Proposta comercial - ${lead.company || lead.name}`);
      const body = encodeURIComponent(`Olá ${lead.name},\n\nEspero que esteja bem. Gostaria de apresentar nossa proposta comercial...\n\nAtenciosamente,\n${lead.salesperson}`);
      window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_self');
      toast.success(`Email aberto para ${lead.name}`);
    } else {
      toast.error("Email não cadastrado para este lead");
    }
  };

  const handleTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Aqui você abriria um modal de tarefas ou navegaria para a página de tarefas
    toast.success(`Tarefas abertas para ${lead.name}`);
  };

  const handleNotesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Aqui você abriria um modal de notas
    toast.success(`Notas abertas para ${lead.name}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Aqui você abriria um modal de edição
    toast.success(`Editando ${lead.name}`);
  };

  const timeInStage = getTimeInStage();

  return (
    <div
      className={cn(
        "bg-white border border-border rounded-sm overflow-hidden cursor-pointer transition-all duration-200 group",
        "hover:shadow-md hover:border-primary/20",
        isDragging && "opacity-50 rotate-2 shadow-lg",
        lead.atRisk && "border-l-4 border-l-red-500"
      )}
      onClick={() => onCardClick(lead)}
    >
      {/* Conteúdo principal do card */}
      <div className="p-3">
        {/* Header com nome e indicadores */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{lead.name}</h4>
              {isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />}
              {lead.atRisk && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Lead em risco</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {lead.company && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Building className="h-3 w-3" />
                <span className="truncate">{lead.company}</span>
              </div>
            )}
          </div>

          {/* Prioridade */}
          {lead.priority && (
            <Badge variant="outline" className={cn("text-xs", getPriorityColor(lead.priority))}>
              {lead.priority === "red" ? "Alta" : lead.priority === "yellow" ? "Média" : "Baixa"}
            </Badge>
          )}
        </div>

        {/* Informações de contato */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{formatPhone(lead.phone)}</span>
          </div>
          {lead.email && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
        </div>

        {/* Valor */}
        <div className="mb-3">
          {lead.value && lead.value > 0 ? (
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <DollarSign className="h-3 w-3" />
              <span>{formatCurrency(lead.value)}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Valor não definido</span>
          )}
        </div>

        {/* Tags */}
        {lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {lead.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                {tag}
              </Badge>
            ))}
            {lead.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                +{lead.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Informações de tempo e atividade */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{lead.salesperson}</span>
          </div>
          
          {timeInStage && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeInStage}</span>
            </div>
          )}
        </div>

        {/* Indicadores de atividade */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {lead.activities && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Calendar className="h-3 w-3" />
                      <span>Atividade</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Possui atividades agendadas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {lead.lastContact && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-green-600">
                      <MessageCircle className="h-3 w-3" />
                      <span>Contato</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Último contato: {lead.lastContact}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <span>{lead.date}</span>
        </div>
      </div>

      {/* Barra de ações rápidas */}
      <div className="border-t border-border bg-gray-50/50 px-2 py-2">
        <div className="flex items-center justify-between">
          {/* Ações principais */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-sm"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageSquareMore className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">WhatsApp</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-sm"
                    onClick={handleCallClick}
                  >
                    <PhoneCall className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Ligar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-sm"
                    onClick={handleScheduleClick}
                  >
                    <CalendarPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Agendar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-sm",
                      !lead.email && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={handleEmailClick}
                    disabled={!lead.email}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{lead.email ? "Enviar email" : "Email não cadastrado"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Contadores e ações secundárias */}
          <div className="flex items-center gap-1">
            {/* Contadores de tarefas e notas */}
            {(lead.tasksCount && lead.tasksCount > 0) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-sm relative"
                      onClick={handleTaskClick}
                    >
                      <CheckSquare className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {lead.tasksCount}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{lead.tasksCount} tarefa{lead.tasksCount > 1 ? 's' : ''}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {(lead.notesCount && lead.notesCount > 0) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-sm relative"
                      onClick={handleNotesClick}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {lead.notesCount}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{lead.notesCount} nota{lead.notesCount > 1 ? 's' : ''}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Menu de ações secundárias */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-sm"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Ações de tarefas e notas se não tiver contadores */}
                {(!lead.tasksCount || lead.tasksCount === 0) && (
                  <DropdownMenuItem onClick={handleTaskClick}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Nova tarefa
                  </DropdownMenuItem>
                )}
                
                {(!lead.notesCount || lead.notesCount === 0) && (
                  <DropdownMenuItem onClick={handleNotesClick}>
                    <FileText className="mr-2 h-4 w-4" />
                    Nova nota
                  </DropdownMenuItem>
                )}

                {((!lead.tasksCount || lead.tasksCount === 0) || (!lead.notesCount || lead.notesCount === 0)) && (
                  <DropdownMenuSeparator />
                )}

                <DropdownMenuItem onClick={handleFavoriteClick}>
                  {isFavorite ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                  {isFavorite ? "Remover favorito" : "Adicionar favorito"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditClick}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar lead
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCardClick(lead)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalhes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}