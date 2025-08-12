import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquareMore, 
  PhoneCall, 
  CalendarPlus, 
  Mail, 
  CheckSquare,
  FileText,
  Star,
  Edit,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Lead } from "./PipelineCard";

interface QuickActionBarProps {
  lead: Lead;
  isVisible: boolean;
  onAction: (action: string, lead: Lead) => void;
}

export function QuickActionBar({ lead, isVisible, onAction }: QuickActionBarProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAction = async (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(action);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular loading
      onAction(action, lead);
    } finally {
      setIsLoading(null);
    }
  };

  const actions = [
    {
      id: 'whatsapp',
      icon: MessageSquareMore,
      label: 'WhatsApp',
      color: 'text-green-600 hover:text-green-700 hover:bg-green-50',
      primary: true
    },
    {
      id: 'call',
      icon: PhoneCall,
      label: 'Ligar',
      color: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
      primary: true
    },
    {
      id: 'schedule',
      icon: CalendarPlus,
      label: 'Agendar',
      color: 'text-purple-600 hover:text-purple-700 hover:bg-purple-50',
      primary: true
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      color: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50',
      disabled: !lead.email
    }
  ];

  return (
    <div className={cn(
      "flex items-center gap-1 transition-all duration-200",
      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
    )}>
      {/* Ações primárias */}
      {actions.map((action) => (
        <TooltipProvider key={action.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 transition-all duration-200",
                  action.color,
                  action.disabled && "opacity-50 cursor-not-allowed",
                  isLoading === action.id && "animate-pulse"
                )}
                onClick={(e) => handleAction(action.id, e)}
                disabled={action.disabled || isLoading === action.id}
              >
                <action.icon className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{action.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {/* Menu de ações secundárias */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={(e) => handleAction('tasks', e)}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Tarefas {lead.tasksCount && `(${lead.tasksCount})`}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleAction('notes', e)}>
            <FileText className="mr-2 h-4 w-4" />
            Notas {lead.notesCount && `(${lead.notesCount})`}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => handleAction('favorite', e)}>
            <Star className="mr-2 h-4 w-4" />
            {lead.isFavorite ? "Remover favorito" : "Adicionar favorito"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleAction('edit', e)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar lead
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}