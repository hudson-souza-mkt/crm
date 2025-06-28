import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile, Phone, Video, Archive, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ChatWindow() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex items-center justify-between p-3 bg-white border-b">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?img=1" />
            <AvatarFallback>BA</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <p className="font-semibold">Bianca Araújo</p>
              <Badge variant="outline" className="h-5 text-xs">Operacional</Badge>
            </div>
            <div className="flex gap-1 mt-1">
              <span className="text-[10px] px-1 py-0.5 rounded bg-green-600 text-white">VENDEDOR CARLOS</span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-gray-700 text-white">SUPORTE</span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-purple-400 text-white">MÍDIA</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="text-center my-2">
          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">
            Hoje - 10:42
          </span>
        </div>
        
        <div className="flex items-end gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://i.pravatar.cc/150?img=1" />
            <AvatarFallback>BA</AvatarFallback>
          </Avatar>
          <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-white shadow-sm">
            <p className="text-sm">Olá! Tenho interesse no plano Pro. Poderia me passar mais informações sobre as funcionalidades?</p>
            <p className="text-xs text-muted-foreground text-right mt-1">10:42</p>
          </div>
        </div>
        
        <div className="flex items-end gap-2 justify-end">
          <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-primary text-white shadow-sm">
            <p className="text-sm">Olá, Bianca! Claro. O plano Pro inclui automações avançadas, relatórios personalizados e integração com até 10 ferramentas.</p>
            <p className="text-xs text-white/80 text-right mt-1">10:43</p>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>EU</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex items-end gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://i.pravatar.cc/150?img=1" />
            <AvatarFallback>BA</AvatarFallback>
          </Avatar>
          <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-white shadow-sm">
            <p className="text-sm">Perfeito! E qual seria o valor mensal? Tenho uma equipe de 5 pessoas.</p>
            <p className="text-xs text-muted-foreground text-right mt-1">10:45</p>
          </div>
        </div>
        
        <div className="flex items-end gap-2 justify-end">
          <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-primary text-white shadow-sm">
            <p className="text-sm">Para 5 usuários, o valor seria R$ 299,90/mês. Mas temos uma promoção este mês: pagando anualmente, você ganha 20% de desconto!</p>
            <p className="text-xs text-white/80 text-right mt-1">10:47</p>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>EU</AvatarFallback>
          </Avatar>
        </div>
      </main>
      
      <footer className="p-3 bg-white border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="flex-1 relative">
            <Input 
              placeholder="Digite sua mensagem..." 
              className="pr-10 bg-gray-100 border-0 rounded-full"
            />
            <Button 
              size="icon" 
              className="h-8 w-8 absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}