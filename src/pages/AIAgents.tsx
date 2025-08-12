import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bot,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Settings,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  Star
} from "lucide-react";
import { AgentCard } from "@/components/ai-agents/AgentCard";
import { AgentConfigDialog } from "@/components/ai-agents/AgentConfigDialog";
import { AgentTemplatesDialog } from "@/components/ai-agents/AgentTemplatesDialog";
import { useAIAgents } from "@/hooks/useAIAgents";
import type { AIAgent, AgentType, AgentStatus } from "@/types/aiAgent";

export default function AIAgents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<AgentType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<AgentStatus | "all">("all");
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  const {
    agents,
    createAgent,
    updateAgent,
    deleteAgent,
    duplicateAgent,
    toggleAgentStatus
  } = useAIAgents();

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || agent.type === filterType;
    const matchesStatus = filterStatus === "all" || agent.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateAgent = () => {
    setSelectedAgent(null);
    setConfigDialogOpen(true);
  };

  const handleEditAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setConfigDialogOpen(true);
  };

  const handleSaveAgent = (agentData: Partial<AIAgent>) => {
    if (selectedAgent) {
      updateAgent(selectedAgent.id, agentData);
    } else {
      createAgent(agentData);
    }
  };

  const getTypeLabel = (type: AgentType) => {
    const labels = {
      atendimento: "Atendimento",
      qualificacao: "Qualificação",
      vendas: "Vendas",
      followup: "Follow-up",
      suporte: "Suporte"
    };
    return labels[type];
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-700";
      case "inativo": return "bg-gray-100 text-gray-700";
      case "treinamento": return "bg-blue-100 text-blue-700";
      case "manutencao": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: AgentStatus) => {
    const labels = {
      ativo: "Ativo",
      inativo: "Inativo",
      treinamento: "Treinamento",
      manutencao: "Manutenção"
    };
    return labels[status];
  };

  // Estatísticas gerais
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === "ativo").length;
  const totalConversations = agents.reduce((sum, a) => sum + a.metrics.totalConversations, 0);
  const avgConversionRate = agents.length > 0 
    ? agents.reduce((sum, a) => sum + a.metrics.conversionRate, 0) / agents.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agentes de IA</h1>
          <p className="text-muted-foreground">
            Crie e configure agentes inteligentes para automatizar atendimento, qualificação e vendas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTemplatesDialogOpen(true)}>
            <Star className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={handleCreateAgent}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agente
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Agentes</p>
                <p className="text-2xl font-bold">{totalAgents}</p>
              </div>
              <Bot className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agentes Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeAgents}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversas Totais</p>
                <p className="text-2xl font-bold">{totalConversations.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar agentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filterType} onValueChange={(value: AgentType | "all") => setFilterType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="atendimento">Atendimento</SelectItem>
            <SelectItem value="qualificacao">Qualificação</SelectItem>
            <SelectItem value="vendas">Vendas</SelectItem>
            <SelectItem value="followup">Follow-up</SelectItem>
            <SelectItem value="suporte">Suporte</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={(value: AgentStatus | "all") => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="treinamento">Treinamento</SelectItem>
            <SelectItem value="manutencao">Manutenção</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de agentes */}
      {filteredAgents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum agente encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterType !== "all" || filterStatus !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Comece criando seu primeiro agente de IA"}
            </p>
            {!searchTerm && filterType === "all" && filterStatus === "all" && (
              <Button onClick={handleCreateAgent}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Agente
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={() => handleEditAgent(agent)}
              onDuplicate={() => duplicateAgent(agent.id)}
              onDelete={() => deleteAgent(agent.id)}
              onToggleStatus={() => toggleAgentStatus(agent.id)}
              getTypeLabel={getTypeLabel}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AgentConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        agent={selectedAgent}
        onSave={handleSaveAgent}
      />

      <AgentTemplatesDialog
        open={templatesDialogOpen}
        onOpenChange={setTemplatesDialogOpen}
        onSelectTemplate={(template) => {
          setSelectedAgent(null);
          setConfigDialogOpen(true);
          // TODO: Pre-fill form with template data
        }}
      />
    </div>
  );
}