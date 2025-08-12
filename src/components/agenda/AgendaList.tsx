import { useState } from "react";
import { AgendaItem, AgendaItemType, AgendaStatus } from "@/types/agenda";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Calendar,
  Clock,
  MoreHorizontal,
  CheckSquare,
  MessageSquare,
  Phone,
  Users,
  Mail,
  Target,
  Edit,
  Trash2,
  Check,
  X,
  Play,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AgendaListProps {
  items: AgendaItem[];
  onEdit: (item: AgendaItem) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onExecute?: (item: AgendaItem) => void;
  getTypeLabel: (type: AgendaItemType) => string;
  getStatusLabel: (status: AgendaStatus) => string;
  getPriorityColor: (priority?: string) => string;
  getStatusColor: (status: AgendaStatus) => string;
}

export function AgendaList({
  items,
  onEdit,
  onDelete,
  onComplete,
  onCancel,
  onExecute,
  getTypeLabel,
  getStatusLabel,
  getPriorityColor,
  getStatusColor
}: AgendaListProps) {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const getTypeIcon = (type: AgendaItemType) => {
    switch (type) {
      case "task": return <CheckSquare className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      case "call": return <Phone className="h-4 w-4" />;
      case "meeting": return <Users className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "follow-up": return <Target className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const isOverdue = (item: AgendaItem) => {
    const now = new Date();
    const scheduledDateTime = new Date(item.scheduledDate);
    const [hours, minutes] = item.scheduledTime.split(':').map(Number);
    scheduledDateTime.setHours(hours, minutes);
    
    return scheduledDateTime < now && item.status === "pending";
  };

  const canExecute = (item: AgendaItem) => {
    return item.status === "pending" && (item.type === "message" || item.type === "call" || item.type === "email");
  };

  const handleExecute = (item: AgendaItem) => {
    if (onExecute) {
      onExecute(item);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    // Primeiro por status (pendentes primeiro)
    if (a.status !== b.status) {
      if (a.status === "pending") return -1;
      if (b.status === "pending") return 1;
    }
    
    // Depois por data/hora
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    const [hoursA, minutesA] = a.scheduledTime.split(':').map(Number);
    const [hoursB, minutesB] = b.scheduledTime.split(':').map(Number);
    dateA.setHours(hoursA, minutesA);
    dateB.setHours(hoursB, minutesB);
    
    return dateA.getTime() - dateB.getTime();
  });

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm">Nenhum agendamento encontrado.</p>
        <p className="text-xs mt-1">Crie um novo agendamento usando os botões de ação rápida.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              "border rounded-lg p-4 transition-all duration-200",
              item.status === "completed" && "bg-green-50 border-green-200",
              item.status === "cancelled" && "bg-red-50 border-red-200",
              item.status === "pending" && "bg-white border-border hover:shadow-sm",
              isOverdue(item) && "border-orange-300 bg-orange-50"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    "p-1.5 rounded-md",
                    item.type === "task" && "bg-blue-100 text-blue-600",
                    item.type === "message" && "bg-green-100 text-green-600",
                    item.type === "call" && "bg-purple-100 text-purple-600",
                    item.type === "meeting" && "bg-indigo-100 text-indigo-600",
                    item.type === "email" && "bg-orange-100 text-orange-600",
                    item.type === "follow-up" && "bg-cyan-100 text-cyan-600"
                  )}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(item.type)}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getStatusColor(item.status))}
                      >
                        {getStatusLabel(item.status)}
                      </Badge>
                      {item.priority && item.priority !== "medium" && (
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getPriorityColor(item.priority))}
                        >
                          {item.priority === "urgent" ? "Urgente" : 
                           item.priority === "high" ? "Alta" : 
                           item.priority === "low" ? "Baixa" : "Média"}
                        </Badge>
                      )}
                      {isOverdue(item) && (
                        <Badge variant="outline" className="text-xs text-orange-600 bg-orange-50">
                          Atrasado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Data e hora */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(item.scheduledDate, "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{item.scheduledTime}</span>
                  </div>
                  {item.estimatedDuration && (
                    <span>• {item.estimatedDuration} min</span>
                  )}
                </div>

                {/* Descrição */}
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Conteúdo da mensagem (preview) */}
                {item.type === "message" && item.messageTemplate && (
                  <div className="bg-gray-50 rounded-md p-2 mb-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Mensagem ({item.messageChannel}):
                    </p>
                    <p className="text-sm line-clamp-2">
                      {item.messageTemplate}
                    </p>
                  </div>
                )}

                {/* Link da reunião */}
                {item.type === "meeting" && item.meetingLink && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 mb-2">
                    <ExternalLink className="h-3 w-3" />
                    <a 
                      href={item.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Link da reunião
                    </a>
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Criado por */}
                <div className="text-xs text-muted-foreground">
                  Criado por {item.createdBy} • {format(item.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-1 ml-4">
                {/* Botão de executar (para mensagens, calls, emails) */}
                {canExecute(item) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExecute(item)}
                    className="h-8 px-2"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Executar
                  </Button>
                )}

                {/* Ações rápidas para itens pendentes */}
                {item.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onComplete(item.id)}
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onCancel(item.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}

                {/* Menu de ações */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    {item.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => onComplete(item.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Marcar como concluído
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCancel(item.id)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancelar
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setDeleteItemId(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteItemId) {
                  onDelete(deleteItemId);
                  setDeleteItemId(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}