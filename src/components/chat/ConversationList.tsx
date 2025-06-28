import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const conversations = [
  { id: 1, name: "João Silva", lastMessage: "Olá! Tenho interesse no plano Pro.", time: "10:42", unread: 2, avatar: "https://github.com/shadcn.png", active: true },
  { id: 2, name: "Maria Oliveira", lastMessage: "Poderia me enviar mais detalhes?", time: "09:15", unread: 0, avatar: "https://github.com/vercel.png" },
  { id: 3, name: "Pedro Souza", lastMessage: "Obrigado!", time: "Ontem", unread: 0 },
];

export function ConversationList() {
  return (
    <div className="flex flex-col gap-2 p-2">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
            conv.active ? "bg-primary/10" : "hover:bg-muted/50"
          )}
        >
          <Avatar>
            <AvatarImage src={conv.avatar} />
            <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="font-semibold truncate">{conv.name}</p>
            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            <p>{conv.time}</p>
            {conv.unread > 0 && (
              <Badge className="mt-1 w-5 h-5 flex items-center justify-center p-0">{conv.unread}</Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}