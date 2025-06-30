import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConversationItem } from "./ConversationItem";
import { cn } from "@/lib/utils";

type ConversationStatus = 'attending' | 'waiting' | 'offline';

type Conversation = {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  active?: boolean;
  status: ConversationStatus;
};

const conversations: Conversation[] = [
    { 
        id: 1, 
        name: "João Silva", 
        lastMessage: "Gostaria de saber mais sobre o produto", 
        time: "10:30", 
        unread: 2, 
        avatar: "JS", 
        active: true,
        status: 'attending'
    },
    { 
        id: 2, 
        name: "Maria Santos", 
        lastMessage: "Obrigada pelo atendimento!", 
        time: "09:45", 
        unread: 0, 
        avatar: "MS",
        status: 'offline'
    },
    { 
        id: 3, 
        name: "Pedro Costa", 
        lastMessage: "Aguardando retorno sobre o orçamento", 
        time: "08:20", 
        unread: 1, 
        avatar: "PC",
        status: 'waiting'
    },
    { 
        id: 4, 
        name: "Ana Oliveira", 
        lastMessage: "Quando posso agendar uma reunião?", 
        time: "Ontem", 
        unread: 3,
        avatar: "AO",
        status: 'attending'
    },
    {
        id: 5,
        name: "Carlos Ferreira",
        lastMessage: "Perfeito, vou analisar a proposta",
        time: "Ontem",
        unread: 0,
        avatar: "CF",
        status: 'waiting'
    }
];

export function ConversationList() {
  const [activeTab, setActiveTab] = useState<'attending' | 'waiting'>('attending');

  const filteredConversations = conversations.filter(c => {
      if (activeTab === 'attending') return c.status === 'attending' || c.status === 'offline';
      if (activeTab === 'waiting') return c.status === 'waiting';
      return true;
  });

  const attendingCount = conversations.filter(c => c.status === 'attending').length;
  const waitingCount = conversations.filter(c => c.status === 'waiting').length;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold">Conversas</h2>
        <Button variant="ghost" size="icon">
          <Filter className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-2 border-b">
        <div className="flex items-center gap-2">
            <Button 
                variant={activeTab === 'attending' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('attending')}
                className="rounded-full h-auto px-3 py-1 text-sm font-normal"
            >
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Atendendo
                <Badge variant="destructive" className="ml-2 rounded-full text-xs px-1.5 py-0">{attendingCount}</Badge>
            </Button>
            <Button 
                variant={activeTab === 'waiting' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('waiting')}
                className="rounded-full h-auto px-3 py-1 text-sm font-normal"
            >
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                Aguardando
                <Badge variant="destructive" className="ml-2 rounded-full text-xs px-1.5 py-0">{waitingCount}</Badge>
            </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            name={conv.name}
            lastMessage={conv.lastMessage}
            time={conv.time}
            unread={conv.unread}
            avatar={conv.avatar}
            active={conv.active}
            status={conv.status}
          />
        ))}
      </div>
    </div>
  );
}