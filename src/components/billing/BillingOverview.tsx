import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { TrendingUp, Zap, AlertTriangle, Calendar, Plus } from "lucide-react";
import type { CreditBalance, UsageStats } from "@/types/billing";

interface BillingOverviewProps {
  balance: CreditBalance;
  usageStats: UsageStats;
}

export function BillingOverview({ balance, usageStats }: BillingOverviewProps) {
  const usagePercentage = (balance.usedCredits / balance.totalCredits) * 100;
  const daysUntilRenewal = Math.ceil((balance.renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna Principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Gráfico de Tendência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendência de Uso (Últimos 7 dias)
            </CardTitle>
            <CardDescription>
              Acompanhe o consumo diário de tokens e custos
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
                <YAxis yAxisId="tokens" orientation="left" />
                <YAxis yAxisId="cost" orientation="right" />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                  formatter={(value, name) => [
                    name === 'tokens' ? `${value} tokens` : `R$ ${value}`,
                    name === 'tokens' ? 'Tokens' : 'Custo'
                  ]}
                />
                <Line 
                  yAxisId="tokens"
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
                <Line 
                  yAxisId="cost"
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Uso por Operação */}
        <Card>
          <CardHeader>
            <CardTitle>Uso por Tipo de Operação</CardTitle>
            <CardDescription>
              Distribuição do consumo por tipo de atividade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={usageStats.byOperation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="operation" 
                  tickFormatter={(op) => {
                    const labels: Record<string, string> = {
                      'message_sent': 'Mensagens',
                      'message_received': 'Recebidas',
                      'knowledge_query': 'Consultas',
                      'conversation_time': 'Tempo'
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
      </div>

      {/* Coluna Lateral */}
      <div className="space-y-6">
        {/* Status do Plano */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Status dos Créditos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Usado</span>
                <span>{balance.usedCredits.toLocaleString()} / {balance.totalCredits.toLocaleString()}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {usagePercentage.toFixed(1)}% utilizado
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {balance.remainingCredits.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Restantes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {daysUntilRenewal}
                </p>
                <p className="text-xs text-muted-foreground">Dias p/ renovar</p>
              </div>
            </div>

            {usagePercentage > 80 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Saldo baixo!</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Considere recarregar seus créditos
                </p>
              </div>
            )}

            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Recarregar Créditos
            </Button>
          </CardContent>
        </Card>

        {/* Uso por Agente */}
        <Card>
          <CardHeader>
            <CardTitle>Uso por Agente</CardTitle>
            <CardDescription>
              Distribuição do consumo entre agentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={usageStats.byAgent}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
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
                <div key={agent.agentId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate">{agent.agentName}</span>
                  </div>
                  <span className="font-medium">{agent.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próxima Renovação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próxima Renovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold">
                {balance.renewalDate.toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-muted-foreground">
                Em {daysUntilRenewal} dias
              </p>
              <Badge variant={balance.autoRecharge ? "default" : "secondary"}>
                {balance.autoRecharge ? "Auto-renovação ativa" : "Renovação manual"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}