import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  X,
  Upload,
  MessageSquare,
  Image,
  Video,
  Music,
  FileText,
  Link,
  MapPin,
  Play,
  Pause,
  Eye,
  Save,
  Zap,
  Clock,
  Type,
  Hash,
  Calendar,
  Mail,
  Phone,
  ToggleLeft
} from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import { VariableManager } from "./VariableManager";
import { SequencePreview } from "./SequencePreview";
import type { QuickResponse, MessageContent, Variable, MessageType } from "@/types/playbook";

interface ResponseEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response?: QuickResponse | null;
  folderId?: string | null;
  onSave: (response: Partial<QuickResponse>) => void;
}

export function ResponseEditor({
  open,
  onOpenChange,
  response,
  folderId,
  onSave
}: ResponseEditorProps) {
  const [formData, setFormData] = useState<Partial<QuickResponse>>({
    name: "",
    description: "",
    content: [],
    variables: [],
    tags: [],
    isSequence: false,
    sequenceDelay: 3
  });
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState("content");
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (response) {
      setFormData(response);
    } else {
      setFormData({
        name: "",
        description: "",
        content: [],
        variables: [],
        tags: [],
        isSequence: false,
        sequenceDelay: 3,
        folderId: folderId || undefined
      });
    }
  }, [response, folderId]);

  const handleSave = () => {
    if (!formData.name?.trim()) {
      return;
    }
    onSave(formData);
    onOpenChange(false);
  };

  const addMessageContent = (type: MessageType) => {
    const newMessage: MessageContent = {
      id: `msg-${Date.now()}`,
      type,
      order: (formData.content?.length || 0) + 1,
      content: "",
      delay: formData.isSequence ? 2 : undefined
    };

    setFormData(prev => ({
      ...prev,
      content: [...(prev.content || []), newMessage]
    }));
  };

  const updateMessageContent = (id: string, updates: Partial<MessageContent>) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content?.map(msg => 
        msg.id === id ? { ...msg, ...updates } : msg
      ) || []
    }));
  };

  const removeMessageContent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content?.filter(msg => msg.id !== id) || []
    }));
  };

  const moveMessage = (id: string, direction: 'up' | 'down') => {
    const messages = [...(formData.content || [])];
    const index = messages.findIndex(msg => msg.id === id);
    
    if (direction === 'up' && index > 0) {
      [messages[index], messages[index - 1]] = [messages[index - 1], messages[index]];
    } else if (direction === 'down' && index < messages.length - 1) {
      [messages[index], messages[index + 1]] = [messages[index + 1], messages[index]];
    }

    // Reordenar
    messages.forEach((msg, idx) => {
      msg.order = idx + 1;
    });

    setFormData(prev => ({ ...prev, content: messages }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const getMessageTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'text': return MessageSquare;
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      case 'link': return Link;
      case 'location': return MapPin;
      default: return MessageSquare;
    }
  };

  const getVariableTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return Type;
      case 'number': return Hash;
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'date': return Calendar;
      case 'boolean': return ToggleLeft;
      default: return Type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {response ? "Editar Resposta" : "Nova Resposta"}
          </DialogTitle>
          <DialogDescription>
            Configure sua resposta rápida com conteúdo multimídia e variáveis dinâmicas
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="variables">Variáveis</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="content" className="space-y-4 p-1">
              {/* Informações Básicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Resposta</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Saudação Personalizada"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva quando usar esta resposta..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Conteúdo das Mensagens */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Mensagens</CardTitle>
                      <CardDescription>
                        Adicione diferentes tipos de conteúdo à sua resposta
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addMessageContent('text')}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Texto
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addMessageContent('image')}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Imagem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addMessageContent('video')}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Vídeo
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {formData.content && formData.content.length > 0 ? (
                    <div className="space-y-3">
                      {formData.content
                        .sort((a, b) => a.order - b.order)
                        .map((message, index) => {
                          const Icon = getMessageTypeIcon(message.type);
                          return (
                            <div key={message.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <Icon className="h-4 w-4" />
                                  <span className="font-medium capitalize">{message.type}</span>
                                  {formData.isSequence && message.delay && (
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {message.delay}s
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveMessage(message.id, 'up')}
                                    disabled={index === 0}
                                    className="h-6 w-6"
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveMessage(message.id, 'down')}
                                    disabled={index === formData.content!.length - 1}
                                    className="h-6 w-6"
                                  >
                                    ↓
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeMessageContent(message.id)}
                                    className="h-6 w-6 text-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {message.type === 'text' && (
                                <Textarea
                                  value={message.content}
                                  onChange={(e) => updateMessageContent(message.id, { content: e.target.value })}
                                  placeholder="Digite sua mensagem... Use {variavel} para personalizar"
                                  rows={3}
                                />
                              )}

                              {(message.type === 'image' || message.type === 'video' || message.type === 'audio' || message.type === 'document') && (
                                <MediaUploader
                                  type={message.type}
                                  onUpload={(url, metadata) => {
                                    updateMessageContent(message.id, {
                                      mediaUrl: url,
                                      mediaType: metadata.type,
                                      mediaSize: metadata.size,
                                      fileName: metadata.name,
                                      duration: metadata.duration
                                    });
                                  }}
                                  currentUrl={message.mediaUrl}
                                />
                              )}

                              {message.type === 'link' && (
                                <div className="space-y-2">
                                  <Input
                                    value={message.content}
                                    onChange={(e) => updateMessageContent(message.id, { content: e.target.value })}
                                    placeholder="https://exemplo.com"
                                  />
                                  <Input
                                    placeholder="Texto do link (opcional)"
                                    onChange={(e) => updateMessageContent(message.id, { 
                                      linkPreview: { 
                                        ...message.linkPreview, 
                                        title: e.target.value,
                                        url: message.content,
                                        domain: new URL(message.content || 'https://exemplo.com').hostname
                                      } 
                                    })}
                                  />
                                </div>
                              )}

                              {formData.isSequence && (
                                <div className="mt-3 pt-3 border-t">
                                  <Label htmlFor={`delay-${message.id}`}>Delay antes desta mensagem (segundos)</Label>
                                  <Input
                                    id={`delay-${message.id}`}
                                    type="number"
                                    min="0"
                                    max="300"
                                    value={message.delay || 0}
                                    onChange={(e) => updateMessageContent(message.id, { delay: parseInt(e.target.value) || 0 })}
                                    className="w-24 mt-1"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhuma mensagem adicionada</p>
                      <p className="text-sm">Clique nos botões acima para adicionar conteúdo</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variables" className="space-y-4 p-1">
              <VariableManager
                variables={formData.variables || []}
                onChange={(variables) => setFormData(prev => ({ ...prev, variables }))}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 p-1">
              {/* Configurações de Sequência */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Configurações de Sequência
                  </CardTitle>
                  <CardDescription>
                    Configure se esta resposta deve ser enviada como uma sequência de mensagens
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isSequence">Enviar como Sequência</Label>
                      <p className="text-sm text-muted-foreground">
                        Mensagens serão enviadas automaticamente com delays
                      </p>
                    </div>
                    <Switch
                      id="isSequence"
                      checked={formData.isSequence || false}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSequence: checked }))}
                    />
                  </div>

                  {formData.isSequence && (
                    <div>
                      <Label htmlFor="sequenceDelay">Delay Padrão entre Mensagens (segundos)</Label>
                      <Input
                        id="sequenceDelay"
                        type="number"
                        min="1"
                        max="60"
                        value={formData.sequenceDelay || 3}
                        onChange={(e) => setFormData(prev => ({ ...prev, sequenceDelay: parseInt(e.target.value) || 3 }))}
                        className="w-24 mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Cada mensagem pode ter seu próprio delay personalizado
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                  <CardDescription>
                    Adicione tags para organizar e filtrar suas respostas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Digite uma tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 p-1">
              <SequencePreview
                messages={formData.content || []}
                variables={formData.variables || []}
                isSequence={formData.isSequence || false}
              />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!formData.name?.trim()}>
            <Save className="h-4 w-4 mr-2" />
            {response ? "Atualizar" : "Criar"} Resposta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}