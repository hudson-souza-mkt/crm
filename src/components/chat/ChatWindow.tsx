import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile, MoreVertical, Loader2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ChatWindowProps {
  conversationId: string;
}

const fetchMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Message[];
};

const sendMessage = async ({ conversationId, content }: { conversationId: string, content: string }) => {
  const { error } = await supabase.functions.invoke('chat-handler', {
    body: { conversation_id: conversationId, content },
  });

  if (error) throw new Error(error.message);
  return true;
};

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    staleTime: Infinity, // Os dados são atualizados via real-time
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onError: (error) => {
      toast.error(`Erro ao enviar mensagem: ${error.message}`);
    },
  });

  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (payload.new.conversation_id === conversationId) {
      queryClient.setQueryData(['messages', conversationId], (oldData: Message[] | undefined) => {
        if (!oldData) return [payload.new];
        // Evita adicionar duplicatas
        if (oldData.some(msg => msg.id === payload.new.id)) {
          return oldData;
        }
        return [...oldData, payload.new];
      });
    }
  }, [queryClient, conversationId]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        handleRealtimeUpdate
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, handleRealtimeUpdate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || mutation.isPending) return;

    mutation.mutate({ conversationId, content: newMessage });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          <Avatar>
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-semibold">Conversa</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          messages?.map((msg) => (
            <ChatMessage
              key={msg.id}
              isOutgoing={msg.sender === 'user'}
              message={msg.content}
              time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          ))
        )}
        {mutation.isPending && (
           <ChatMessage
              isOutgoing={true}
              message={mutation.variables?.content || ""}
              time="Enviando..."
            />
        )}
        <div ref={messagesEndRef} />
      </main>
      
      <footer className="p-3 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative w-full">
            <Input
              placeholder="Digite sua mensagem..."
              className="h-10 rounded-lg border bg-white pl-3 pr-10"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={mutation.isPending}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" type="button">
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 flex-shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </footer>
    </div>
  );
}