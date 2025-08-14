import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Users, UserCheck, UserMinus, List, Plus, Star, Folder, ChevronDown,
  Trophy, Medal, Gem, Clock, Target, AlertCircle, BellRing, UserPlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeadSegmentsNavProps {
  activeSegment: string;
  setActiveSegment: (segment: string) => void;
}

const mainSegments = [
  { id: "all", label: "Todos os contatos", icon: Users, count: 2345 },
  { id: "clients", label: "Clientes", icon: UserCheck, count: 1047 },
  { id: "leads", label: "Leads", icon: UserPlus, count: 1298 },
];

const clientSegments = [
  { id: "active-clients", label: "Clientes Ativos", icon: UserCheck, count: 657, color: "bg-emerald-100 text-emerald-700" },
  { id: "inactive-clients", label: "Clientes Inativos", icon: UserMinus, count: 390, color: "bg-rose-100 text-rose-700" },
  { id: "clients-a", label: "Clientes A", icon: Trophy, count: 48, color: "bg-amber-100 text-amber-700" },
  { id: "clients-b", label: "Clientes B", icon: Medal, count: 136, color: "bg-slate-100 text-slate-700" },
  { id: "clients-c", label: "Clientes C", icon: Gem, count: 863, color: "bg-indigo-100 text-indigo-700" },
];

const leadSegments = [
  { id: "new-leads", label: "Leads Novos", icon: BellRing, count: 312, color: "bg-blue-100 text-blue-700" },
  { id: "qualified-leads", label: "Leads Qualificados", icon: Target, count: 451, color: "bg-purple-100 text-purple-700" },
  { id: "cold-leads", label: "Leads Frios", icon: AlertCircle, count: 535, color: "bg-slate-100 text-slate-700" },
];

const customLists = [
  { id: "favorites", label: "Favoritos", icon: Star, count: 23 },
  { id: "hot-leads", label: "Leads Quentes", icon: Target, count: 78 },
  { id: "newsletter", label: "Newsletter", icon: Folder, count: 421 },
  { id: "recent-contact", label: "Contato Recente", icon: Clock, count: 156 },
];

export function LeadSegmentsNav({ activeSegment, setActiveSegment }: LeadSegmentsNavProps) {
  const [isClientsOpen, setIsClientsOpen] = useState(true);
  const [isLeadsOpen, setIsLeadsOpen] = useState(true);
  const [isListsOpen, setIsListsOpen] = useState(true);

  return (
    <nav className="flex flex-col gap-1">
      <div className="space-y-1">
        {mainSegments.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => setActiveSegment(item.id)}
            className={cn(
              "w-full justify-start",
              activeSegment === item.id && "bg-muted text-primary font-semibold"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">{item.label}</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {item.count.toLocaleString()}
            </Badge>
          </Button>
        ))}
      </div>
      
      <div className="mt-2 pt-2 border-t">
        <Button
          variant="ghost"
          onClick={() => setIsClientsOpen(!isClientsOpen)}
          className="w-full justify-between text-sm font-semibold text-muted-foreground mb-1"
        >
          <div className="flex items-center">
            <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", !isClientsOpen && "-rotate-90")} />
            Segmentos de Clientes
          </div>
        </Button>

        {isClientsOpen && (
          <div className="pl-2 space-y-1">
            {clientSegments.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveSegment(item.id)}
                className={cn(
                  "w-full justify-start font-normal text-sm h-8 px-2",
                  activeSegment === item.id && "bg-muted text-primary font-semibold"
                )}
              >
                <div className={cn("p-1 rounded-full mr-2", item.color)}>
                  <item.icon className="h-3 w-3" />
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {item.count.toLocaleString()}
                </Badge>
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-1 pt-1 border-t">
        <Button
          variant="ghost"
          onClick={() => setIsLeadsOpen(!isLeadsOpen)}
          className="w-full justify-between text-sm font-semibold text-muted-foreground mb-1"
        >
          <div className="flex items-center">
            <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", !isLeadsOpen && "-rotate-90")} />
            Segmentos de Leads
          </div>
        </Button>

        {isLeadsOpen && (
          <div className="pl-2 space-y-1">
            {leadSegments.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveSegment(item.id)}
                className={cn(
                  "w-full justify-start font-normal text-sm h-8 px-2",
                  activeSegment === item.id && "bg-muted text-primary font-semibold"
                )}
              >
                <div className={cn("p-1 rounded-full mr-2", item.color)}>
                  <item.icon className="h-3 w-3" />
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {item.count.toLocaleString()}
                </Badge>
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-1 pt-1 border-t">
        <Button
          variant="ghost"
          onClick={() => setIsListsOpen(!isListsOpen)}
          className="w-full justify-between text-sm font-semibold text-muted-foreground mb-1"
        >
          <div className="flex items-center">
            <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", !isListsOpen && "-rotate-90")} />
            Listas Personalizadas
          </div>
          <Plus className="h-4 w-4" />
        </Button>

        {isListsOpen && (
          <div className="pl-2 space-y-1">
            {customLists.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveSegment(item.id)}
                className={cn(
                  "w-full justify-start font-normal text-sm h-8 px-2",
                  activeSegment === item.id && "bg-muted text-primary font-semibold"
                )}
              >
                <item.icon className="mr-2 h-3 w-3" />
                <span className="flex-1 text-left">{item.label}</span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {item.count.toLocaleString()}
                </Badge>
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}