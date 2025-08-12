import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react";
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarViewType } from "@/pages/Calendar";

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: CalendarViewType;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarViewType) => void;
  onTodayClick: () => void;
}

export function CalendarHeader({
  currentDate,
  viewType,
  onDateChange,
  onViewChange,
  onTodayClick
}: CalendarHeaderProps) {
  const navigatePrevious = () => {
    switch (viewType) {
      case 'day':
        onDateChange(subDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(subWeeks(currentDate, 1));
        break;
      case 'month':
        onDateChange(subMonths(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (viewType) {
      case 'day':
        onDateChange(addDays(currentDate, 1));
        break;
      case 'week':
        onDateChange(addWeeks(currentDate, 1));
        break;
      case 'month':
        onDateChange(addMonths(currentDate, 1));
        break;
    }
  };

  const getDateTitle = () => {
    switch (viewType) {
      case 'day':
        return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
      case 'week':
        return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
      case 'month':
        return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
      default:
        return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  return (
    <div className="border-b border-border bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Agenda</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTodayClick}
              className="text-sm"
            >
              Hoje
            </Button>
            
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={navigatePrevious}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateNext}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <h2 className="text-lg font-medium min-w-[200px]">
              {getDateTitle()}
            </h2>
          </div>
        </div>

        {/* Right side - View controls */}
        <div className="flex items-center gap-3">
          <Select value={viewType} onValueChange={(value: CalendarViewType) => onViewChange(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Dia</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
            </SelectContent>
          </Select>
          
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Criar
          </Button>
        </div>
      </div>
    </div>
  );
}