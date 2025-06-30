import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, Smile, Phone, Video, MoreVertical, 
  MessageSquare, PlusCircle 
} from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatLeadDetailSidebar } from "./ChatLeadDetailSidebar";
import type { Lead } from "@/components/pipeline/PipelineCard";

function CreateDealDialog() {
  const [funnel, setFunnel] = useState("");
  const [stage, setStage] = useState("");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui normalmente faríamos uma chamada de API para criar o negócio
    console.log("Criando negócio:", { funnel, stage, value: value ? parseFloat(value) : 0 });
    
    // Mostra toast de sucesso
    toast.success("Negócio criado com sucesso!");
    
    // Fecha o diálogo
    setOpen(false);
    
    // Reseta o formulário
    setFunnel("");
    setStage("");
    setValue("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Criar negócio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar novo negócio</DialogTitle>
          <DialogDescription>
            Adicione este contato a um funil de vendas criando um novo negócio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="funnel" className="text-right">
                Funil
              </Label>
              <Select
                value={funnel}
                onValueChange={setFunnel}
                required
              >
                <SelectTrigger id="funnel" className="col-span-3">
                  <SelectValue placeholder="Selecione um funil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aquisicao">Aquisição e Qualificação</SelectItem>
                  <SelectItem value="vendas">Funil de Vendas</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stage" className="text-right">
                Etapa
              </Label>
              <Select
                value={stage}
                onValueChange={setStage}
                required
              >
                <SelectTrigger id="stage" className="col-span-3">
                  <SelectValue placeholder="Selecione uma etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo Lead</SelectItem>
                  <SelectItem value="qualificacao">Qualificação</SelectItem>
                  <SelectItem value="conversando">Conversando</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Valor (R$)
              </Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className="col-span-3"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Criar negócio</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const messages = [
    { isOutgoing: false, message: "Olá! Gostaria de saber mais sobre seus produtos.", time: "10:25" },
    { isOutgoing: true, message: "Olá João! Claro, ficarei feliz em ajudar. Que tipo de produto você está procurando?", time: "10:26" },
    { isOutgoing: false, message: "Estou interessado em soluções para automação de vendas.", time: "10:28" },
    { isOutgoing: true, message: "Perfeito! Temos várias opções que podem te ajudar. Posso te enviar um material com mais detalhes?", time: "10:29" },
    { isOutgoing: false, message: "Sim, por favor! E gostaria de agendar uma reunião também.", time: "10:30" },
];

const currentChatLead: Lead = {
  id: "1",
  name: "João Silva",
  company: "ABC Corp",
  phone: "(11) 98765-4321",
  salesperson: "Ana Sales",
  tags: ["potencial", "software"],
  value: 5000,
  date: "10/06/2023",
  activities: false,
  document: "111.222.333-44",
  utms: {
    utm_source: "facebook",
    utm_medium: "social",
  }
};

export function ChatWindow() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center justify-between p-3 border-b">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <div className="flex items-center cursor-pointer">
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
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[450px] p-0">
            <ChatLeadDetailSidebar lead={currentChatLead} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <CreateDealDialog />
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