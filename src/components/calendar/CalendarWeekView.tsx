import { useState } from "react";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameDay,
  isToday
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarEventCard } from "./CalendarEventCard";
import type { AgendaItem, AgendaItemType, AgendaStatus } from "@/types/agenda";

interface CalendarWeekViewProps {
  currentDate: Date;
  agendaItems: AgendaItem[];
  onDateClick: (date: Date, type?: AgendaItemType) => void;
  onEventClick: (item: AgendaItem) => void;
  onEventDrop: (item: AgendaItem, newDate: Date, newTime?: string) => void;
  getTypeLabel: (type: AgendaItemType) => string;
  getStatusColor: (status: AgendaStatus) => string;
}

export function CalendarWeekView({
  currentDate,
  agendaItems,
  onDateClick,
  onEventClick,
  onEventDrop,
  getTypeLabel,
  getStatusColor
}: CalendarWeekViewProps) {
  const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);

  // Calcular dias da semana
  const weekStart = startOfWeek(currentDate, { locale: ptBR });
  const weekEnd = endOfWeek(currentDate, { locale: ptBR });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Horários (6h às 22h)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  // Agrupar eventos por dia
  const getEventsForDay = (day: Date) => {
    return agendaItems.filter(item => 
      isSameDay(item.scheduledDate, day)
    ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const clickedDate = new Date(day);
    clickedDate.setHours(hour, 0, 0, 0);
    onDateClick(clickedDate);
  };

  const handleDragStart = (e: React.DragEvent, item: AgendaItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: Date, hour?: number) => {
    e.preventDefault();
    if (draggedItem) {
      const newTime = hour ? `${hour.toString().padStart(2, '0')}:00` : undefined;
      onEventDrop(draggedItem, day, newTime);
      setDraggedItem(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header dos dias */}
      <div className="grid grid-cols-8 border-b border-border">
        <div className="p-3 border-r border-border"></div>
        {days.map((day) => {
          const isDayToday = isToday(day);
          return (
            <div key={day.toISOString()} className="p-3 text-center border-r border-border">
              <div className="text-xs text-muted-foreground">
                {format(day, 'EEE', { locale: ptBR })}
              </div>
              <div className={cn(
                "text-lg font-medium mt-1",
                isDayToday && "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid de horários */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8">
          {/* Coluna de horários */}
          <div className="border-r border-border">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-border p-2 text-xs text-muted-foreground">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Colunas dos dias */}
          {days.map((day) => {
            const events = getEventsForDay(day);
            
            return (
              <div key={day.toISOString()} className="border-r border-border">
                {hours.map((hour) => (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="h-16 border-b border-border p-1 hover:bg-gray-50 cursor-pointer relative"
                    onClick={() => handleTimeSlotClick(day, hour)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, hour)}
                  >
                    {/* Eventos neste horário */}
                    {events
                      .filter(event => {
                        const eventHour = parseInt(event.scheduledTime.split(':')[0]);
                        return eventHour === hour;
                      })
                      .map((event) => (
                        <CalendarEventCard
                          key={event.id}
                          event={event}
                          view="week"
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
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}