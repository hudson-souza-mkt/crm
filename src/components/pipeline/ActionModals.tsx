import { useState } from "react";
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
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Lead } from "./PipelineCard";

interface ActionModalsProps {
  lead: Lead | null;
  activeModal: string | null;
  onClose: () => void;
  onSubmit: (action: string, data: any) => void;
}

export function ActionModals({ lead, activeModal, onClose, onSubmit }: ActionModalsProps) {
  const [formData, setFormData] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  if (!lead) return null;

  const handleSubmit = (action: string) => {
    const data = {
      ...formData,
      leadId: lead.id,
      leadName: lead.name,
      ...(selectedDate && { date: selectedDate }),
      ...(selectedTime && { time: selectedTime })
    };
    onSubmit(action, data);
    setFormData({});
    setSelectedDate(undefined);
    setSelectedTime("");
    onClose();
  };

  // Modal de Agendamento
  const ScheduleModal = () => (
    <Dialog open={activeModal === 'schedule'} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agendar reunião</DialogTitle>
          <DialogDescription>
            Agende uma reunião com {lead.name} - {lead.company}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Reunião comercial"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data</Label>
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Horário</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 18 }, (_, i) => {
                  const hour = Math.floor(i / 2) + 8;
                  const minute = i % 2 === 0 ? "00" : "30";
                  const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                  return (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <Select value={formData.type || ""} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Tipo de reunião" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Ligação</SelectItem>
                <SelectItem value="video">Videochamada</SelectItem>
                <SelectItem value="meeting">Reunião presencial</SelectItem>
                <SelectItem value="demo">Demonstração</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Observações
            </Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Adicione observações sobre a reunião..."
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={() => handleSubmit('schedule')}
            disabled={!formData.title || !selectedDate || !selectedTime}
          >
            Agendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Modal de Tarefa
  const TaskModal = () => (
    <Dialog open={activeModal === 'task'} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
          <DialogDescription>
            Criar uma nova tarefa para {lead.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-title" className="text-right">
              Título
            </Label>
            <Input
              id="task-title"
              value={formData.title || ""}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Enviar proposta comercial"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Prazo</Label>
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
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione o prazo"}
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Prioridade
            </Label>
            <Select value={formData.priority || ""} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="task-description" className="text-right pt-2">
              Descrição
            </Label>
            <Textarea
              id="task-description"
              value={formData.description || ""}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva os detalhes da tarefa..."
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={() => handleSubmit('task')}
            disabled={!formData.title}
          >
            Criar tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Modal de Nota
  const NoteModal = () => (
    <Dialog open={activeModal === 'note'} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova nota</DialogTitle>
          <DialogDescription>
            Adicionar uma nota para {lead.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note-title" className="text-right">
              Título
            </Label>
            <Input
              id="note-title"
              value={formData.title || ""}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Conversa telefônica"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="note-content" className="text-right pt-2">
              Conteúdo
            </Label>
            <Textarea
              id="note-content"
              value={formData.content || ""}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Escreva sua nota aqui..."
              className="col-span-3"
              rows={5}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note-type" className="text-right">
              Tipo
            </Label>
            <Select value={formData.type || ""} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Tipo de nota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Ligação</SelectItem>
                <SelectItem value="meeting">Reunião</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="general">Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={() => handleSubmit('note')}
            disabled={!formData.content}
          >
            Salvar nota
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <ScheduleModal />
      <TaskModal />
      <NoteModal />
    </>
  );
}