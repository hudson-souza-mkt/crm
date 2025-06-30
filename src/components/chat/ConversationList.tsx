import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Conversation = {
  id: number;
  name: string;
  role?: string;
  department?: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
  active?: boolean;
  tags: {
    text: string;
    color: "green" | "blue" | "purple" | "default";
  }[];
};

const conversations: Conversation[] = [
  { 
    id: 1, 
    name: "Bianca Araújo", 
    role: "Operacional", 
    lastMessage: "aguii Mi", 
    time: "16:33", 
    unread: 0, 
    avatar: "https://i.pravatar.cc/150?img=1", 
    active: true,
    tags: [
      { text: "VENDEDOR CARLOS", color: "green" },
      { text: "SUPORTE", color: "default" },
      { text: "MÍDIA", color: "purple" }
    ]
  },
  { 
    id: 2, 
    name: "Bela Prisma", 
    role: "Consignado", 
    lastMessage: "Suporte oi", 
    time: "16:07", 
    unread: 0, 
    avatar: "https://i.pravatar.cc/150?img=5",
    tags: [
      { text: "MÍDIA", color: "purple" },
      { text: "SUPORTE", color: "default" },
      { text: "MÍDIA", color: "purple" }
    ]
  },
  { 
    id: 3, 
    name: "Ana Clara Prisma", 
    lastMessage: "Ok", 
    time: "16:04", 
    unread: 0, 
    avatar: "https://i.pravatar.cc/150?img=9",
    tags: [
      { text: "MÍDIA", color: "purple" },
      { text: "SUPORTE", color: "default" },
      { text: "MÍDIA", color: "purple" }
    ]
  },
  { 
    id: 4, 
    name: "Carlos Consultor", 
    role: "Prisma", 
    lastMessage: "Suporte oi", 
    time: "15:54", 
    unread: 0,
    avatar: "https://i.pravatar.cc/150?img=15",
    tags: [
      { text: "VENDEDOR MICAEL", color: "green" },
      { text: "SUPORTE", color: "default" },
      { text: "MÍDIA", color: "purple" }
    ]
  },
];

export function ConversationList() {
  const getTagColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-600 text-white";
      case "purple":
        return "bg-purple-400 text-white";
      case "blue":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-700 text-white";
    }
  };

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={cn(
            "flex flex-col border-b cursor-pointer transition-colors hover:bg-gray-50",
            conv.active ? "bg-gray-50" : ""
          )}
        >
          <div className="flex items-start p-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={conv.avatar} />
              <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-sm">{conv.name} {conv.role && <span className="text-xs text-muted-foreground">{conv.role}</span>}</p>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{conv.time}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-1">
                {conv.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className={cn(
                      "text-[10px] px-1 py-0.5 rounded", 
                      getTagColor(tag.color)
                    )}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-3 pb-2">
            <Button 
              variant="destructive" 
              size="sm" 
              className="text-[10px] h-6 w-full"
            >
              FINALIZAR
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}