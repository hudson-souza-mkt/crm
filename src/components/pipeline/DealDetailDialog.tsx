import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  Edit,
  Briefcase,
  Plus,
  User,
  List,
  Check,
  Send,
  Smile,
  X,
  ExternalLink
} from "lucide-react";
import type { Deal, PipelineStage } from "@/types/deal";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DealDetailDialogProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InfoField = ({ label, value, placeholder, link }: { label: string, value?: string | null, placeholder: string, link?: string }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    {value ? (
      <div className="flex items-center justify-between group">
        <p className="text-sm text-gray-800">{value}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary" />
          </a>
        )}
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">{placeholder}</p>
    )}
  </div>
);

const chatMessagesMock = [
    { isOutgoing: false, message: "Olá! Gostaria de saber mais sobre seus produtos.", time: "10:25" },
    { isOutgoing: true, message: "Olá! Claro, ficarei feliz em ajudar. Que tipo de produto você está procurando?", time: "10:26" },
    { isOutgoing: false, message: "Estou interessado em soluções para automação de vendas.", time: "10:28" },
];

export function DealDetailDialog({ deal, open, onOpenChange }: DealDetailDialogProps) {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [currentStageId, setCurrentStageId] = useState(deal?.pipeline_stage_id || "");

  useEffect(() => {
    if (open) {
      fetchStages();
    }
    if (deal) {
      setCurrentStageId(deal.pipeline_stage_id);
    }
  }, [open, deal]);

  const fetchStages = async () => {
    const { data } = await supabase.from('pipeline_stages').select('*').order('order');
    if (data) {
      setStages(data);
    }
  };

  const handleStageChange = async (newStageId: string) => {
    if (!deal) return;
    
    const { error } = await supabase
      .from('deals')
      .update({ pipeline_stage_id: newStageId, updated_at: new Date().toISOString() })
      .eq('id', deal.id);

    if (error) {
      toast.error("Falha ao mover negócio.");
    } else {
      setCurrentStageId(newStageId);
      toast.success("Negócio movido com sucesso!");
      // Idealmente, teríamos uma função de callback para atualizar o Kanban
    }
  };

  if (!deal) return null;

  const currentStage = stages.find(s => s.id === currentStageId);
  const lead = deal.leads;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] lg:max-w-[85vw] xl:max-w-[1400px] p-0 h-[90vh] flex flex-col">
        <div className="flex h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-[350px] bg-gray-50 border-r flex-shrink-0 flex flex-col">
            <div className="p-6">
              <div className="relative w-24 h-24 mx-auto">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {lead?.name?.charAt(0) || 'L'}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold text-center mt-4">{lead?.name}</h2>
              <p className="text-sm text-muted-foreground text-center">{lead?.company || "Sem empresa"}</p>
              
              <div className="mt-4 flex gap-2">
                <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  <Check className="h-4 w-4 mr-2" />
                  Ganhar
                </Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  <X className="h-4 w-4 mr-2" />
                  Perder
                </Button>
              </div>

              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start text-muted-foreground">
                  <Tag className="h-4 w-4 mr-2" /> Adicionar tags
                </Button>
                <Button variant="outline" className="w-full justify-start text-muted-foreground">
                  <List className="h-4 w-4 mr-2" /> Adicionar listas
                </Button>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                <span>{lead?.assignedTo || "Sem responsável"}</span>
              </div>
            </div>

            <Tabs defaultValue="perfil" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-3 px-4 flex-shrink-0">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="campos">Campos</TabsTrigger>
                <TabsTrigger value="utms">UTMs</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="perfil" className="space-y-4 mt-0">
                  <InfoField label="Nome" value={lead?.name} placeholder="Não informado" />
                  <InfoField label="Empresa" value={lead?.company} placeholder="Não informado" />
                  <InfoField label="E-mail" value={lead?.email} placeholder="Não informado" />
                  <InfoField label="Telefone" value={lead?.phone} placeholder="Não informado" />
                  <InfoField label="Documento (CPF/CNPJ)" value={lead?.document} placeholder="Não informado" />
                </TabsContent>
                <TabsContent value="campos" className="mt-0">
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum campo adicional.</p>
                </TabsContent>
                <TabsContent value="utms" className="space-y-4 mt-0">
                  <InfoField label="utm_source" value={lead?.utms?.utm_source} placeholder="Não informado" />
                  <InfoField label="utm_medium" value={lead?.utms?.utm_medium} placeholder="Não informado" />
                  <InfoField label="utm_campaign" value={lead?.utms?.utm_campaign} placeholder="Não informado" />
                  <InfoField label="utm_term" value={lead?.utms?.utm_term} placeholder="Não informado" />
                  <InfoField label="utm_content" value={lead?.utms?.utm_content} placeholder="Não informado" />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-4 border-b flex-row justify-between items-center flex-shrink-0 flex">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{deal.name}</h3>
                <Select value={currentStageId} onValueChange={handleStageChange}>
                  <SelectTrigger className={cn(
                    "w-auto h-auto border-none px-2.5 py-0.5 rounded-md text-xs font-semibold focus:ring-0 focus:ring-offset-0",
                    currentStage && `bg-${currentStage.color}-100 text-${currentStage.color}-700 border-${currentStage.color}-200`
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
              <Tabs defaultValue="chat">
                <TabsList>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="atividades">Atividades</TabsTrigger>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="pt-6">
                  <div className="flex flex-col h-[calc(100vh - 320px)] border rounded-lg bg-white">
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {chatMessagesMock.map((msg, index) => (
                          <ChatMessage key={index} isOutgoing={msg.isOutgoing} message={msg.message} time={msg.time} />
                      ))}
                    </div>
                    <div className="p-3 bg-white border-t">
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
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="atividades">
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-10 w-10 mb-2" />
                    <p>Nenhuma atividade encontrada.</p>
                  </div>
                </TabsContent>
                <TabsContent value="historico">
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-10 w-10 mb-2" />
                    <p>Nenhum histórico encontrado.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}