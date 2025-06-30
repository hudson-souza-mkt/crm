import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConversationStatus = 'attending' | 'waiting' | 'offline';

interface ConversationItemProps {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  active?: boolean;
  status: ConversationStatus;
  onAccept?: (id: number) => void;
}

const statusClasses: Record<ConversationStatus, string> = {
    attending: 'bg-green-500',
    waiting: 'bg-yellow-500',
    offline: 'bg-gray-400'
}

export function ConversationItem({ 
  id, name, lastMessage, time, unread, avatar, active, status, onAccept 
}: ConversationItemProps) {
  return (
    <div
      className={cn(
        "flex items-start p-3 cursor-pointer transition-colors hover:bg-gray-100/50 border-b",
        active ? "bg-gray-100" : ""
      )}
    >
      <div className="relative">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback>{avatar}</AvatarFallback>
        </Avatar>
        <span className={cn("absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white", statusClasses[status])} />
      </div>
      
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-medium text-sm truncate">{name}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
        </div>
        <div className="flex justify-between items-start mt-1">
            <p className="text-xs text-muted-foreground truncate pr-2">{lastMessage}</p>
            {unread > 0 && (
                <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 rounded-full">
                    {unread}
                </Badge>
            )}
        </div>
        
        {/* Botão de aceitar para conversas em espera */}
        {status === 'waiting' && (
          <div className="mt-2 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
              onClick={(e) => {
                e.stopPropagation(); // Previne que a conversa seja selecionada
                onAccept?.(id);
              }}
            >
              Aceitar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}