import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, Plus } from "lucide-react";

interface MessageNodeConfigProps {
  data: any;
  onChange: (data: any) => void;
}

// Tipos de mensagem
const MESSAGE_TYPES = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "push", label: "Notificação Push" },
];

export function MessageNodeConfig({ data, onChange }: MessageNodeConfigProps) {
  // Handler para mudança de tipo de mensagem
  const handleMessageTypeChange = (messageType: string) => {
    onChange({
      ...data,
      messageType,
      // Reset algumas configurações específicas do tipo
      messageConfig: {
        ...(data.messageConfig || {}),
        // Manter destinatários se existirem
        recipients: data.messageConfig?.recipients || "",
      }
    });
  };
  
  // Handler genérico para atualização de configuração da mensagem
  const handleConfigChange = (key: string, value: any) => {
    onChange({
      ...data,
      messageConfig: {
        ...(data.messageConfig || {}),
        [key]: value
      }
    });
  };
  
  // Adicionar arquivo ao email
  const handleAddAttachment = () => {
    const newAttachment = data.messageConfig?.newAttachment?.trim() || "";
    if (!newAttachment) return;
    
    const currentAttachments = data.messageConfig?.attachments || [];
    if (!currentAttachments.includes(newAttachment)) {
      handleConfigChange("attachments", [...currentAttachments, newAttachment]);
    }
    handleConfigChange("newAttachment", "");
  };
  
  // Renderizar campos específicos do tipo de mensagem
  const renderMessageTypeFields = () => {
    const messageType = data.messageType || "email";
    
    switch (messageType) {
      case "email":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="sender">Remetente</Label>
              <Select
                value={data.messageConfig?.sender || "default"}
                onValueChange={(value) => handleConfigChange("sender", value)}
              >
                <SelectTrigger id="sender">
                  <SelectValue placeholder="Selecione o remetente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão do sistema (noreply@seudominio.com)</SelectItem>
                  <SelectItem value="company">Nome da empresa (contato@seudominio.com)</SelectItem>
                  <SelectItem value="owner">Responsável pelo lead/negócio</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
              
              {data.messageConfig?.sender === "custom" && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Input 
                    placeholder="Nome do remetente"
                    value={data.messageConfig?.senderName || ""}
                    onChange={(e) => handleConfigChange("senderName", e.target.value)}
                  />
                  <Input 
                    placeholder="Email do remetente"
                    value={data.messageConfig?.senderEmail || ""}
                    onChange={(e) => handleConfigChange("senderEmail", e.target.value)}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="recipients">Destinatários</Label>
              <Textarea 
                id="recipients"
                placeholder="{{lead.email}}, outro@email.com"
                value={data.messageConfig?.recipients || ""}
                onChange={(e) => handleConfigChange("recipients", e.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Separe múltiplos emails com vírgula. Você pode usar variáveis como {{lead.email}}.
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="cc">CC (opcional)</Label>
              <Input 
                id="cc"
                placeholder="cc@email.com, equipe@empresa.com"
                value={data.messageConfig?.cc || ""}
                onChange={(e) => handleConfigChange("cc", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="subject">Assunto</Label>
              <Input 
                id="subject"
                placeholder="Assunto do email"
                value={data.messageConfig?.subject || ""}
                onChange={(e) => handleConfigChange("subject", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="emailType">Tipo de email</Label>
              <RadioGroup 
                id="emailType"
                value={data.messageConfig?.emailType || "template"}
                onValueChange={(value) => handleConfigChange("emailType", value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="template" id="template" />
                  <Label htmlFor="template">Modelo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Personalizado</Label>
                </div>
              </RadioGroup>
            </div>
            
            {data.messageConfig?.emailType === "template" ? (
              <div className="space-y-2 mt-4">
                <Label htmlFor="template">Modelo de email</Label>
                <Select
                  value={data.messageConfig?.template || ""}
                  onValueChange={(value) => handleConfigChange("template", value)}
                >
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Boas-vindas</SelectItem>
                    <SelectItem value="follow_up">Acompanhamento</SelectItem>
                    <SelectItem value="proposal">Proposta comercial</SelectItem>
                    <SelectItem value="thank_you">Agradecimento</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                <Label htmlFor="body">Conteúdo do Email</Label>
                <Tabs defaultValue="html">
                  <TabsList>
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="text">Texto</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html">
                    <Textarea 
                      id="bodyHtml"
                      placeholder="<p>Olá {{lead.name}},</p><p>Texto do email...</p>"
                      value={data.messageConfig?.bodyHtml || ""}
                      onChange={(e) => handleConfigChange("bodyHtml", e.target.value)}
                      rows={6}
                    />
                  </TabsContent>
                  <TabsContent value="text">
                    <Textarea 
                      id="bodyText"
                      placeholder="Olá {{lead.name}},

Texto do email..."
                      value={data.messageConfig?.bodyText || ""}
                      onChange={(e) => handleConfigChange("bodyText", e.target.value)}
                      rows={6}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            <div className="space-y-2 mt-4">
              <Label>Anexos</Label>
              <div className="flex space-x-2">
                <Input 
                  placeholder="{{variavel}} ou URL do arquivo"
                  value={data.messageConfig?.newAttachment || ""}
                  onChange={(e) => handleConfigChange("newAttachment", e.target.value)}
                />
                <Button type="button" onClick={handleAddAttachment}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 space-y-1">
                {(data.messageConfig?.attachments || []).map((attachment: string, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <span className="text-sm truncate">{attachment}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const attachments = [...(data.messageConfig?.attachments || [])];
                        attachments.splice(index, 1);
                        handleConfigChange("attachments", attachments);
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
        
      case "sms":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="recipients">Destinatários</Label>
              <Textarea 
                id="recipients"
                placeholder="{{lead.phone}}, +5511999998888"
                value={data.messageConfig?.recipients || ""}
                onChange={(e) => handleConfigChange("recipients", e.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Separe múltiplos números com vírgula. Inclua o código do país.
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="body">Texto da mensagem</Label>
              <Textarea 
                id="body"
                placeholder="Olá {{lead.name}}, obrigado pelo seu interesse. Gostaríamos de conversar sobre sua necessidade."
                value={data.messageConfig?.body || ""}
                onChange={(e) => handleConfigChange("body", e.target.value)}
                rows={4}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Você pode usar variáveis como {{lead.name}}.</span>
                <span>{(data.messageConfig?.body || "").length}/160 caracteres</span>
              </div>
            </div>
          </>
        );
        
      case "whatsapp":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="recipients">Destinatários</Label>
              <Textarea 
                id="recipients"
                placeholder="{{lead.phone}}, +5511999998888"
                value={data.messageConfig?.recipients || ""}
                onChange={(e) => handleConfigChange("recipients", e.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Separe múltiplos números com vírgula. Inclua o código do país.
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="body">Texto da mensagem</Label>
              <Textarea 
                id="body"
                placeholder="Olá {{lead.name}}, obrigado pelo seu interesse. Gostaríamos de conversar sobre sua necessidade."
                value={data.messageConfig?.body || ""}
                onChange={(e) => handleConfigChange("body", e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="template">Modelo de WhatsApp Business (opcional)</Label>
              <Select
                value={data.messageConfig?.template || "none"}
                onValueChange={(value) => handleConfigChange("template", value)}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não usar modelo</SelectItem>
                  <SelectItem value="welcome">Boas-vindas</SelectItem>
                  <SelectItem value="appointment">Agendamento</SelectItem>
                  <SelectItem value="confirmation">Confirmação</SelectItem>
                  <SelectItem value="update">Atualização</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-start mt-1">
                <Info className="h-4 w-4 mr-2 text-blue-500 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Modelos aprovados do WhatsApp Business permitem enviar mensagens para números não engajados.
                </p>
              </div>
            </div>
          </>
        );
        
      case "push":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="title">Título da notificação</Label>
              <Input 
                id="title"
                placeholder="Título da notificação"
                value={data.messageConfig?.title || ""}
                onChange={(e) => handleConfigChange("title", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="body">Texto da notificação</Label>
              <Textarea 
                id="body"
                placeholder="Texto da notificação"
                value={data.messageConfig?.body || ""}
                onChange={(e) => handleConfigChange("body", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="recipients">Destinatários</Label>
              <Select
                value={data.messageConfig?.recipientType || "user"}
                onValueChange={(value) => handleConfigChange("recipientType", value)}
              >
                <SelectTrigger id="recipients">
                  <SelectValue placeholder="Selecione os destinatários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário específico</SelectItem>
                  <SelectItem value="owner">Responsável pelo lead/negócio</SelectItem>
                  <SelectItem value="team">Equipe específica</SelectItem>
                  <SelectItem value="all">Todos os usuários</SelectItem>
                </SelectContent>
              </Select>
              
              {data.messageConfig?.recipientType === "user" && (
                <Select
                  className="mt-2"
                  value={data.messageConfig?.userId || ""}
                  onValueChange={(value) => handleConfigChange("userId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Amanda Silva</SelectItem>
                    <SelectItem value="2">Bruno Ferreira</SelectItem>
                    <SelectItem value="3">Carlos Oliveira</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {data.messageConfig?.recipientType === "team" && (
                <Select
                  className="mt-2"
                  value={data.messageConfig?.teamId || ""}
                  onValueChange={(value) => handleConfigChange("teamId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Equipe de Vendas</SelectItem>
                    <SelectItem value="2">Equipe de Suporte</SelectItem>
                    <SelectItem value="3">Equipe de Marketing</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="deepLink">Link de destino (opcional)</Label>
              <Input 
                id="deepLink"
                placeholder="Ex: /leads/{{lead.id}}"
                value={data.messageConfig?.deepLink || ""}
                onChange={(e) => handleConfigChange("deepLink", e.target.value)}
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da mensagem</Label>
        <Input 
          id="name" 
          value={data.label || ""}
          onChange={(e) => onChange({...data, label: e.target.value})}
          placeholder="Ex: Enviar email de boas-vindas"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="messageType">Tipo de mensagem</Label>
        <RadioGroup 
          id="messageType"
          value={data.messageType || "email"}
          onValueChange={handleMessageTypeChange}
          className="flex flex-wrap gap-4"
        >
          {MESSAGE_TYPES.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={type.value} />
              <Label htmlFor={type.value}>{type.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {renderMessageTypeFields()}
      
      <div className="space-y-2 mt-4 pt-4 border-t">
        <Label>Opções de erro</Label>
        <RadioGroup 
          value={data.errorHandling || "stop"}
          onValueChange={(value) => onChange({...data, errorHandling: value})}
          className="space-y-2"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="stop" id="stop" className="mt-1" />
            <div>
              <Label htmlFor="stop">Parar automação se falhar</Label>
              <p className="text-xs text-muted-foreground">
                Se a mensagem não for enviada, a automação será interrompida.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="retry" id="retry" className="mt-1" />
            <div>
              <Label htmlFor="retry">Tentar novamente mais tarde</Label>
              <p className="text-xs text-muted-foreground">
                Se falhar, tentará enviar novamente mais tarde (até 3 tentativas).
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="next" id="next" className="mt-1" />
            <div>
              <Label htmlFor="next">Continuar mesmo se falhar</Label>
              <p className="text-xs text-muted-foreground">
                A automação continuará mesmo que a mensagem não seja enviada.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}