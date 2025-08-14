import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bot, User, AlertCircle, CheckCircle2, Zap, RotateCw, GitCommitHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAIAgents } from "@/hooks/useAIAgents";
import type { AIAgent, AgentType } from "@/types/aiAgent";

interface AgentIntegrationProps {
  attendanceId: string;
  customerId: string;
  attendantId: string;
  isActive: boolean;
  onToggleAgent: (enabled: boolean, agentId?: string) => void;
}

export function AgentIntegration({ 
  attendanceId, 
  customerId,
  attendantId,
  isActive, 
  onToggleAgent 
}: AgentIntegrationProps) {
  const { agents } = useAIAgents();
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [agentEnabled, setAgentEnabled] = useState<boolean>(isActive);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [agentsByType, setAgentsByType] = useState<Record<AgentType, AIAgent[]>>({} as Record<AgentType, AIAgent[]>);

  // Organizar agentes por tipo
  useEffect(() => {
    const activeAgents = agents.filter(agent => agent.status === "ativo");
    const grouped = activeAgents.reduce((acc, agent) => {
      if (!acc[agent.type]) {
        acc[agent.type] = [];
      }
      acc[agent.type].push(agent);
      return acc;
    }, {} as Record<AgentType, AIAgent[]>);
    
    setAgentsByType(grouped);
    
    // Selecionar automaticamente o primeiro agente de atendimento, se disponível
    if (activeAgents.length > 0 && !selectedAgentId) {
      const defaultAgent = activeAgents.find(a => a.type === "atendimento") || activeAgents[0];
      setSelectedAgentId(defaultAgent.id);
    }
  }, [agents, selectedAgentId]);

  // Atualizar estado local quando isActive muda externamente
  useEffect(() => {
    setAgentEnabled(isActive);
  }, [isActive]);

  // Ativar ou desativar o agente
  const handleToggleAgent = (enabled: boolean) => {
    if (enabled && !selectedAgentId) {
      toast.error("Selecione um agente antes de ativar");
      return;
    }
    
    setAgentEnabled(enabled);
    
    if (enabled) {
      setIsTransferring(true);
      
      // Simular um pequeno atraso na transferência
      setTimeout(() => {
        onToggleAgent(enabled, selectedAgentId);
        setIsTransferring(false);
        toast.success(`Atendimento transferido para ${selectedAgent?.name}`);
      }, 1500);
    } else {
      onToggleAgent(false);
      toast.info("Atendimento retornado para o humano");
    }
  };

  // Alterar o agente selecionado
  const handleChangeAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    
    // Se o agente já estiver ativo, atualize-o
    if (agentEnabled) {
      setIsTransferring(true);
      
      // Simular um pequeno atraso na transferência
      setTimeout(() => {
        onToggleAgent(true, agentId);
        setIsTransferring(false);
        const newAgent = agents.find(a => a.id === agentId);
        toast.success(`Atendimento transferido para ${newAgent?.name}`);
      }, 1500);
    }
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  
  // Verificar se há agentes disponíveis
  const hasAgents = Object.values(agentsByType).some(group => group.length > 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Integração com Agentes de IA
        </CardTitle>
        <CardDescription>
          Ative o agente para automatizar o atendimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAgents ? (
          <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-medium">Nenhum agente disponível</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crie e ative agentes para utilizar neste atendimento.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Seleção de agente */}
            <div className="space-y-2">
              <Label htmlFor="agent-select">Selecione um agente</Label>
              <Select 
                value={selectedAgentId} 
                onValueChange={handleChangeAgent}
                disabled={isTransferring}
              >
                <SelectTrigger id="agent-select">
                  <SelectValue placeholder="Selecione um agente" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(agentsByType).map(([type, typeAgents]) => (
                    <div key={type}>
                      <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                        {type === "atendimento" && "Atendimento"}
                        {type === "qualificacao" && "Qualificação"}
                        {type === "vendas" && "Vendas"}
                        {type === "followup" && "Follow-up"}
                        {type === "suporte" && "Suporte"}
                        {type === "consultor" && "Consultoria"}
                      </div>
                      {typeAgents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          <div className="flex items-center gap-2">
                            <span>{agent.name}</span>
                            {agent.metrics && agent.metrics.satisfactionScore > 4.5 && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                {agent.metrics.satisfactionScore.toFixed(1)}★
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                      <Separator className="my-1" />
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Detalhes do agente selecionado */}
            {selectedAgent && (
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex gap-3 items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedAgent.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="font-medium">{selectedAgent.name}</div>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="px-1 h-5">
                        {selectedAgent.type === "atendimento" && "Atendimento"}
                        {selectedAgent.type === "qualificacao" && "Qualificação"}
                        {selectedAgent.type === "vendas" && "Vendas"}
                        {selectedAgent.type === "followup" && "Follow-up"}
                        {selectedAgent.type === "suporte" && "Suporte"}
                        {selectedAgent.type === "consultor" && "Consultoria"}
                      </Badge>
                      <span>•</span>
                      <span>{selectedAgent.metrics?.totalConversations} conversas</span>
                      {selectedAgent.metrics?.satisfactionScore > 0 && (
                        <>
                          <span>•</span>
                          <span>{selectedAgent.metrics.satisfactionScore.toFixed(1)}★</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {selectedAgent.description || selectedAgent.objective}
                </div>
              </div>
            )}

            {/* Ativar/desativar agente */}
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label htmlFor="activate-agent" className="font-medium">
                  {agentEnabled ? "Agente ativado" : "Ativar agente"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {agentEnabled 
                    ? "O agente está respondendo automaticamente" 
                    : "Transferir atendimento para o agente selecionado"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isTransferring && (
                  <RotateCw className="h-4 w-4 animate-spin text-amber-500" />
                )}
                <Switch 
                  id="activate-agent" 
                  checked={agentEnabled} 
                  onCheckedChange={handleToggleAgent}
                  disabled={isTransferring || !selectedAgentId}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-4">
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Atendente</span>
            </div>
            {agentEnabled ? (
              <Badge variant="outline" className="gap-1 bg-red-50 text-red-600">
                Inativo
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 bg-green-50 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Ativo
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between w-full text-sm">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-500" />
              <span className="text-muted-foreground">Agente de IA</span>
            </div>
            {agentEnabled ? (
              <Badge variant="secondary" className="gap-1 bg-green-50 text-green-600">
                <CheckCircle2 className="h-3 w-3" />
                Ativo
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 bg-red-50 text-red-600">
                Inativo
              </Badge>
            )}
          </div>

          {isTransferring && (
            <div className="flex items-center gap-2 text-xs text-amber-600 mt-2 p-1 bg-amber-50 rounded justify-center">
              <GitCommitHorizontal className="h-3.5 w-3.5" />
              <span>Transferindo atendimento...</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}