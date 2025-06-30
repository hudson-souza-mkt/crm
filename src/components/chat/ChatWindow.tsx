import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile, Phone, Video, MoreVertical, MessageSquare } from "lucide-react";
import { ChatMessage } from "./ChatMessage";

const messages = [
    { isOutgoing: false, message: "Olá! Gostaria de saber mais sobre seus produtos.", time: "10:25" },
    { isOutgoing: true, message: "Olá João! Claro, ficarei feliz em ajudar. Que tipo de produto você está procurando?", time: "10:26" },
    { isOutgoing: false, message: "Estou interessado em soluções para automação de vendas.", time: "10:28" },
    { isOutgoing: true, message: "Perfeito! Temos várias opções que podem te ajudar. Posso te enviar um material com mais detalhes?", time: "10:29" },
    { isOutgoing: false, message: "Sim, por favor! E gostaria de agendar uma reunião também.", time: "10:30" },
];

export function ChatWindow() {
  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          <Avatar>
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <p className="font-semibold">João Silva</p>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-xs text-muted-foreground">Atendendo</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
            <ChatMessage key={index} isOutgoing={msg.isOutgoing} message={msg.message} time={msg.time} />
        ))}
      </main>
      
      <footer className="p-3 bg-white border-t">
        <div className="flex items-center gap-2">
            <div className="relative w-full">
                <Input
                    placeholder="Digite sua mensagem..."
                    className="h-10 rounded-lg border bg-white pl-3 pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Smile className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>
            <Button size="icon" className="h-10 w-10 flex-shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-5 w-5" />
            </Button>
        </div>
      </footer>
    </div>
  );
}