import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Bot, 
  User, 
  RotateCw, 
  MessageSquare, 
  Clock, 
  MoreVertical, 
  RefreshCw,
  ChevronUp,
  ChevronDown,
  AlignJustify
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { AgentIntegration } from "./AgentIntegration";
import { processConversationForDataExtraction } from "@/lib/data-extraction";
import type { AIAgent } from "@/types/aiAgent";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    type: "agent" | "human" | "customer";
    avatar?: string;
  };
  status?: "sending" | "sent" | "seen" | "error";
  isTyping?: boolean;
}

interface AttendanceChatProps {
  attendanceId: string;
  customer: {
    id: string;
    name: string;
    avatar?: string;
    company?: string;
  };
  attendant: {
    id: string;
    name: string;
    avatar?: string;
  };
  previousMessages?: ChatMessage[];
}

export function AttendanceChat({ 
  attendanceId, 
  customer, 
  attendant,
  previousMessages = []
}: AttendanceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(previousMessages);
  const [newMessage, setNewMessage] = useState("");
  const [agentActive, setAgentActive] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AIAgent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Rolar para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Carregar mensagens anteriores ou enviar uma mensagem automática de boas-vindas
  useEffect(() => {
    if (messages.length === 0) {
      // Mensagem de boas-vindas do atendente
      const welcomeMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: `Olá ${customer.name}, bem-vindo(a) ao atendimento. Como posso ajudar você hoje?`,
        timestamp: new Date(),
        sender: {
          id: attendant.id,
          name: attendant.name,
          type: "human",
          avatar: attendant.avatar
        },
        status: "sent"
      };
      
      setMessages([welcomeMessage]);
    }
  }, []);

  // Enviar mensagem
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const content = newMessage.trim();
    setNewMessage("");
    
    // Definir quem está enviando a mensagem (atendente humano ou agente)
    const sender = agentActive && activeAgent
      ? {
          id: activeAgent.id,
          name: activeAgent.name,
          type: "agent" as const,
          avatar: activeAgent.avatar
        }
      : {
          id: attendant.id,
          name: attendant.name,
          type: "human" as const,
          avatar: attendant.avatar
        };
    
    // Mensagem a ser enviada
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      sender,
      status: "sending"
    };
    
    // Adicionar mensagem à lista
    setMessages(prev => [...prev, message]);
    
    // Simular envio da mensagem (em um sistema real, seria enviada a um backend)
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: "sent" } 
            : msg
        )
      );
      
      // Se o agente estiver ativo, gerar uma resposta automática
      if (agentActive && activeAgent) {
        simulateAgentResponse(content);
      } else {
        // Simular que o cliente está digitando uma resposta
        simulateCustomerTyping();
      }
    }, 500);
  };

  // Simular cliente digitando
  const simulateCustomerTyping = () => {
    const typingMessage: ChatMessage = {
      id: `typing-${Date.now()}`,
      content: "",
      timestamp: new Date(),
      sender: {
        id: customer.id,
        name: customer.name,
        type: "customer",
        avatar: customer.avatar
      },
      isTyping: true
    };
    
    setMessages(prev => [...prev, typingMessage]);
    
    // Após um tempo aleatório, substituir por uma mensagem real
    const typingTime = 1500 + Math.random() * 2000;
    
    setTimeout(() => {
      // Remover mensagem de digitação
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      
      // Adicionar resposta do cliente
      const customerResponses = [
        "Estou interessado no plano Professional. Quanto custa?",
        "Quais são os recursos incluídos no plano Enterprise?",
        "Vocês oferecem algum desconto para assinatura anual?",
        "Meu nome é João Silva e trabalho na empresa TechSolutions. Preciso de um CRM para nossa equipe de 10 pessoas.",
        "Estou com dificuldade para configurar a integração com o Gmail. Podem me ajudar?",
        "Qual é o prazo médio de implementação do sistema?",
        "Vocês têm alguma demonstração disponível para eu avaliar o sistema?",
        "O suporte técnico funciona 24/7?",
        "Quais métodos de pagamento vocês aceitam?",
        "Posso cancelar a assinatura a qualquer momento?"
      ];
      
      const randomResponse = customerResponses[Math.floor(Math.random() * customerResponses.length)];
      
      const customerMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: randomResponse,
        timestamp: new Date(),
        sender: {
          id: customer.id,
          name: customer.name,
          type: "customer",
          avatar: customer.avatar
        },
        status: "sent"
      };
      
      setMessages(prev => [...prev, customerMessage]);
      
      // Se o agente estiver ativo, gerar uma resposta automática
      if (agentActive && activeAgent) {
        simulateAgentResponse(randomResponse);
      }
      
      // Processar extração de dados da mensagem do cliente
      if (activeAgent?.dataExtractionConfig?.enabled) {
        processCustomerMessage(randomResponse);
      }
    }, typingTime);
  };

  // Simular resposta do agente
  const simulateAgentResponse = (customerMessage: string) => {
    if (!activeAgent) return;
    
    // Simular que o agente está digitando
    const typingMessage: ChatMessage = {
      id: `typing-agent-${Date.now()}`,
      content: "",
      timestamp: new Date(),
      sender: {
        id: activeAgent.id,
        name: activeAgent.name,
        type: "agent",
        avatar: activeAgent.avatar
      },
      isTyping: true
    };
    
    setMessages(prev => [...prev, typingMessage]);
    setIsLoading(true);
    
    // Após um tempo aleatório, substituir por uma mensagem real
    const typingTime = 1000 + Math.random() * 1500;
    
    setTimeout(() => {
      // Remover mensagem de digitação
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id));
      setIsLoading(false);
      
      // Gerar resposta do agente com base no tipo
      const agentResponse = generateAgentResponse(customerMessage, activeAgent);
      
      const agentMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: agentResponse,
        timestamp: new Date(),
        sender: {
          id: activeAgent.id,
          name: activeAgent.name,
          type: "agent",
          avatar: activeAgent.avatar
        },
        status: "sent"
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // 50% de chance do cliente responder novamente
      if (Math.random() > 0.5) {
        setTimeout(() => {
          simulateCustomerTyping();
        }, 2000 + Math.random() * 3000);
      }
    }, typingTime);
  };

  // Gerar resposta do agente com base no tipo
  const generateAgentResponse = (customerMessage: string, agent: AIAgent): string => {
    const messageContent = customerMessage.toLowerCase();
    
    // Usar variáveis extraídas, se disponíveis
    let nome = extractedData['nome'] || customer.name.split(' ')[0];
    let empresa = extractedData['empresa'] || customer.company || "sua empresa";
    
    // Respostas específicas para cada tipo de agente
    switch (agent.type) {
      case "atendimento":
        if (messageContent.includes("preço") || messageContent.includes("custa") || messageContent.includes("valor")) {
          return `Olá ${nome}, temos diferentes planos disponíveis. O plano Professional custa R$ 197/mês e inclui todos os recursos essenciais para a gestão de leads e oportunidades. Posso lhe enviar uma tabela completa com todos os planos?`;
        } else if (messageContent.includes("suporte") || messageContent.includes("ajuda")) {
          return `Claro ${nome}, nosso suporte técnico está disponível 24/7 para todos os planos. Você pode entrar em contato via chat, email ou telefone. Qual seria sua dúvida específica?`;
        } else if (messageContent.includes("demonstração") || messageContent.includes("demo")) {
          return `Com certeza ${nome}! Posso agendar uma demonstração personalizada para você. Qual seria o melhor dia e horário para realizarmos essa demonstração?`;
        } else {
          return `Obrigado por entrar em contato, ${nome}! Como posso ajudar você ou ${empresa} hoje? Estou aqui para esclarecer qualquer dúvida sobre nossos produtos e serviços.`;
        }
        
      case "qualificacao":
        if (messageContent.includes("empresa") || messageContent.includes("trabalho")) {
          return `Obrigado pela informação, ${nome}! Para entender melhor as necessidades da ${empresa}, poderia me dizer quantas pessoas compõem sua equipe de vendas e quais são os principais desafios que vocês enfrentam atualmente?`;
        } else if (messageContent.includes("interessado") || messageContent.includes("plano")) {
          return `Ótimo, ${nome}! O plano que você mencionou é uma excelente escolha. Para garantir que ele atenda completamente às necessidades da ${empresa}, poderia me contar um pouco sobre o volume mensal de leads que vocês gerenciam atualmente?`;
        } else {
          return `${nome}, para que eu possa recomendar a melhor solução para a ${empresa}, poderia me contar um pouco mais sobre:
1. Quantos colaboradores utilizariam o sistema?
2. Quais são os principais processos que você deseja automatizar?
3. Você já utiliza algum CRM atualmente?`;
        }
        
      case "vendas":
        if (messageContent.includes("desconto") || messageContent.includes("promoção")) {
          return `${nome}, temos uma condição especial para assinatura anual com 20% de desconto! Para a ${empresa}, isso representaria uma economia significativa. Posso preparar uma proposta detalhada com esses valores?`;
        } else if (messageContent.includes("prazo") || messageContent.includes("implementação")) {
          return `A implementação para uma equipe do tamanho da ${empresa} leva em média 2-3 semanas, ${nome}. Temos um time dedicado que acompanha todo o processo, desde a configuração inicial até o treinamento da sua equipe.`;
        } else {
          return `${nome}, com base no que você compartilhou, acredito que nosso plano Professional seria ideal para a ${empresa}. Ele oferece todas as funcionalidades que você mencionou, com um ROI médio de 40% já nos primeiros 3 meses de uso. Gostaria que eu enviasse uma proposta comercial detalhada?`;
        }
        
      case "suporte":
        return `Olá ${nome}! Entendi seu problema com a integração do Gmail. Vou te ajudar a resolver isso rapidamente. Primeiro, poderia verificar se você já habilitou a API do Gmail nas configurações de integrações? Caso já tenha feito isso, podemos agendar uma sessão rápida de suporte remoto para resolver.`;
        
      default:
        return `Olá ${nome}, obrigado por sua mensagem. Como posso ajudar você hoje?`;
    }
  };

  // Processar mensagem do cliente para extração de dados
  const processCustomerMessage = (message: string) => {
    if (!activeAgent?.dataExtractionConfig) return;
    
    // Usar a função de extração de dados
    const result = processConversationForDataExtraction(
      message,
      activeAgent.dataExtractionConfig,
      customer.id
    );
    
    // Se dados foram extraídos
    if (result.extractedData) {
      const newData: Record<string, string> = {};
      
      // Converter os dados extraídos para um formato mais simples
      Object.keys(result.extractedData).forEach(key => {
        newData[key] = result.extractedData![key].value;
      });
      
      // Atualizar os dados extraídos
      if (Object.keys(newData).length > 0) {
        setExtractedData(prev => ({ ...prev, ...newData }));
        
        // Mostrar notificação sobre dados extraídos
        const fields = Object.keys(newData).map(k => activeAgent.dataExtractionConfig?.fields.find(f => f.key === k)?.name || k);
        toast.success(`Dados extraídos: ${fields.join(', ')}`, {
          description: "Informações do cliente foram atualizadas automaticamente"
        });
        
        // Se há campos obrigatórios faltando, o agente pode perguntar por eles
        if (result.missingFields.length > 0) {
          // Implementação para o agente solicitar campos faltantes
          const missingField = result.missingFields[0];
          
          setTimeout(() => {
            if (agentActive && activeAgent) {
              // Criar uma mensagem do agente solicitando a informação
              const promptMessage: ChatMessage = {
                id: `msg-${Date.now()}`,
                content: missingField.defaultPrompt || `${customer.name}, poderia me informar seu ${missingField.name.toLowerCase()}? Isso nos ajudará a personalizar melhor seu atendimento.`,
                timestamp: new Date(),
                sender: {
                  id: activeAgent.id,
                  name: activeAgent.name,
                  type: "agent",
                  avatar: activeAgent.avatar
                },
                status: "sent"
              };
              
              setMessages(prev => [...prev, promptMessage]);
            }
          }, 1500);
        }
      }
    }
  };

  // Alternar agente
  const handleToggleAgent = (enabled: boolean, agentId?: string) => {
    setAgentActive(enabled);
    
    if (enabled && agentId) {
      // Em um sistema real, buscaríamos os dados do agente no backend
      import("@/hooks/useAIAgents").then(module => {
        const { agents } = module.useAIAgents();
        const agent = agents.find(a => a.id === agentId);
        
        if (agent) {
          setActiveAgent(agent);
          
          // Adicionar mensagem informando que o agente assumiu o atendimento
          const transferMessage: ChatMessage = {
            id: `transfer-${Date.now()}`,
            content: `O atendimento foi transferido para ${agent.name}, agente virtual de ${agent.type === "atendimento" ? "atendimento" : agent.type === "qualificacao" ? "qualificação" : agent.type === "vendas" ? "vendas" : "suporte"}.`,
            timestamp: new Date(),
            sender: {
              id: "system",
              name: "Sistema",
              type: "agent"
            },
            status: "sent"
          };
          
          setMessages(prev => [...prev, transferMessage]);
          
          // Agente envia mensagem de apresentação
          setTimeout(() => {
            const welcomeMessage: ChatMessage = {
              id: `msg-${Date.now()}`,
              content: `Olá ${customer.name}, sou ${agent.name}, ${agent.description}. Estou assumindo seu atendimento agora. Como posso ajudar?`,
              timestamp: new Date(),
              sender: {
                id: agent.id,
                name: agent.name,
                type: "agent",
                avatar: agent.avatar
              },
              status: "sent"
            };
            
            setMessages(prev => [...prev, welcomeMessage]);
          }, 1000);
        }
      });
    } else {
      // Transferir de volta para o humano
      const transferBackMessage: ChatMessage = {
        id: `transfer-back-${Date.now()}`,
        content: `O atendimento foi transferido de volta para ${attendant.name}.`,
        timestamp: new Date(),
        sender: {
          id: "system",
          name: "Sistema",
          type: "agent"
        },
        status: "sent"
      };
      
      setMessages(prev => [...prev, transferBackMessage]);
      
      // Atendente humano retoma
      setTimeout(() => {
        const resumeMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          content: `Olá ${customer.name}, sou ${attendant.name} novamente. Estou retomando seu atendimento. Como posso ajudar?`,
          timestamp: new Date(),
          sender: {
            id: attendant.id,
            name: attendant.name,
            type: "human",
            avatar: attendant.avatar
          },
          status: "sent"
        };
        
        setMessages(prev => [...prev, resumeMessage]);
      }, 1000);
    }
  };

  // Ouvir tecla Enter para enviar mensagem
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      {/* Chat principal */}
      <div className="md:col-span-3 flex flex-col h-full">
        <Card className="flex-1 flex flex-col h-full">
          <CardHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{customer.name}</CardTitle>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Atendimento iniciado às {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {agentActive && activeAgent && (
                  <Badge variant="secondary" className="gap-1">
                    <Bot className="h-3 w-3" />
                    <span>{activeAgent.name}</span>
                  </Badge>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Atualizar conversa
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowAgentPanel(!showAgentPanel)}
                    >
                      {showAgentPanel ? (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Ocultar painel do agente
                        </>
                      ) : (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Mostrar painel do agente
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AlignJustify className="h-4 w-4 mr-2" />
                      Ver histórico completo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.type === "customer"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {message.sender.id === "system" ? (
                  <div className="w-full flex justify-center">
                    <div className="bg-muted/50 text-muted-foreground text-xs py-1 px-3 rounded-full">
                      {message.content}
                    </div>
                  </div>
                ) : message.isTyping ? (
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8 mt-1">
                      {message.sender.avatar ? (
                        <AvatarImage src={message.sender.avatar} />
                      ) : (
                        <AvatarFallback>
                          {message.sender.type === "customer" 
                            ? customer.name.charAt(0)
                            : message.sender.type === "agent"
                              ? <Bot className="h-4 w-4" />
                              : <User className="h-4 w-4" />
                          }
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-100"></div>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      message.sender.type === "customer" ? "" : "flex-row-reverse"
                    }`}
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      {message.sender.avatar ? (
                        <AvatarImage src={message.sender.avatar} />
                      ) : (
                        <AvatarFallback>
                          {message.sender.type === "customer" 
                            ? customer.name.charAt(0)
                            : message.sender.type === "agent"
                              ? <Bot className="h-4 w-4" />
                              : <User className="h-4 w-4" />
                          }
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender.type === "customer"
                          ? "bg-muted"
                          : message.sender.type === "agent"
                            ? "bg-purple-100 text-purple-900"
                            : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="text-sm">
                        <div className="font-medium mb-1">
                          {message.sender.name}
                          {message.sender.type === "agent" && (
                            <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">
                              Bot
                            </Badge>
                          )}
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender.type === "customer"
                            ? "text-muted-foreground"
                            : message.sender.type === "agent"
                              ? "text-purple-600"
                              : "text-primary-foreground/70"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <div className="flex w-full gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  agentActive
                    ? "Digite sua mensagem como agente..."
                    : "Digite sua mensagem..."
                }
                className="min-h-10 resize-none"
                rows={1}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={sendMessage} 
                      disabled={isLoading || !newMessage.trim()}
                      size="icon"
                    >
                      {isLoading ? (
                        <RotateCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Enviar mensagem
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Painel lateral */}
      <div className={`${showAgentPanel ? 'block' : 'hidden md:block'} md:col-span-1 space-y-4`}>
        <AgentIntegration
          attendanceId={attendanceId}
          customerId={customer.id}
          attendantId={attendant.id}
          isActive={agentActive}
          onToggleAgent={handleToggleAgent}
        />
        
        {/* Painel de dados extraídos */}
        {Object.keys(extractedData).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4" />
                Dados Extraídos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center border-b pb-1 last:border-0">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Outros painéis podem ser adicionados aqui */}
      </div>
    </div>
  );
}