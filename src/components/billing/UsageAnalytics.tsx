import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { TrendingUp, Zap, MessageSquare, Bot, Calendar } from "lucide-react";
import type { UsageStats } from "@/types/billing";

interface UsageAnalyticsProps {
  usageStats: UsageStats;
}

export function UsageAnalytics({ usageStats }: UsageAnalyticsProps) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analytics de Uso Detalhado</h2>
        <p className="text-muted-foreground">
          Análise completa do consumo de tokens e custos por período
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Tokens</p>
                <p className="text-2xl font-bold">{usageStats.totalTokens.toLocaleString()}</p>
                <p className="text-xs text-green-600">↗ +15% vs período anterior</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Custo Total</p>
                <p className="text-2xl font-bold">R$ {usageStats.totalCost.toFixed(2)}</p>
                <p className="text-xs text-green-600">↗ +12% vs período anterior</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversas</p>
                <p className="text-2xl font-bold">
                  {usageStats.byAgent.reduce((sum, agent) => sum + agent.conversations, 0)}
                </p>
                <p className="text-xs text-blue-600">Este período</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agentes Ativos</p>
                <p className="text-2xl font-bold">{usageStats.byAgent.length}</p>
                <p className="text-xs text-orange-600">Agentes em uso</p>
              </div>
              <Bot className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Uso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendência de Uso
            </CardTitle>
            <CardDescription>
              Evolução do consumo de tokens ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageStats.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                  formatter={(value, name) => [
                    name === 'tokens' ? `${value} tokens` : `R$ ${value}`,
                    name === 'tokens' ? 'Tokens' : 'Custo'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Uso por Agente */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Agente</CardTitle>
            <CardDescription>
              Consumo de tokens por agente de IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usageStats.byAgent}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="tokens"
                >
                  {usageStats.byAgent.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tokens`, 'Consumo']} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-4">
              {usageStats.byAgent.map((agent, index) => (
                <div key={agent.agentId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{agent.agentName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{agent.tokens.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({agent.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uso por Operação */}
      <Card>
        <CardHeader>
          <CardTitle>Uso por Tipo de Operação</CardTitle>
          <CardDescription>
            Breakdown detalhado do consumo por tipo de atividade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageStats.byOperation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="operation" 
                tickFormatter={(op) => {
                  const labels: Record<string, string> = {
                    'message_sent': 'Mensagens Enviadas',
                    'message_received': 'Mensagens Recebidas',
                    'knowledge_query': 'Consultas FAQ',
                    'conversation_time': 'Tempo de Conversa'
                  };
                  return labels[op] || op;
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'tokens' ? `${value} tokens` : `${value} operações`,
                  name === 'tokens' ? 'Tokens' : 'Quantidade'
                ]}
              />
              <Bar dataKey="tokens" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Uso por Canal */}
      <Card>
        <CardHeader>
          <CardTitle>Uso por Canal de Comunicação</CardTitle>
          <CardDescription>
            Distribuição do consumo entre diferentes canais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageStats.byChannel.map((channel, index) => (
              <div key={channel.channel} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {channel.channel}
                    </Badge>
                    <span className="text-sm font-medium">
                      {channel.tokens.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">R$ {channel.cost.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({channel.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <Progress value={channel.percentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{channel.messages} mensagens</span>
                  <span>{channel.percentage.toFixed(1)}% do total</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes por Agente */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Detalhada por Agente</CardTitle>
          <CardDescription>
            Métricas individuais de cada agente de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageStats.byAgent.map((agent, index) => (
              <div key={agent.agentId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <h4 className="font-semibold">{agent.agentName}</h4>
                  </div>
                  <Badge variant="secondary">
                    {agent.percentage.toFixed(1)}% do uso total
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {agent.tokens.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Tokens</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      R$ {agent.cost.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Custo</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {agent.conversations}
                    </div>
                    <div className="text-xs text-muted-foreground">Conversas</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">
                      {agent.conversations > 0 ? (agent.tokens / agent.conversations).toFixed(0) : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Tokens/Conversa</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}