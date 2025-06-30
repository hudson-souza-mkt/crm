import { Button } from "@/components/ui/button";
import { Filter, Search, MessageSquarePlus } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Conversation } from "@/types/chat";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  isLoading: boolean;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  isLoading,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b space-y-3">
        <Button className="w-full" onClick={onNewConversation}>
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Nova conversa
        </Button>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar conversas..." className="pl-8 h-9" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Todas as conversas</DropdownMenuItem>
              <DropdownMenuItem>Finalizadas</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Filtrar por tags</DropdownMenuItem>
              <DropdownMenuItem>Filtrar por usuários</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              id={conv.id}
              name={conv.title || "Conversa sem título"}
              lastMessage="Clique para ver as mensagens..."
              time={new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              avatar={(conv.title || "C").charAt(0)}
              active={conv.id === selectedConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}