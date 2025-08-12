import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  MessageSquare, 
  Phone, 
  Users, 
  Mail, 
  Target,
  Clock,
  User
} from "lucide-react";
import type { AgendaItem, AgendaItemType, AgendaStatus } from "@/types/agenda";

interface CalendarEventCardProps {
  event: AgendaItem;
  view: 'day' | 'week' | 'month';
  onClick: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  getTypeLabel: (type: AgendaItemType) => string;
  getStatusColor: (status: AgendaStatus) => string;
}

export function CalendarEventCard({
  event,
  view,
  onClick,
  onDragStart,
  getTypeLabel,
  getStatusColor
}: CalendarEventCardProps) {
  const getTypeIcon = (type: AgendaItemType) => {
    const iconClass = "h-3 w-3";
    switch (type) {
      case "task": return <CheckSquare className={iconClass} />;
      case "message": return <MessageSquare className={iconClass} />;
      case "call": return <Phone className={iconClass} />;
      case "meeting": return <Users className={iconClass} />;
      case "email": return <Mail className={iconClass} />;
      case "follow-up": return <Target className={iconClass} />;
      default: return <CheckSquare className={iconClass} />;
    }
  };

  const getTypeColor = (type: AgendaItemType) => {
    switch (type) {
      case "task": return "bg-blue-100 text-blue-700 border-blue-200";
      case "message": return "bg-green-100 text-green-700 border-green-200";
      case "call": return "bg-purple-100 text-purple-700 border-purple-200";
      case "meeting": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "email": return "bg-orange-100 text-orange-700 border-orange-200";
      case "follow-up": return "bg-cyan-100 text-cyan-700 border-cyan-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const isOverdue = () => {
    const now = new Date();
    const scheduledDateTime = new Date(event.scheduledDate);
    const [hours, minutes] = event.scheduledTime.split(':').map(Number);
    scheduledDateTime.setHours(hours, minutes);
    
    return scheduledDateTime < now && event.status === "pending";
  };

  const cardClass = cn(
    "rounded-md border cursor-pointer transition-all duration-200 hover:shadow-sm",
    getTypeColor(event.type),
    event.status === "completed" && "opacity-75 line-through",
    event.status === "cancelled" && "opacity-50",
    isOverdue() && "border-orange-300 bg-orange-50 text-orange-700",
    view === 'month' && "p-1 text-xs",
    view === 'week' && "p-2 text-xs mb-1",
    view === 'day' && "p-3 text-sm mb-2"
  );

  return (
    <div
      className={cardClass}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-start gap-1">
        {getTypeIcon(event.type)}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">
            {event.title}
          </div>
          
          {view !== 'month' && (
            <>
              <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                <Clock className="h-2.5 w-2.5" />
                <span>{event.scheduledTime}</span>
                {event.estimatedDuration && (
                  <span>• {event.estimatedDuration}min</span>
                )}
              </div>
              
              <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                <User className="h-2.5 w-2.5" />
                <span className="truncate">{event.leadName}</span>
              </div>
            </>
          )}
          
          {view === 'day' && event.description && (
            <p className="text-xs opacity-75 mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
          
          {view !== 'month' && (
            <div className="flex items-center gap-1 mt-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs px-1 py-0", getStatusColor(event.status))}
              >
                {event.status === "pending" ? "Pendente" : 
                 event.status === "completed" ? "Concluído" : 
                 event.status === "cancelled" ? "Cancelado" : "Em andamento"}
              </Badge>
              
              {event.priority && event.priority !== "medium" && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {event.priority === "urgent" ? "Urgente" : 
                   event.priority === "high" ? "Alta" : "Baixa"}
                </Badge>
              )}
              
              {isOverdue() && (
                <Badge variant="outline" className="text-xs px-1 py-0 text-orange-600 bg-orange-50">
                  Atrasado
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}