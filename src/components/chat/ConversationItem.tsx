import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  active?: boolean;
  onClick: (id: string) => void;
}

export function ConversationItem({ 
  id, name, lastMessage, time, avatar, active, onClick 
}: ConversationItemProps) {
  return (
    <div
      className={cn(
        "flex items-start p-3 cursor-pointer transition-colors hover:bg-gray-100/50 border-b",
        active ? "bg-gray-100" : ""
      )}
      onClick={() => onClick(id)}
    >
      <div className="relative">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback>{avatar}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-medium text-sm truncate">{name}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
        </div>
        <div className="flex justify-between items-start mt-1">
            <p className="text-xs text-muted-foreground truncate pr-2">{lastMessage}</p>
        </div>
      </div>
    </div>
  );
}