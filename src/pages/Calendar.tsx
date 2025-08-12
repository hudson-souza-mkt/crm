import { useState } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { useAgendaManager } from "@/hooks/useAgendaManager";
import { AgendaModal } from "@/components/agenda/AgendaModal";
import { AgendaItem, AgendaItemType } from "@/types/agenda";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export type CalendarViewType = 'day' | 'week' | 'month';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [defaultType, setDefaultType] = useState<AgendaItemType>('task');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Usar o hook de agenda sem filtro de lead específico
  const agendaManager = useAgendaManager({
    onItemUpdate: (item) => {
      console.log("Calendar: Agenda item updated:", item);
    }
  });

  // Filtrar agendamentos por período visível
  const getVisibleDateRange = () => {
    switch (viewType) {
      case 'day':
        return { start: currentDate, end: currentDate };
      case 'week':
        return { 
          start: startOfWeek(currentDate, { locale: ptBR }), 
          end: endOfWeek(currentDate, { locale: ptBR }) 
        };
      case 'month':
        return { 
          start: startOfMonth(currentDate), 
          end: endOfMonth(currentDate) 
        };
      default:
        return { start: currentDate, end: currentDate };
    }
  };

  const handleDateClick = (date: Date, type: AgendaItemType = 'task') => {
    setSelectedDate(date);
    setDefaultType(type);
    setEditingItem(null);
    setAgendaModalOpen(true);
  };

  const handleEventClick = (item: AgendaItem) => {
    setEditingItem(item);
    setAgendaModalOpen(true);
  };

  const handleAgendaSubmit = (agendaData: Partial<AgendaItem>) => {
    if (editingItem) {
      agendaManager.updateAgendaItem(editingItem.id, agendaData);
    } else {
      agendaManager.createAgendaItem({
        ...agendaData,
        scheduledDate: selectedDate || new Date(),
        createdBy: "Usuário Atual"
      });
    }
  };

  const handleEventDrop = (item: AgendaItem, newDate: Date, newTime?: string) => {
    agendaManager.updateAgendaItem(item.id, {
      scheduledDate: newDate,
      ...(newTime && { scheduledTime: newTime })
    });
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] bg-white">
      {/* Sidebar */}
      <CalendarSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        agendaItems={agendaManager.agendaItems}
        onCreateEvent={handleDateClick}
        onEventClick={handleEventClick}
        currentDate={currentDate}
      />

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <CalendarHeader
          currentDate={currentDate}
          viewType={viewType}
          onDateChange={setCurrentDate}
          onViewChange={setViewType}
          onTodayClick={() => setCurrentDate(new Date())}
        />

        {/* Calendar Content */}
        <div className="flex-1 overflow-hidden">
          <CalendarView
            currentDate={currentDate}
            viewType={viewType}
            agendaItems={agendaManager.agendaItems}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            onEventDrop={handleEventDrop}
            getTypeLabel={agendaManager.getTypeLabel}
            getStatusColor={agendaManager.getStatusColor}
          />
        </div>
      </div>

      {/* Modal de agendamento */}
      <AgendaModal
        open={agendaModalOpen}
        onOpenChange={setAgendaModalOpen}
        onSubmit={handleAgendaSubmit}
        leadId={editingItem?.leadId || ""}
        leadName={editingItem?.leadName || ""}
        editItem={editingItem}
        defaultType={defaultType}
      />
    </div>
  );
}