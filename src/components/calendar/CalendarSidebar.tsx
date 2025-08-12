import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckSquare,
  MessageSquare,
  Phone,
  Users,
  Mail,
  Target
} from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { AgendaItem, AgendaItemType } from "@/types/agenda";

interface CalendarSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  agendaItems: AgendaItem[];
  onCreateEvent: (date: Date, type: AgendaItemType) => void;
  onEventClick: (item: AgendaItem) => void;
  currentDate: Date;
}

export function CalendarSidebar({
  collapsed,
  onToggle,
  agendaItems,
  onCreateEvent,
  onEventClick,
  currentDate
}: CalendarSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<AgendaItemType[]>([]);
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());

  const eventTypes = [
    { type: 'task' as AgendaItemType, label: 'Tarefas', icon: CheckSquare, color: 'bg-blue-100 text-blue-700' },
    { type: 'message' as AgendaItemType, label: 'Mensagens', icon: MessageSquare, color: 'bg-green-100 text-green-700' },
    { type: 'call' as AgendaItemType, label: 'Ligações', icon: Phone, color: 'bg-purple-100 text-purple-700' },
    { type: 'meeting' as AgendaItemType, label: 'Reuniões', icon: Users, color: 'bg-indigo-100 text-indigo-700' },
    { type: 'email' as AgendaItemType, label: 'Emails', icon: Mail, color: 'bg-orange-100 text-orange-700' },
    { type: 'follow-up' as AgendaItemType, label: 'Follow-ups', icon: Target, color: 'bg-cyan-100 text-cyan-700' }
  ];

  const filteredItems = agendaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.leadName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    return matchesSearch && matchesType;
  });

  const handleTypeToggle = (type: AgendaItemType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getItemsCountByType = (type: AgendaItemType) => {
    return agendaItems.filter(item => item.type === type).length;
  };

  if (collapsed) {
    return (
      <div className="w-16 border-r border-border bg-gray-50 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={() => onCreateEvent(new Date(), 'task')}
          className="mb-4"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <div className="space-y-2">
          {eventTypes.map(({ type, icon: Icon, color }) => (
            <div
              key={type}
              className={cn("p-2 rounded-md cursor-pointer", color)}
              onClick={() => handleTypeToggle(type)}
            >
              <Icon className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Agenda</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          className="w-full gap-2"
          onClick={() => onCreateEvent(new Date(), 'task')}
        >
          <Plus className="h-4 w-4" />
          Criar agendamento
        </Button>
      </div>

      {/* Busca */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar agendamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filtros por tipo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Tipos de agendamento</span>
        </div>
        
        <div className="space-y-2">
          {eventTypes.map(({ type, label, icon: Icon, color }) => {
            const count = getItemsCountByType(type);
            const isSelected = selectedTypes.includes(type);
            
            return (
              <div
                key={type}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-white transition-colors",
                  isSelected && "bg-white shadow-sm"
                )}
                onClick={() => handleTypeToggle(type)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox checked={isSelected} readOnly />
                  <div className={cn("p-1 rounded", color)}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="text-sm">{label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini calendário */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">
            {format(miniCalendarDate, "MMMM yyyy", { locale: ptBR })}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setMiniCalendarDate(subMonths(miniCalendarDate, 1))}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setMiniCalendarDate(addMonths(miniCalendarDate, 1))}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          Mini calendário (em breve)
        </div>
      </div>

      {/* Lista de agendamentos próximos */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium mb-3">Próximos agendamentos</h3>
        
        {filteredItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum agendamento encontrado
          </p>
        ) : (
          <div className="space-y-2">
            {filteredItems.slice(0, 10).map((item) => {
              const eventType = eventTypes.find(t => t.type === item.type);
              const Icon = eventType?.icon || CheckSquare;
              
              return (
                <div
                  key={item.id}
                  className="p-2 bg-white rounded-md border cursor-pointer hover:shadow-sm transition-all"
                  onClick={() => onEventClick(item)}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn("p-1 rounded", eventType?.color)}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.leadName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format(item.scheduledDate, "dd/MM")} às {item.scheduledTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}