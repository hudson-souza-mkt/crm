import { useState } from "react";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/chat";
import { Bot } from "lucide-react";

const fetchConversations = async () => {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as Conversation[];
};

export default function Chat() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const { data: conversations, isLoading, isError } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleNewConversation = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: 'Nova Conversa' })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar nova conversa:", error);
    } else if (data) {
      // A lista de conversas será atualizada automaticamente pelo refetch do React Query
      // ou você pode invalidar a query: queryClient.invalidateQueries(['conversations'])
      setSelectedConversationId(data.id);
    }
  };

  return (
    <div className="h-full flex bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="w-[320px] border-r flex-shrink-0 bg-white">
        <ConversationList
          conversations={conversations || []}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          isLoading={isLoading}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <ChatWindow
            key={selectedConversationId}
            conversationId={selectedConversationId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-gray-50">
            <Bot className="h-16 w-16 mb-4" />
            <h2 className="text-xl font-semibold">Selecione uma conversa</h2>
            <p className="mt-2">Ou inicie uma nova para começar a conversar.</p>
          </div>
        )}
      </div>
    </div>
  );
}