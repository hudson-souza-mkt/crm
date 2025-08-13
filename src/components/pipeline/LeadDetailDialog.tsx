import { useState } from "react";
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
  Clock,
  MessageSquare,
  PhoneCall,
  CalendarPlus,
  CheckSquare,
  DollarSign,
  Target,
  Activity,
  TrendingUp
} from "lucide-react";
import type { Lead } from "./PipelineCard";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAgendaManager } from "@/hooks/useAgendaManager";
import { AgendaList } from "@/components/agenda/AgendaList";
import { AgendaModal } from "@/components/agenda/AgendaModal";
import { AgendaItem, AgendaItemType } from "@/types/agenda";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [currentStage, setCurrentStage] = useState("Perdido");
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [editingAgendaItem, setEditingAgendaItem] = useState<AgendaItem | null>(null);
  const [defaultAgendaType, setDefaultAgendaType] = useState<AgendaItemType>("task");
  
  // Usar o hook de agenda
  const agendaManager = useAgendaManager({ 
    leadId: lead?.id,
    onItemUpdate: (item) => {
      console.log("Agenda item updated:", item);
    }
  });
  
  if (!lead) return null;

  const stages = ["Novo Lead", "Qualificação", "Conversando", "Proposta", "Ganho", "Perdido"];

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage);
    toast.success(`Negócio movido para: ${newStage}`);
  };

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case "Ganho":
        return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200/80";
      case "Perdido":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200/80";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200/80";
    }
  };

  const handleNewAgenda = (type: AgendaItemType) => {
    setDefaultAgendaType(type);
    setEditingAgendaItem(null);
    setAgendaModalOpen(true);
  };

  const handleEditAgenda = (item: AgendaItem) => {
    setEditingAgendaItem(item);
    setAgendaModalOpen(true);
  };

  const handleAgendaSubmit = (agendaData: Partial<AgendaItem>) => {
    if (editingAgendaItem) {
      agendaManager.updateAgendaItem(editingAgendaItem.id, agendaData);
    } else {
      agendaManager.createAgendaItem({
        ...agendaData,
        leadId: lead.id,
        leadName: lead.name,
        createdBy: lead.salesperson
      });
    }
  };

  const handleExecuteAgenda = (item: AgendaItem) => {
    switch (item.type) {
      case "message":
        if (item.messageChannel === "whatsapp") {
          const cleanPhone = lead.phone.replace(/\D/g, '');
          const message = encodeURIComponent(item.messageTemplate || "");
          window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
          toast.success("WhatsApp aberto com a mensagem");
        } else if (item.messageChannel === "email") {
          const subject = encodeURIComponent(`Assunto: ${item.title}`);
          const body = encodeURIComponent(item.messageTemplate || "");
          window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_self');
          toast.success("Email aberto com a mensagem");
        }
        agendaManager.completeAgendaItem(item.id);
        break;
      case "call":
        window.open(`tel:${lead.phone}`, '_self');
        toast.success("Ligação iniciada");
        agendaManager.updateAgendaItem(item.id, { status: "in-progress" });
        break;
      case "email":
        if (lead.email) {
          const subject = encodeURIComponent(item.title);
          const body = encodeURIComponent(item.description || "");
          window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_self');
          toast.success("Email aberto");
          agendaManager.completeAgendaItem(item.id);
        }
        break;
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Não informado";
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] lg:max-w-[85vw] xl:max-w-[1400px] p-0 h-[90vh] flex flex-col">
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
                <TabsList className="grid w-full grid-cols-4 px-4 flex-shrink-0">
                  <TabsTrigger value="perfil">Perfil</TabsTrigger>
                  <TabsTrigger value="endereco">Endereço</TabsTrigger>
                  <TabsTrigger value="campos">Campos</TabsTrigger>
                  <TabsTrigger value="utms">UTMs</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto p-6">
                  <TabsContent value="perfil" className="space-y-4 mt-0">
                    <InfoField label="Nome" value={`${lead.name} | Marketing Digital`} placeholder="Informe o nome" />
                    <InfoField label="Empresa" value={lead.company} placeholder="Informe a empresa do lead" />
                    <InfoField label="E-mail" value="exemplo@meulead.com" placeholder="Informe o e-mail" />
                    <InfoField label="Telefone" value={lead.phone} placeholder="Informe o telefone" />
                    <InfoField label="Instagram" value="hudson_souza_mkt" placeholder="Informe o Instagram" link="https://instagram.com/hudson_souza_mkt" />
                    <InfoField label="Documento (CPF/CNPJ)" value={lead.document} placeholder="Informe o CPF ou CPNJ" />
                    <InfoField label="Origem" value="Site" placeholder="Como o lead ficou sabendo?" />
                    <InfoField label="Site" value="www.meulead.com.br" placeholder="Informe o site" link="https://www.meulead.com.br" />
                  </TabsContent>
                  <TabsContent value="endereco" className="mt-0">
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhum endereço informado.</p>
                  </TabsContent>
                  <TabsContent value="campos" className="mt-0">
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhum campo adicional.</p>
                  </TabsContent>
                  <TabsContent value="utms" className="space-y-4 mt-0">
                    <InfoField label="utm_source" value={lead.utms?.utm_source} placeholder="Não informado" />
                    <InfoField label="utm_medium" value={lead.utms?.utm_medium} placeholder="Não informado" />
                    <InfoField label="utm_campaign" value={lead.utms?.utm_campaign} placeholder="Não informado" />
                    <InfoField label="utm_term" value={lead.utms?.utm_term} placeholder="Não informado" />
                    <InfoField label="utm_content" value={lead.utms?.utm_content} placeholder="Não informado" />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <DialogHeader className="p-4 border-b flex-row justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Negócio #3</h3>
                  <Select value={currentStage} onValueChange={handleStageChange}>
                    <SelectTrigger className={cn(
                      "w-auto h-auto border-none px-2.5 py-0.5 rounded-md text-xs font-semibold focus:ring-0 focus:ring-offset-0",
                      getStageBadgeClass(currentStage)
                    )}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(stage =>  (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogHeader>
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                <Tabs defaultValue="historico">
                  <TabsList>
                    <TabsTrigger value="historico">Histórico</TabsTrigger>
                    <TabsTrigger value="atividades">Atividades</TabsTrigger>
                    <TabsTrigger value="agenda">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Agenda
                    </TabsTrigger>
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
                  <TabsContent value="agenda" className="pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-semibold">Agenda</h3>
                        <p className="text-sm text-muted-foreground">Gerencie agendamentos e tarefas para este lead</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNewAgenda("task")}
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Nova tarefa
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNewAgenda("call")}
                        >
                          <PhoneCall className="h-4 w-4 mr-2" />
                          Agendar ligação
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNewAgenda("message")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mensagem automática
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleNewAgenda("meeting")}
                        >
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          Nova reunião
                        </Button>
                      </div>
                    </div>
                    
                    <AgendaList
                      items={agendaManager.agendaItems}
                      onEdit={handleEditAgenda}
                      onDelete={agendaManager.deleteAgendaItem}
                      onComplete={agendaManager.completeAgendaItem}
                      onCancel={agendaManager.cancelAgendaItem}
                      onExecute={handleExecuteAgenda}
                      getTypeLabel={agendaManager.getTypeLabel}
                      getStatusLabel={agendaManager.getStatusLabel}
                      getPriorityColor={agendaManager.getPriorityColor}
                      getStatusColor={agendaManager.getStatusColor}
                    />
                  </TabsContent>
                  <TabsContent value="negocios">
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="mx-auto h-10 w-10 mb-2" />
                      <p>Nenhum negócio encontrado.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="chat" className="pt-6">
                    <div className="flex flex-col h-[calc(100vh-320px)] border rounded-lg bg-white">
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
                    {/* AQUI ESTÁ A ABA DE INFORMAÇÕES DO NEGÓCIO - SUBSTITUINDO O ELEMENTO VAZIO */}
                    <div className="p-6 space-y-6">
                      {/* Header de Confirmação */}
                      <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg">
                        <h1 className="text-2xl font-bold text-green-800">
                          ✅ INFORMAÇÕES DO NEGÓCIO CARREGADAS!
                        </h1>
                        <p className="text-green-700">
                          Substituindo o elemento que mostrava "Nenhuma informação do negócio."
                        </p>
                      </div>

                      {/* Métricas Principais */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(lead.value)}</p>
                              </div>
                              <DollarSign className="h-8 w-8 text-green-500" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Etapa Atual</p>
                                <p className="text-xl font-bold text-blue-600">{lead.stage}</p>
                              </div>
                              <Target className="h-8 w-8 text-blue-500" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Origem</p>
                                <p className="text-lg font-bold text-purple-600">{lead.source || 'Manual'}</p>
                              </div>
                              <Activity className="h-8 w-8 text-purple-500" />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-amber-500">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <p className="text-lg font-bold text-amber-600">{lead.status || 'Ativo'}</p>
                              </div>
                              <Clock className="h-8 w-8 text-amber-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informações do Cliente */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Informações do Cliente
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                              <p className="text-lg font-semibold">{lead.name}</p>
                            </div>

                            {lead.company && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                                <p className="text-sm flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  {lead.company}
                                </p>
                              </div>
                            )}

                            {lead.phone && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                                <p className="text-sm flex items-center gap-2">
                                  
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  {lead.phone}
                                </p>
                              </div>
                            )}

                            {lead.email && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="text-sm flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  {lead.email}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Detalhes do Negócio */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5" />
                              Detalhes do Negócio
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Valor do Negócio</label>
                              <p className="text-2xl font-bold text-green-600">{formatCurrency(lead.value)}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Etapa Atual</label>
                              <Badge variant="outline" className="ml-2 text-lg px-3 py-1">
                                {lead.stage}
                              </Badge>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Status</label>
                              <p className="text-sm">{lead.status || "Ativo"}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Origem</label>
                              <p className="text-sm">{lead.source || "Manual"}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Datas Importantes */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Datas Importantes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                              <p className="text-sm font-semibold">{formatDate(lead.createdAt)}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                              <p className="text-sm font-semibold">{formatDate(lead.updatedAt)}</p>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Último contato</label>
                              <p className="text-sm font-semibold">{formatDate(lead.lastContact)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Tags e Observações */}
                      {(lead.tags?.length > 0 || lead.notes) && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Tags e Observações</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {lead.tags && lead.tags.length > 0 && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Tags</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {lead.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {lead.notes && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Observações</label>
                                <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                                  <p className="text-sm">{lead.notes}</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Ações */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Ações Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => console.log('Voltar etapa clicado')}
                            >
                              Voltar Etapa
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => console.log('Avançar etapa clicado')}
                            >
                              Avançar Etapa
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de agenda */}
      <AgendaModal
        open={agendaModalOpen}
        onOpenChange={setAgendaModalOpen}
        onSubmit={handleAgendaSubmit}
        leadId={lead?.id || ""}
        leadName={lead?.name || ""}
        editItem={editingAgendaItem}
        defaultType={defaultAgendaType}
      />
    </>
  );
}