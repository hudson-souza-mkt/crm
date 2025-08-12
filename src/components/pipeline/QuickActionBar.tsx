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
  isVisible?: boolean;
  onAction: (action: string, lead: Lead) => void;
}

export function QuickActionBar({ lead, isVisible = true, onAction }: QuickActionBarProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleAction = async (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(action);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simular loading
      onAction(action, lead);
    } finally {
      setIsLoading(null);
    }
  };

  const primaryActions = [
    {
      id: 'whatsapp',
      icon: MessageSquareMore,
      label: 'WhatsApp',
      color: 'text-green-600 hover:text-green-700 hover:bg-green-50'
    },
    {
      id: 'call',
      icon: PhoneCall,
      label: 'Ligar',
      color: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
    },
    {
      id: 'schedule',
      icon: CalendarPlus,
      label: 'Agendar',
      color: 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      color: 'text-orange-600 hover:text-orange-700 hover:bg-orange-50',
      disabled: !lead.email
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="border-t border-border bg-gray-50/50 px-2 py-2">
      <div className="flex items-center justify-between">
        {/* Ações principais */}
        <div className="flex items-center gap-1">
          {primaryActions.map((action) => (
            <TooltipProvider key={action.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-sm transition-all duration-200",
                      action.color,
                      action.disabled && "opacity-50 cursor-not-allowed",
                      isLoading === action.id && "animate-pulse"
                    )}
                    onClick={(e) => handleAction(action.id, e)}
                    disabled={action.disabled || isLoading === action.id}
                  >
                    <action.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{action.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Contadores e menu */}
        <div className="flex items-center gap-1">
          {/* Contador de tarefas */}
          {(lead.tasksCount && lead.tasksCount > 0) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-sm relative"
                    onClick={(e) => handleAction('tasks', e)}
                  >
                    <CheckSquare className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {lead.tasksCount}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{lead.tasksCount} tarefa{lead.tasksCount > 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Contador de notas */}
          {(lead.notesCount && lead.notesCount > 0) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-sm relative"
                    onClick={(e) => handleAction('notes', e)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {lead.notesCount}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{lead.notesCount} nota{lead.notesCount > 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Menu de ações secundárias */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {(!lead.tasksCount || lead.tasksCount === 0) && (
                <DropdownMenuItem onClick={(e) => handleAction('tasks', e)}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Nova tarefa
                </DropdownMenuItem>
              )}
              
              {(!lead.notesCount || lead.notesCount === 0) && (
                <DropdownMenuItem onClick={(e) => handleAction('notes', e)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Nova nota
                </DropdownMenuItem>
              )}

              {((!lead.tasksCount || lead.tasksCount === 0) || (!lead.notesCount || lead.notesCount === 0)) && (
                <DropdownMenuSeparator />
              )}

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
      </div>
    </div>
  );
}