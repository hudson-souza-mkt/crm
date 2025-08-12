import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bot,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIAgent, AgentType, AgentStatus } from "@/types/aiAgent";

interface AgentCardProps {
  agent: AIAgent;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  getTypeLabel: (type: AgentType) => string;
  getStatusColor: (status: AgentStatus) => string;
  getStatusLabel: (status: AgentStatus) => string;
}

export function AgentCard({
  agent,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  getTypeLabel,
  getStatusColor,
  getStatusLabel
}: AgentCardProps) {
  const getTypeIcon = (type: AgentType) => {
    switch (type) {
      case "atendimento": return "🎧";
      case "qualificacao": return "🎯";
      case "vendas": return "💰";
      case "followup": return "📞";
      case "suporte": return "🛠️";
      default: return "🤖";
    }
  };

  const getTypeColor = (type: AgentType) => {
    switch (type) {
      case "atendimento": return "bg-blue-100 text-blue-700";
      case "qualificacao": return "bg-purple-100 text-purple-700";
      case "vendas": return "bg-green-100 text-green-700";
      case "followup": return "bg-orange-100 text-orange-700";
      case "suporte": return "bg-cyan-100 text-cyan-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getTypeIcon(agent.type)}</div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate">{agent.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", getTypeColor(agent.type))}>
                  {getTypeLabel(agent.type)}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", getStatusColor(agent.status))}>
                  {getStatusLabel(agent.status)}
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleStatus}>
                {agent.status === "ativo" ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Desativar
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Ativar
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardDescription className="line-clamp-2 mt-2">
          {agent.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{agent.metrics.totalConversations}</div>
            <div className="text-xs text-muted-foreground">Conversas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{agent.metrics.conversionRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Conversão</div>
          </div>
        </div>
        
        {/* Métricas secundárias */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Tempo médio</span>
            </div>
            <span className="font-medium">{agent.metrics.averageResponseTime.toFixed(1)}s</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3 w-3" />
              <span>Satisfação</span>
            </div>
            <span className="font-medium">{agent.metrics.satisfactionScore.toFixed(1)}/5</span>
          </div>
        </div>
        
        {/* Integrações ativas */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-xs text-muted-foreground">Canais:</span>
          {agent.integrations.whatsapp && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">WhatsApp</span>}
          {agent.integrations.email && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Email</span>}
          {agent.integrations.webchat && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Web</span>}
          {agent.integrations.telegram && <span className="text-xs bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded">Telegram</span>}
        </div>
        
        {/* Tags */}
        {agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {agent.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {agent.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{agent.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Ações */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Settings className="h-3 w-3 mr-1" />
            Configurar
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="h-3 w-3 mr-1" />
            Testar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}