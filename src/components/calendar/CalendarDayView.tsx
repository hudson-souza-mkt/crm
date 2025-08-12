import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarEventCard } from "./CalendarEventCard";
import type { AgendaItem, AgendaItemType, AgendaStatus } from "@/types/agenda";

interface CalendarDayViewProps {
  currentDate: Date;
  agendaItems: AgendaItem[];
  onDateClick: (date: Date, type?: AgendaItemType) => void;
  onEventClick: (item: AgendaItem) => void;
  onEventDrop: (item: AgendaItem, newDate: Date, newTime?: string) => void;
  getTypeLabel: (type: AgendaItemType) => string;
  getStatusColor: (status: AgendaStatus) => string;
}

export function CalendarDayView({
  currentDate,
  agendaItems,
  onDateClick,
  onEventClick,
  onEventDrop,
  getTypeLabel,
  getStatusColor
}: CalendarDayViewProps) {
  const [draggedItem, setDraggedItem] = useState<AgendaItem | null>(null);

  // Horários (6h às 22h)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  // Eventos do dia atual
  const dayEvents = agendaItems.filter(item => 
    isSameDay(item.scheduledDate, currentDate)
  ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  const handleTimeSlotClick = (hour: number) => {
    const clickedDate = new Date(currentDate);
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

  const handleDrop = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    if (draggedItem) {
      const newTime = `${hour.toString().padStart(2, '0')}:00`;
      onEventDrop(draggedItem, currentDate, newTime);
      setDraggedItem(null);
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar com resumo do dia */}
      <div className="w-80 border-r border-border p-4 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">
            {format(currentDate, "EEEE", { locale: ptBR })}
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Agendamentos do dia</h4>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {dayEvents.length}
            </span>
          </div>

          {dayEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum agendamento para hoje
            </p>
          ) : (
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border border-border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{event.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {event.scheduledTime}
                    </span>
                  </div>
                
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {getTypeLabel(event.type)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {event.leadName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timeline principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1">
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter(event => {
              const eventHour = parseInt(event.scheduledTime.split(':')[0]);
              return eventHour === hour;
            });

            return (
              <div
                key={hour}
                className="flex border-b border-border min-h-[80px] hover:bg-gray-50 cursor-pointer"
                onClick={() => handleTimeSlotClick(hour)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, hour)}
              >
                {/* Horário */}
                <div className="w-20 p-3 text-sm text-muted-foreground border-r border-border">
                  {hour.toString().padStart(2, '0')}:00
                </div>

                {/* Área de eventos */}
                <div className="flex-1 p-2 relative">
                  {hourEvents.map((event) => (
                    <CalendarEventCard
                      key={event.id}
                      event={event}
                      view="day"
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
    </div>
  );
}