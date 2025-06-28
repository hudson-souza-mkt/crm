import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile } from "lucide-react";

export function ChatWindow() {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center gap-4 p-4 border-b">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">João Silva</p>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </header>
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Mensagens aqui */}
        <div className="flex items-end gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-muted">
            <p>Olá! Tenho interesse no plano Pro. Poderia me passar mais informações sobre as funcionalidades?</p>
            <p className="text-xs text-muted-foreground text-right mt-1">10:42</p>
          </div>
        </div>
        <div className="flex items-end gap-3 justify-end">
          <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-primary text-primary-foreground">
            <p>Olá, João! Claro. O plano Pro inclui automações avançadas, relatórios personalizados e integração com até 10 ferramentas.</p>
            <p className="text-xs text-primary-foreground/80 text-right mt-1">10:43</p>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/your-avatar.png" />
            <AvatarFallback>EU</AvatarFallback>
          </Avatar>
        </div>
      </main>
      <footer className="p-4 border-t">
        <div className="relative">
          <Input placeholder="Digite sua mensagem..." className="pr-28" />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="icon"><Smile className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon"><Paperclip className="w-5 h-5" /></Button>
            <Button size="icon"><Send className="w-5 h-5" /></Button>
          </div>
        </div>
      </footer>
    </div>
  );
}