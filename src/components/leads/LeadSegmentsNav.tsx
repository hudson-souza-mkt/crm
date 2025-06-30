import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, UserCheck, UserPlus, List, Plus, Star, Folder } from "lucide-react";

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
  return (
    <nav className="flex flex-col gap-4">
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
        <div className="flex items-center justify-between px-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Listas</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {customLists.map((item) => (
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
    </nav>
  );
}