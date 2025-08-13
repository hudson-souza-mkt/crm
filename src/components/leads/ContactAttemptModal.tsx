import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Phone,
  MessageSquare,
  Mail,
  Users,
  MapPin,
  Linkedin,
  MessageCircle,
  Clock,
  Calendar,
  Tag,
  DollarSign
} from "lucide-react";
import { useContactAttempts } from "@/hooks/useContactAttempts";
import type { ContactAttemptType, ContactAttemptStatus, ContactAttempt } from "@/types/contact-attempt";
import type { Lead } from "@/types/lead";

interface ContactAttemptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  defaultType?: ContactAttemptType;
  editAttempt?: ContactAttempt;
}

export function ContactAttemptModal({
  open,
  onOpenChange,
  lead,
  defaultType = 'call',
  editAttempt
}: ContactAttemptModalProps) {
  const { createContactAttempt, updateContactAttempt, getTypeLabel, getStatusLabel } = useContactAttempts();
  
  const [formData, setFormData] = useState({
    type: defaultType,
    status: 'success' as ContactAttemptStatus,
    channel: '',
    duration: '',
    notes: '',
    outcome: '',
    cost: '',
    tags: [] as string[],
    scheduleFollowUp: false,
    followUpDate: '',
    followUpTime: ''
  });
  
  const [newTag, setNewTag] = useState('');

  const contactTypes = [
    { value: 'call', label: 'Ligação', icon: Phone, channels: ['Telefone Principal', 'Telefone Secundário', 'WhatsApp Call'] },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, channels: ['WhatsApp Pessoal', 'WhatsApp Business'] },
    { value: 'email', label: 'Email', icon: Mail, channels: ['Email Principal', 'Email Corporativo', 'Email Secundário'] },
    { value: 'sms', label: 'SMS', icon: MessageCircle, channels: ['SMS'] },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, channels: ['LinkedIn Message', 'LinkedIn InMail'] },
    { value: 'meeting', label: 'Reunião', icon: Users, channels: ['Presencial', 'Google Meet', 'Zoom', 'Teams'] },
    { value: 'visit', label: 'Visita', icon: MapPin, channels: ['Visita Comercial', 'Visita Técnica'] },
    { value: 'other', label: 'Outro', icon: MessageCircle, channels: ['Outro'] }
  ];

  const statusOptions = [
    { value: 'success', label: 'Sucesso', description: 'Contato realizado com sucesso' },
    { value: 'interested', label: 'Interessado', description: 'Demonstrou interesse' },
    { value: 'scheduled', label: 'Agendado', description: 'Agendou para outro momento' },
    { value: 'callback_requested', label: 'Solicitou Retorno', description: 'Pediu para ligar depois' },
    { value: 'no_answer', label: 'Não Atendeu', description: 'Não atendeu/respondeu' },
    { value: 'busy', label: 'Ocupado', description: 'Linha ocupada ou indisponível' },
    { value: 'not_interested', label: 'Não Interessado', description: 'Não demonstrou interesse' },
    { value: 'refused', label: 'Recusou', description: 'Recusou o contato' },
    { value: 'invalid', label: 'Inválido', description: 'Número/email inválido' },
    { value: 'failed', label: 'Falhou', description: 'Falha técnica' }
  ];

  const commonTags = [
    'primeira-tentativa', 'follow-up', 'interessado', 'não-interessado',
    'agendamento', 'proposta', 'negociação', 'objeção', 'decisor',
    'influenciador', 'urgente', 'qualificado'
  ];

  useEffect(() => {
    if (editAttempt) {
      setFormData({
        type: editAttempt.type,
        status: editAttempt.status,
        channel: editAttempt.channel,
        duration: editAttempt.duration?.toString() || '',
        notes: editAttempt.notes || '',
        outcome: editAttempt.outcome || '',
        cost: editAttempt.cost?.toString() || '',
        tags: editAttempt.tags || [],
        scheduleFollowUp: !!editAttempt.nextFollowUp,
        followUpDate: editAttempt.nextFollowUp ? editAttempt.nextFollowUp.toISOString().split('T')[0] : '',
        followUpTime: editAttempt.nextFollowUp ? editAttempt.nextFollowUp.toTimeString().slice(0, 5) : ''
      });
    } else {
      setFormData(prev => ({ ...prev, type: defaultType }));
    }
  }, [editAttempt, defaultType, open]);

  const selectedType = contactTypes.find(t => t.value === formData.type);
  const selectedStatus = statusOptions.find(s => s.value === formData.status);

  const handleSubmit = async () => {
    try {
      const attemptData = {
        leadId: lead.id,
        leadName: lead.name,
        type: formData.type,
        status: formData.status,
        channel: formData.channel,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        notes: formData.notes,
        outcome: formData.outcome,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        tags: formData.tags,
        nextFollowUp: formData.scheduleFollowUp && formData.followUpDate 
          ? new Date(`${formData.followUpDate}T${formData.followUpTime || '09:00'}`)
          : undefined
      };

      if (editAttempt) {
        await updateContactAttempt(editAttempt.id, attemptData);
      } else {
        await createContactAttempt(attemptData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar tentativa:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addCommonTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editAttempt ? 'Editar' : 'Registrar'} Tentativa de Contato
          </DialogTitle>
          <DialogDescription>
            {editAttempt ? 'Atualize os dados da tentativa' : 'Registre uma nova tentativa de contato'} com {lead.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo e Canal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Contato</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ContactAttemptType) => 
                  setFormData(prev => ({ ...prev, type: value, channel: '' }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contactTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="channel">Canal</Label>
              <Select
                value={formData.channel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, channel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o canal" />
                </SelectTrigger>
                <SelectContent>
                  {selectedType?.channels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status da Tentativa</Label>
            <Select
              value={formData.status}
              onValueChange={(value: ContactAttemptStatus) => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div>
                      <div className="font-medium">{status.label}</div>
                      <div className="text-xs text-muted-foreground">{status.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStatus && (
              <p className="text-xs text-muted-foreground mt-1">
                {selectedStatus.description}
              </p>
            )}
          </div>

          {/* Duração e Custo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(formData.type === 'call' || formData.type === 'meeting') && (
              <div>
                <Label htmlFor="duration">Duração (segundos)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Ex: 300 (5 minutos)"
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="cost">Custo (opcional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="0.00"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div>
            <Label htmlFor="outcome">Resultado/Outcome</Label>
            <Input
              id="outcome"
              value={formData.outcome}
              onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
              placeholder="Ex: Agendou reunião, Solicitou proposta, Não interessado..."
            />
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Descreva detalhes da conversa, objeções, próximos passos..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="space-y-3">
              {/* Tags atuais */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <span className="text-xs">×</span>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Adicionar nova tag */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nova tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>

              {/* Tags comuns */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Tags comuns:</p>
                <div className="flex flex-wrap gap-1">
                  {commonTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-muted"
                      onClick={() => addCommonTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="scheduleFollowUp">Agendar Follow-up</Label>
              <Switch
                id="scheduleFollowUp"
                checked={formData.scheduleFollowUp}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, scheduleFollowUp: checked }))
                }
              />
            </div>

            {formData.scheduleFollowUp && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="followUpDate">Data do Follow-up</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="followUpTime">Horário</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="followUpTime"
                      type="time"
                      value={formData.followUpTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpTime: e.target.value }))}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {editAttempt ? 'Atualizar' : 'Registrar'} Tentativa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}