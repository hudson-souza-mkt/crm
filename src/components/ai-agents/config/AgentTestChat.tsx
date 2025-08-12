import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Bot,
  User,
  RotateCcw,
  Download,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIAgent, TestMessage } from "@/types/aiAgent";

interface AgentTestChatProps {
  agent: AIAgent;
}

export function AgentTestChat({ agent }: AgentTestChatProps) {
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  const simulateAgentResponse = (userMessage: string): string => {
    // Simulação simples de resposta baseada no tipo de agente
    const responses = {
      atendimento: [
        "Olá! Sou a Sofia, sua assistente virtual. Como posso ajudar você hoje?",
        "Entendi sua solicitação. Vou direcionar você para o setor adequado.",
        "Posso esclarecer essa dúvida para você. Nossa empresa oferece...",
        "Fico feliz em ajudar! Há mais alguma coisa que posso fazer por você?"
      ],
      qualificacao: [
        "Olá! Sou o Carlos, especialista em qualificação. Vou fazer algumas perguntas para entender melhor suas necessidades.",
        "Interessante! Para te ajudar melhor, qual é o tamanho da sua empresa?",
        "Entendo. E qual seria o budget disponível para essa solução?",
        "Perfeito! Com base no que você me contou, acredito que temos a solução ideal."
      ],
      vendas: [
        "Olá! Sou a Ana, consultora de vendas. Vou apresentar nossa solução para você.",
        "Nossa plataforma pode aumentar suas vendas em até 40%. Gostaria de saber mais?",
        "Temos três planos disponíveis. Qual se adequa melhor ao seu perfil?",
        "Posso preparar uma proposta personalizada para você. Quando podemos conversar?"
      ],
      followup: [
        "Olá! Estou entrando em contato para saber como está sua experiência.",
        "Vi que você demonstrou interesse em nossa solução. Posso esclarecer alguma dúvida?",
        "Gostaria de agendar uma demonstração personalizada?",
        "Estou aqui para ajudar no que precisar. Como posso auxiliar?"
      ],
      suporte: [
        "Olá! Sou do suporte técnico. Como posso ajudar você hoje?",
        "Vou verificar essa questão para você. Pode me dar mais detalhes?",
        "Encontrei a solução para seu problema. Vou te orientar passo a passo.",
        "Problema resolvido! Há mais alguma coisa que posso ajudar?"
      ]
    };

    const agentResponses = responses[agent.type] || responses.atendimento;
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: TestMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setConversationStarted(true);

    // Simular delay de resposta
    setTimeout(() => {
      const agentResponse: TestMessage = {
        id: `msg-${Date.now()}-agent`,
        role: "agent",
        content: simulateAgentResponse(inputMessage),
        timestamp: new Date(),
        confidence: Math.random() * 0.3 + 0.7, // 0.7 - 1.0
        responseTime: Math.random() * 2 + 1 // 1-3 segundos
      };

      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleReset = () => {
    setMessages([]);
    setConversationStarted(false);
    setInputMessage("");
    setIsTyping(false);
  };

  const handleExport = () => {
    const conversation = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.role === 'user' ? 'Usuário' : agent.name}: ${msg.content}`
    ).join('\n');
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teste-${agent.name}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Teste do Agente</h3>
        <p className="text-sm text-muted-foreground">
          Simule conversas com seu agente para testar e ajustar as configurações
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {agent.type === "atendimento" ? "🎧" :
                     agent.type === "qualificacao" ? "🎯" :
                     agent.type === "vendas" ? "💰" :
                     agent.type === "followup" ? "📞" : "🛠️"}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name || "Agente de Teste"}</CardTitle>
                    <CardDescription>Modo de teste ativo</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reiniciar
                  </Button>
                  {messages.length > 0 && (
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {!conversationStarted ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bot className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Pronto para testar!</p>
                    <p className="text-sm">
                      Digite uma mensagem abaixo para iniciar a conversa com o agente
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role === "agent" && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-3",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {(message.confidence * 100).toFixed(0)}% confiança
                              </Badge>
                            )}
                            {message.responseTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {message.responseTime.toFixed(1)}s
                              </span>
                            )}
                          </div>
                        </div>

                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Info & Controls */}
        <div className="space-y-4">
          {/* Agent Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do Teste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Agente</Label>
                <p className="font-medium">{agent.name || "Sem nome"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <p className="font-medium capitalize">{agent.type}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tom</Label>
                <p className="font-medium capitalize">{agent.tone}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Mensagens</Label>
                <p className="font-medium">{messages.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Testar Qualificação
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Testar Objeções
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Testar FAQ
              </Button>
            </CardContent>
          </Card>

          {/* Feedback */}
          {messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Feedback do Teste</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Bom
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Ruim
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}