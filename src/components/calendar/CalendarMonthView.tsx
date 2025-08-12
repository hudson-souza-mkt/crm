import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarEventCard } from "./CalendarEventCard";
import type { AgendaItem, AgendaItemType, AgendaStatus } from "@/types/agenda";

interface CalendarMonthViewProps {
  currentDate: Date;
  agendaItems: AgendaItem[];
  onDateClick: (date: Date, type?: AgendaItemType) => void;
  onEventClick: (item: AgendaItem) => void;
  onEventDrop: (item: AgendaItem, newDate: Date, newTime?: string) => void;
  getTypeLabel: (type: AgendaItemType) => string;
  getStatusColor: (status: AgendaStatus) => string;
}

export function CalendarMonthView({
  currentDate,
  agendaItems,
  onDateClick,
  onEventClick,
  onEventDrop,
  getTypeLabel,
  getStatusColor
}: CalendarMonthViewProps) {
  const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);

  // Calcular dias do mês
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Agrupar eventos por dia
  const getEventsForDay = (day: Date) => {
    return agendaItems.filter(item => 
      isSameDay(item.scheduledDate, day)
    ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  };

  const handleDayClick = (day: Date) => {
    onDateClick(day);
  };

  const handleDragStart = (e: React.DragEvent, item: AgendaItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    if (draggedItem) {
      onEventDrop(draggedItem, day);
      setDraggedItem(null);
    }
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header dos dias da semana */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground bg-gray-50">
            {day}
          </div>
        ))}
      </div>

      {/* Grid do calendário */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day) => {
          const events = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-b border-border p-2 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors",
                !isCurrentMonth && "bg-gray-50/50 text-muted-foreground",
                isDayToday && "bg-blue-50"
              )}
              onClick={() => handleDayClick(day)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              {/* Número do dia */}
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  isDayToday && "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                )}>
                  {format(day, 'd')}
                </span>
                {events.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{events.length - 3}
                  </span>
                )}
              </div>

              {/* Eventos do dia */}
              <div className="space-y-1">
                {events.slice(0, 3).map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    view="month"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    onDragStart={(e) => handleDragStart(e, event)}
                    getTypeLabel={getTypeLabel}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}