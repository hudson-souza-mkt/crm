import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, UserCheck, UserPlus, List, Plus, Star, Folder, ChevronDown } from "lucide-react";

interface LeadSegmentsNavProps {
  activeSegment: string;
  setActiveSegment: (segment: string) => void;
}

const mainSegments = [
  { id: "all", label: "Todos os contatos", icon: Users },
  { id: "clients", label: "Clientes", icon: UserCheck },
  { id: "leads", label: "Leads", icon: UserPlus },
];

const customLists = [
  { id: "favorites", label: "Favoritos", icon: Star },
  { id: "hot-leads", label: "Leads Quentes", icon: Folder },
  { id: "newsletter", label: "Newsletter", icon: Folder },
];

export function LeadSegmentsNav({ activeSegment, setActiveSegment }: LeadSegmentsNavProps) {
  const [isListsOpen, setIsListsOpen] = useState(true);

  return (
    <nav className="flex flex-col gap-2">
      <div>
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
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </div>
      
      <div className="space-y-1">
        <Button
          variant="ghost"
          onClick={() => setIsListsOpen(!isListsOpen)}
          className="w-full justify-between text-sm font-semibold text-muted-foreground"
        >
          <div className="flex items-center">
            <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", !isListsOpen && "-rotate-90")} />
            Listas
          </div>
          <Plus className="h-4 w-4" />
        </Button>

        {isListsOpen && (
          <div className="pl-4 space-y-1">
            {customLists.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveSegment(item.id)}
                className={cn(
                  "w-full justify-start font-normal",
                  activeSegment === item.id && "bg-muted text-primary font-semibold"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}