import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  MessageSquare,
  Image,
  Video,
  Music,
  FileText,
  Link,
  MapPin,
  User,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageContent, Variable } from "@/types/playbook";

interface SequencePreviewProps {
  messages: MessageContent[];
  variables: Variable[];
  isSequence: boolean;
}

export function SequencePreview({ messages, variables, isSequence }: SequencePreviewProps) {
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const sortedMessages = [...messages].sort((a, b) => a.order - b.order);
  const totalDuration = sortedMessages.reduce((sum, msg) => sum + (msg.delay || 0), 0);

  const getMessageTypeIcon = (type: string) => {
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

  const replaceVariables = (content: string) => {
    let result = content;
    variables.forEach(variable => {
      const value = variableValues[variable.key] || variable.defaultValue || `{${variable.key}}`;
      result = result.replace(new RegExp(`\\{${variable.key}\\}`, 'g'), value);
    });
    return result;
  };

  const startPreview = () => {
    if (sortedMessages.length === 0) return;
    
    setIsPlaying(true);
    setCurrentMessageIndex(0);
    
    let messageIndex = 0;
    const showNextMessage = () => {
      if (messageIndex < sortedMessages.length) {
        setCurrentMessageIndex(messageIndex);
        const currentMessage = sortedMessages[messageIndex];
        const delay = (currentMessage.delay || 0) * 1000 / playbackSpeed;
        
        setTimeout(() => {
          messageIndex++;
          if (messageIndex < sortedMessages.length && isPlaying) {
            showNextMessage();
          } else {
            setIsPlaying(false);
          }
        }, delay);
      }
    };
    
    showNextMessage();
  };

  const stopPreview = () => {
    setIsPlaying(false);
    setCurrentMessageIndex(-1);
  };

  const resetPreview = () => {
    setIsPlaying(false);
    setCurrentMessageIndex(-1);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Preview da Resposta</h3>
        <p className="text-sm text-muted-foreground">
          Visualize como sua resposta será exibida para o cliente
        </p>
      </div>

      {/* Configuração de Variáveis */}
      {variables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preencher Variáveis</CardTitle>
            <CardDescription>
              Configure os valores das variáveis para ver o preview personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {variables.map((variable) => (
                <div key={variable.id}>
                  <Label htmlFor={`var-${variable.id}`}>
                    {variable.name}
                    {variable.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {variable.type === 'select' && variable.options ? (
                    <Select
                      value={variableValues[variable.key] || ""}
                      onValueChange={(value) => setVariableValues(prev => ({ ...prev, [variable.key]: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione ${variable.name.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {variable.options.map((option, index) => (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={`var-${variable.id}`}
                      type={variable.type === 'number' ? 'number' : 
                            variable.type === 'email' ? 'email' : 
                            variable.type === 'date' ? 'date' : 'text'}
                      value={variableValues[variable.key] || ""}
                      onChange={(e) => setVariableValues(prev => ({ ...prev, [variable.key]: e.target.value }))}
                      placeholder={variable.defaultValue || `Digite ${variable.name.toLowerCase()}`}
                    />
                  )}
                  
                  {variable.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {variable.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles de Preview */}
      {isSequence && sortedMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Play className="h-4 w-4" />
              Controles de Sequência
            </CardTitle>
            <CardDescription>
              Simule como a sequência será enviada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Button
                onClick={isPlaying ? stopPreview : startPreview}
                disabled={sortedMessages.length === 0}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Reproduzir
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={resetPreview}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>

              <div className="flex items-center gap-2">
                <Label htmlFor="speed">Velocidade:</Label>
                <Select
                  value={playbackSpeed.toString()}
                  onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                    <SelectItem value="5">5x</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Duração total: {formatDuration(Math.ceil(totalDuration / playbackSpeed))}</span>
              </div>
            </div>

            {/* Progress */}
            {isSequence && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>
                    {currentMessageIndex + 1} de {sortedMessages.length} mensagens
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentMessageIndex + 1) / sortedMessages.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview da Conversa</CardTitle>
          <CardDescription>
            Como a conversa aparecerá para o cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {sortedMessages.map((message, index) => {
                const Icon = getMessageTypeIcon(message.type);
                const isVisible = !isSequence || currentMessageIndex >= index;
                const isCurrentMessage = currentMessageIndex === index;
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 transition-all duration-500",
                      !isVisible && "opacity-30",
                      isCurrentMessage && "ring-2 ring-primary rounded-lg p-2"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Agente</span>
                        <Badge variant="outline" className="text-xs">
                          <Icon className="h-3 w-3 mr-1" />
                          {message.type}
                        </Badge>
                        {message.delay && isSequence && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            +{message.delay}s
                          </Badge>
                        )}
                      </div>
                      
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                        {message.type === 'text' && (
                          <p className="text-sm whitespace-pre-wrap">
                            {replaceVariables(message.content)}
                          </p>
                        )}
                        
                        {message.type === 'image' && (
                          <div className="space-y-2">
                            <div className="bg-white/20 rounded p-2 text-center">
                              <Image className="h-8 w-8 mx-auto mb-1" />
                              <p className="text-xs">Imagem</p>
                            </div>
                            {message.content && (
                              <p className="text-sm">{replaceVariables(message.content)}</p>
                            )}
                          </div>
                        )}
                        
                        {message.type === 'video' && (
                          <div className="space-y-2">
                            <div className="bg-white/20 rounded p-2 text-center">
                              <Video className="h-8 w-8 mx-auto mb-1" />
                              <p className="text-xs">Vídeo</p>
                              {message.duration && (
                                <p className="text-xs opacity-75">
                                  {formatDuration(message.duration)}
                                </p>
                              )}
                            </div>
                            {message.content && (
                              <p className="text-sm">{replaceVariables(message.content)}</p>
                            )}
                          </div>
                        )}
                        
                        {message.type === 'audio' && (
                          <div className="space-y-2">
                            <div className="bg-white/20 rounded p-2 text-center">
                              <Music className="h-8 w-8 mx-auto mb-1" />
                              <p className="text-xs">Áudio</p>
                              {message.duration && (
                                <p className="text-xs opacity-75">
                                  {formatDuration(message.duration)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {message.type === 'document' && (
                          <div className="space-y-2">
                            <div className="bg-white/20 rounded p-2 text-center">
                              <FileText className="h-8 w-8 mx-auto mb-1" />
                              <p className="text-xs">Documento</p>
                              {message.fileName && (
                                <p className="text-xs opacity-75">{message.fileName}</p>
                              )}
                            </div>
                            {message.content && (
                              <p className="text-sm">{replaceVariables(message.content)}</p>
                            )}
                          </div>
                        )}
                        
                        {message.type === 'link' && (
                          <div className="space-y-2">
                            <div className="bg-white/20 rounded p-2">
                              <Link className="h-4 w-4 mb-1" />
                              <p className="text-sm font-medium">
                                {message.linkPreview?.title || "Link"}
                              </p>
                              <p className="text-xs opacity-75">
                                {message.linkPreview?.domain || message.content}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {new Date().toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {sortedMessages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Nenhuma mensagem para preview</p>
                  <p className="text-sm">Adicione conteúdo na aba "Conteúdo"</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo da Sequência */}
      {isSequence && sortedMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo da Sequência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {sortedMessages.length}
                </div>
                <div className="text-sm text-muted-foreground">Mensagens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatDuration(totalDuration)}
                </div>
                <div className="text-sm text-muted-foreground">Duração</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {variables.length}
                </div>
                <div className="text-sm text-muted-foreground">Variáveis</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(sortedMessages.map(m => m.type)).size}
                </div>
                <div className="text-sm text-muted-foreground">Tipos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}