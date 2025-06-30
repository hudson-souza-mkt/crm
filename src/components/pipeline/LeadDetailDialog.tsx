import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  X,
  User,
  Building,
  Instagram,
  FileText,
  Globe,
  ExternalLink,
  List,
  Check,
  Send,
  Smile,
} from "lucide-react";
import type { Lead } from "./PipelineCard";
import { ChatMessage } from "@/components/chat/ChatMessage";

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const historyMock = [
  {
    type: "tag_add",
    content: 'Tag "Morno" adicionada ao lead.',
    date: "27/06/2025 14:46",
  },
  {
    type: "tag_add",
    content: 'Tag "Quente" adicionada ao lead.',
    date: "26/06/2025 16:30",
  },
  {
    type: "tag_remove",
    content: 'Tag "Morno" removida do lead.',
    date: "26/06/2025 16:30",
  },
  {
    type: "tag_add",
    content: 'Tag "Morno" adicionada ao lead.',
    date: "25/06/2025 11:30",
  },
  {
    type: "lead_update",
    content: "Lead atualizado.",
    date: "25/06/2025 10:01",
  },
];

const chatMessagesMock = [
    { isOutgoing: false, message: "Olá! Gostaria de saber mais sobre seus produtos.", time: "10:25" },
    { isOutgoing: true, message: "Olá João! Claro, ficarei feliz em ajudar. Que tipo de produto você está procurando?", time: "10:26" },
    { isOutgoing: false, message: "Estou interessado em soluções para automação de vendas.", time: "10:28" },
];

const TimelineItem = ({ icon, children, isLast = false }: { icon: React.ReactNode, children: React.ReactNode, isLast?: boolean }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center text-green-600">
        {icon}
      </div>
      {!isLast && <div className="w-px h-full bg-gray-200" />}
    </div>
    <div className="pb-8 flex-1">
      <div className="p-4 rounded-lg bg-white border">
        {children}
      </div>
    </div>
  </div>
);

const getIconForHistory = (type: string) => {
  switch (type) {
    case "tag_add":
    case "tag_remove":
      return <Tag className="h-4 w-4" />;
    case "lead_update":
      return <Edit className="h-4 w-4" />;
    default:
      return <Briefcase className="h-4 w-4" />;
  }
};

const InfoField = ({ label, value, placeholder, link }: { label: string, value?: string, placeholder: string, link?: string }) => (
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

export function LeadDetailDialog({ lead, open, onOpenChange }: LeadDetailDialogProps) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] lg:max-w-[70vw] xl:max-w-[1200px] p-0 h-[90vh] flex flex-col">
        <div className="flex h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-[350px] bg-gray-50 border-r flex-shrink-0 flex flex-col">
            <div className="p-6">
              <div className="relative w-24 h-24 mx-auto">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {lead.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold text-center mt-4">{lead.name}</h2>
              <p className="text-sm text-muted-foreground text-center">{lead.company || "Marketing Digital"}</p>
              
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
                <span>{lead.salesperson}</span>
              </div>
            </div>

            <Tabs defaultValue="perfil" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-3 px-4 flex-shrink-0">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="campos">Campos</TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="perfil" className="space-y-4 mt-0">
                  <InfoField label="Nome" value={`${lead.name} | Marketing Digital`} placeholder="Informe o nome" />
                  <InfoField label="Empresa" value={lead.company} placeholder="Informe a empresa do lead" />
                  <InfoField label="E-mail" value="exemplo@meulead.com" placeholder="Informe o e-mail" />
                  <InfoField label="Telefone" value={lead.phone} placeholder="Informe o telefone" />
                  <InfoField label="Instagram" value="hudson_souza_mkt" placeholder="Informe o Instagram" link="https://instagram.com/hudson_souza_mkt" />
                  <InfoField label="Documento" placeholder="Informe o CPF ou CPNJ" />
                  <InfoField label="Origem" value="Site" placeholder="Como o lead ficou sabendo?" />
                  <InfoField label="Site" value="www.meulead.com.br" placeholder="Informe o site" link="https://www.meulead.com.br" />
                </TabsContent>
                <TabsContent value="endereco" className="mt-0">
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum endereço informado.</p>
                </TabsContent>
                <TabsContent value="campos" className="mt-0">
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhum campo adicional.</p>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <DialogHeader className="p-4 border-b flex-row justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Negócio #3</h3>
                <Badge variant="destructive">Perdido</Badge>
              </div>
            </DialogHeader>
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
              <Tabs defaultValue="historico">
                <TabsList>
                  <TabsTrigger value="historico">Histórico</TabsTrigger>
                  <TabsTrigger value="atividades">Atividades</TabsTrigger>
                  <TabsTrigger value="negocios">Negócios</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
                  <TabsTrigger value="info">Informações do Negócio</TabsTrigger>
                </TabsList>
                <TabsContent value="historico" className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Histórico</h3>
                      <p className="text-sm text-muted-foreground">Veja o histórico do seu lead</p>
                    </div>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Todos os Tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os Tipos</SelectItem>
                          <SelectItem value="tags">Tags</SelectItem>
                          <SelectItem value="updates">Atualizações</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Comentário
                      </Button>
                    </div>
                  </div>
                  <div>
                    {historyMock.map((item, index) => (
                      <TimelineItem key={index} icon={getIconForHistory(item.type)} isLast={index === historyMock.length - 1}>
                        <p className="font-medium">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                      </TimelineItem>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="atividades">
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-10 w-10 mb-2" />
                    <p>Nenhuma atividade encontrada.</p>
                  </div>
                </TabsContent>
                <TabsContent value="negocios">
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-10 w-10 mb-2" />
                    <p>Nenhum negócio encontrado.</p>
                  </div>
                </TabsContent>
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
                <TabsContent value="arquivos">
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="mx-auto h-10 w-10 mb-2" />
                    <p>Nenhum arquivo encontrado.</p>
                  </div>
                </TabsContent>
                <TabsContent value="info">
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="mx-auto h-10 w-10 mb-2" />
                    <p>Nenhuma informação do negócio.</p>
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