import { CalendarDayView } from "./CalendarDayView";
import { CalendarWeekView } from "./CalendarWeekView";
import { CalendarMonthView } from "./CalendarMonthView";
import type { CalendarViewType } from "@/pages/Calendar";
import type { AgendaItem, AgendaItemType, AgendaStatus } from "@/types/agenda";

interface CalendarViewProps {
  currentDate: Date;
  viewType: CalendarViewType;
  agendaItems: AgendaItem[];
  onDateClick: (date: Date, type?: AgendaItemType) => void;
  onEventClick: (item: AgendaItem) => void;
  onEventDrop: (item: AgendaItem, newDate: Date, newTime?: string) => void;
  getTypeLabel: (type: AgendaItemType) => string;
  getStatusColor: (status: AgendaStatus) => string;
}

export function CalendarView({
  currentDate,
  viewType,
  agendaItems,
  onDateClick,
  onEventClick,
  onEventDrop,
  getTypeLabel,
  getStatusColor
}: CalendarViewProps) {
  const commonProps = {
    currentDate,
    agendaItems,
    onDateClick,
    onEventClick,
    onEventDrop,
    getTypeLabel,
    getStatusColor
  };

  switch (viewType) {
    case 'day':
      return <CalendarDayView {...commonProps} />;
    case 'week':
      return <CalendarWeekView {...commonProps} />;
    case 'month':
      return <CalendarMonthView {...commonProps} />;
    default:
      return <CalendarMonthView {...commonProps} />;
  }
}