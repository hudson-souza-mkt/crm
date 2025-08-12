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
  const [isHovered, setIsHovered] = useState(false);
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
        "bg-white border border-border rounded-sm p-3 cursor-pointer transition-all duration-200 group",
        "hover:shadow-md hover:border-primary/20",
        isDragging && "opacity-50 rotate-2 shadow-lg",
        lead.atRisk && "border-l-4 border-l-red-500"
      )}
      onClick={() => onCardClick(lead)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header com nome e ações rápidas */}
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

        {/* Ações rápidas - visíveis no hover */}
        <div className={cn(
          "flex items-center gap-1 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0 md:opacity-0",
          "sm:opacity-100" // Sempre visível em mobile
        )}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={handleWhatsAppClick}
                >
                  <MessageSquareMore className="h-3 w-3" />
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
                  className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={handleCallClick}
                >
                  <PhoneCall className="h-3 w-3" />
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
                  className="h-6 w-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  onClick={handleScheduleClick}
                >
                  <CalendarPlus className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Agendar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEmailClick} disabled={!lead.email}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTaskClick}>
                <CheckSquare className="mr-2 h-4 w-4" />
                Tarefas {lead.tasksCount && `(${lead.tasksCount})`}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNotesClick}>
                <FileText className="mr-2 h-4 w-4" />
                Notas {lead.notesCount && `(${lead.notesCount})`}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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

      {/* Valor e prioridade */}
      <div className="flex items-center justify-between mb-3">
        {lead.value && lead.value > 0 ? (
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <DollarSign className="h-3 w-3" />
            <span>{formatCurrency(lead.value)}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Valor não definido</span>
        )}
        
        {lead.priority && (
          <Badge variant="outline" className={cn("text-xs", getPriorityColor(lead.priority))}>
            {lead.priority === "red" ? "Alta" : lead.priority === "yellow" ? "Média" : "Baixa"}
          </Badge>
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
      <div className="flex items-center justify-between text-xs text-muted-foreground">
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
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          {lead.activities && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1 text-xs text-blue-600">
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
                  <div className="flex items-center gap-1 text-xs text-green-600">
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

        <span className="text-xs text-muted-foreground">{lead.date}</span>
      </div>
    </div>
  );
}