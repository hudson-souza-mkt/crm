import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, User, RotateCw, ArrowRight } from "lucide-react";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { useAgentPipeline } from '@/hooks/useAgentPipeline';
import type { AIAgent, ConversationStep } from '@/types/aiAgent';

interface AgentChatProps {
  agent: AIAgent;
  leadId?: string; // ID do lead/negócio associado à conversa
}

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export function AgentChat({ agent, leadId }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConversationStep | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef<string>(`conv-${Date.now()}`);
  
  // Usar o hook de pipeline
  const { executeStepAction, pipelineEnabled } = useAgentPipeline(agent);

  // Inicializar com a primeira etapa do fluxo, se existir
  useEffect(() => {
    if (agent.conversationFlow && agent.conversationFlow.length > 0) {
      const sortedSteps = [...agent.conversationFlow].sort((a, b) => a.order - b.order);
      setCurrentStep(sortedSteps[0]);
    }
  }, [agent]);

  // Adicionar mensagem de boas-vindas do agente
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: `welcome-${Date.now()}`,
        role: 'agent' as const,
        content: `Olá! Sou ${agent.name}, um assistente virtual da ${agent.companyInfo.name}. Como posso ajudar você hoje?`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    }
  }, [agent, messages.length]);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simular resposta do agente
    setTimeout(async () => {
      let responseContent = "Estou processando sua mensagem...";
      
      // Usar o conteúdo da etapa atual, se disponível
      if (currentStep) {
        responseContent = `[Etapa: ${currentStep.name}] ${currentStep.instructions}`;
        
        // Se temos um lead ID e integração com pipeline, executar a ação configurada
        if (leadId && pipelineEnabled && currentStep.pipelineAction) {
          try {
            const actionResult = await executeStepAction(
              leadId, 
              currentStep,
              conversationId.current
            );
            
            if (actionResult.success) {
              responseContent += `\n\n✅ ${actionResult.message || 'Ação executada com sucesso'}`;
            } else if (actionResult.error) {
              responseContent += `\n\n❌ ${actionResult.error}`;
            }
          } catch (error) {
            console.error("Erro ao executar ação do pipeline:", error);
          }
        }
      } else {
        responseContent = "Obrigado por sua mensagem! Como posso ajudar?";
      }
      
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setLoading(false);
    }, 1000);
  };

  // Avançar para o próximo passo do fluxo
  const handleAdvanceStep = () => {
    if (!currentStep || !agent.conversationFlow) return;
    
    const sortedSteps = [...agent.conversationFlow].sort((a, b) => a.order - b.order);
    const currentIndex = sortedSteps.findIndex(step => step.id === currentStep.id);
    
    if (currentIndex < sortedSteps.length - 1) {
      const nextStep = sortedSteps[currentIndex + 1];
      setCurrentStep(nextStep);
      
      // Notificar o usuário sobre a mudança de etapa
      toast.info(`Avançando para: ${nextStep.name}`);
      
      // Adicionar mensagem informativa sobre a mudança
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        role: 'agent',
        content: `[Sistema] Avançando para a etapa "${nextStep.name}"`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
    } else {
      toast.success("Fluxo de conversa concluído!");
      setCurrentStep(null);
    }
  };
  
  // Lidar com tecla Enter para enviar mensagem
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={agent.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-base">{agent.name}</CardTitle>
          </div>
          
          {/* Informação da etapa atual */}
          {currentStep && (
            <Badge variant="outline" className="flex items-center gap-1">
              <span>Etapa:</span>
              <span className="font-medium">{currentStep.name}</span>
            </Badge>
          )}
        </div>
        
        {/* Informações de pipeline, se disponível */}
        {pipelineEnabled && leadId && (
          <div className="flex justify-end mt-2">
            <Badge variant="secondary" className="text-xs">
              Pipeline integrado
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col h-full p-0">
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start gap-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8 mt-0.5">
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </Avatar>
                
                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Indicador de "digitando" */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8 mt-0.5">
                  <Bot className="h-4 w-4" />
                </Avatar>
                <div className="rounded-lg p-3 bg-muted">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-100"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Área de controle de fluxo (quando aplicável) */}
        {currentStep && (
          <div className="border-t p-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{currentStep.name}</span>
                <span className="mx-1">•</span>
                <span>
                  {currentStep.completionCondition === 'automatic' 
                    ? 'Avanço automático' 
                    : currentStep.completionCondition === 'conditional'
                      ? 'Avanço condicional'
                      : 'Avanço manual'}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAdvanceStep}
                className="gap-1"
              >
                Próximo passo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Área de entrada de mensagem */}
        <div className="border-t p-3">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="min-h-10 resize-none"
              rows={1}
            />
            <Button 
              variant="default" 
              size="icon" 
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}