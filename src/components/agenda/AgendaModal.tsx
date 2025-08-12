import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, MessageSquare, Phone, Mail, Users, CheckSquare, Target } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AgendaItem, AgendaItemType, MessageChannel, MessageTemplate } from "@/types/agenda";
import { Badge } from "@/components/ui/badge";

interface AgendaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (agendaData: Partial<AgendaItem>) => void;
  leadId: string;
  leadName: string;
  editItem?: AgendaItem | null;
  defaultType?: AgendaItemType;
}

// Templates de mensagem mockados
const messageTemplates: MessageTemplate[] = [
  {
    id: "template-1",
    name: "Follow-up inicial",
    channel: "whatsapp",
    content: "Olá {nome}! Espero que esteja bem. Gostaria de saber se teve a oportunidade de analisar nossa proposta. Estou à disposição para esclarecer qualquer dúvida!",
    variables: ["nome", "empresa"],
    isDefault: true
  },
  {
    id: "template-2",
    name: "Envio de proposta",
    channel: "email",
    subject: "Proposta Comercial - {empresa}",
    content: "Prezado(a) {nome},\n\nConforme conversamos, segue em anexo nossa proposta comercial personalizada para {empresa}.\n\nFico à disposição para esclarecimentos.\n\nAtenciosamente,",
    variables: ["nome", "empresa"],
    isDefault: false
  },
  {
    id: "template-3",
    name: "Lembrete de reunião",
    channel: "whatsapp",
    content: "Oi {nome}! Lembrando que temos nossa reunião agendada para hoje às {horario}. Confirma sua presença? 😊",
    variables: ["nome", "horario"],
    isDefault: false
  }
];

export function AgendaModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  leadId, 
  leadName, 
  editItem,
  defaultType = "task"
}: AgendaModalProps) {
  const [formData, setFormData] = useState<Partial<AgendaItem>>({
    type: defaultType,
    leadId,
    leadName,
    priority: "medium",
    messageChannel: "whatsapp"
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
      setSelectedDate(editItem.scheduledDate);
      setSelectedTime(editItem.scheduledTime);
    } else {
      setFormData({
        type: defaultType,
        leadId,
        leadName,
        priority: "medium",
        messageChannel: "whatsapp"
      });
      setSelectedDate(undefined);
      setSelectedTime("09:00");
    }
  }, [editItem, defaultType, leadId, leadName]);

  const handleSubmit = () => {
    if (!formData.title || !selectedDate) {
      return;
    }

    const agendaData: Partial<AgendaItem> = {
      ...formData,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
    };

    // Se for mensagem e tiver template selecionado
    if (formData.type === "message" && selectedTemplate) {
      const template = messageTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        agendaData.messageTemplate = template.content;
        agendaData.messageChannel = template.channel;
      }
    }

    onSubmit(agendaData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      type: defaultType,
      leadId,
      leadName,
      priority: "medium",
      messageChannel: "whatsapp"
    });
    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setSelectedTemplate("");
    onOpenChange(false);
  };

  const getTypeIcon = (type: AgendaItemType) => {
    switch (type) {
      case "task": return <CheckSquare className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      case "call": return <Phone className="h-4 w-4" />;
      case "meeting": return <Users className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "follow-up": return <Target className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getAvailableTemplates = () => {
    return messageTemplates.filter(template => 
      template.channel === formData.messageChannel
    );
  };

  const applyTemplate = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        messageTemplate: template.content,
        title: prev.title || template.name
      }));
      setSelectedTemplate(templateId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(formData.type || "task")}
            {editItem ? "Editar agendamento" : "Novo agendamento"}
          </DialogTitle>
          <DialogDescription>
            {editItem ? "Edite os dados do agendamento" : "Crie um novo agendamento"} para {leadName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Tipo de agendamento */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tipo</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: AgendaItemType) => setFormData({...formData, type: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Tarefa
                  </div>
                </SelectItem>
                <SelectItem value="message">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Mensagem automática
                  </div>
                </SelectItem>
                <SelectItem value="call">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Ligação
                  </div>
                </SelectItem>
                <SelectItem value="meeting">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Reunião
                  </div>
                </SelectItem>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="follow-up">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Follow-up
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título *
            </Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Ligar para discutir proposta"
              className="col-span-3"
            />
          </div>
          
          {/* Data */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data *</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Horário */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Horário</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return [
                    <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                      {hour}:00
                    </SelectItem>,
                    <SelectItem key={`${hour}:30`} value={`${hour}:30`}>
                      {hour}:30
                    </SelectItem>
                  ];
                }).flat()}
              </SelectContent>
            </Select>
          </div>

          {/* Prioridade (para tarefas) */}
          {(formData.type === "task" || formData.type === "call" || formData.type === "meeting") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Prioridade</Label>
              <Select 
                value={formData.priority || "medium"} 
                onValueChange={(value) => setFormData({...formData, priority: value as any})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <Badge variant="outline" className="text-green-600 bg-green-50">Baixa</Badge>
                  </SelectItem>
                  <SelectItem value="medium">
                    <Badge variant="outline" className="text-yellow-600 bg-yellow-50">Média</Badge>
                  </SelectItem>
                  <SelectItem value="high">
                    <Badge variant="outline" className="text-orange-600 bg-orange-50">Alta</Badge>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <Badge variant="outline" className="text-red-600 bg-red-50">Urgente</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Duração estimada (para tarefas e reuniões) */}
          {(formData.type === "task" || formData.type === "meeting" || formData.type === "call") && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Duração (min)</Label>
              <Input
                type="number"
                value={formData.estimatedDuration || ""}
                onChange={(e) => setFormData({...formData, estimatedDuration: parseInt(e.target.value) || undefined})}
                placeholder="30"
                className="col-span-3"
              />
            </div>
          )}

          {/* Canal de mensagem (para mensagens) */}
          {formData.type === "message" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Canal</Label>
              <Select 
                value={formData.messageChannel} 
                onValueChange={(value: MessageChannel) => setFormData({...formData, messageChannel: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Templates de mensagem */}
          {formData.type === "message" && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Template</Label>
              <div className="col-span-3 space-y-2">
                <Select value={selectedTemplate} onValueChange={applyTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTemplates().map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <div className="text-xs text-muted-foreground">
                    Variáveis disponíveis: {messageTemplates.find(t => t.id === selectedTemplate)?.variables.map(v => `{${v}}`).join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conteúdo da mensagem */}
          {formData.type === "message" && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="messageTemplate" className="text-right pt-2">
                Mensagem
              </Label>
              <Textarea
                id="messageTemplate"
                value={formData.messageTemplate || ""}
                onChange={(e) => setFormData({...formData, messageTemplate: e.target.value})}
                placeholder="Digite a mensagem que será enviada automaticamente..."
                className="col-span-3"
                rows={4}
              />
            </div>
          )}

          {/* Link da reunião (para reuniões) */}
          {formData.type === "meeting" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Link da reunião</Label>
              <Input
                value={formData.meetingLink || ""}
                onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                placeholder="https://meet.google.com/..."
                className="col-span-3"
              />
            </div>
          )}
          
          {/* Descrição */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Adicione detalhes sobre este agendamento..."
              className="col-span-3"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tags</Label>
            <Input
              value={formData.tags?.join(", ") || ""}
              onChange={(e) => setFormData({...formData, tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)})}
              placeholder="vendas, urgente, proposta"
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.title || !selectedDate}
          >
            {editItem ? "Salvar alterações" : "Criar agendamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}