import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  Users, 
  Calendar,
  Target,
  Zap
} from "lucide-react";
import type { PlaybookStats } from "@/types/playbook";

interface PlaybookStatsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: PlaybookStats;
}

export function PlaybookStats({ open, onOpenChange, stats }: PlaybookStatsProps) {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics do Playbook
          </DialogTitle>
          <DialogDescription>
            Estatísticas detalhadas de uso das respostas rápidas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Respostas</p>
                    <p className="text-2xl font-bold">{stats.totalResponses}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Usos</p>
                    <p className="text-2xl font-bold">{stats.totalUsage.toLocaleString()}</p>
                    <p className="text-xs text-green-600">↗ +23% este mês</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Média de Uso</p>
                    <p className="text-2xl font-bold">
                      {stats.totalResponses > 0 ? Math.round(stats.totalUsage / stats.totalResponses) : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">por resposta</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold">
                      {stats.topResponses.length > 0 
                        ? (stats.topResponses.reduce((sum, r) => sum + r.successRate, 0) / stats.topResponses.length).toFixed(1)
                        : 0
                      }%
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
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
                  Evolução do uso das respostas ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.usageTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                      formatter={(value) => [`${value} usos`, 'Quantidade']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Uso por Pasta */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Pasta</CardTitle>
                <CardDescription>
                  Uso das respostas organizadas por pasta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.usageByFolder}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {stats.usageByFolder.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} usos`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-2 mt-4">
                  {stats.usageByFolder.map((folder, index) => (
                    <div key={folder.folderId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{folder.folderName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{folder.count}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({folder.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Respostas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Respostas Mais Utilizadas
              </CardTitle>
              <CardDescription>
                Ranking das respostas com melhor performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topResponses.map((response, index) => (
                  <div key={response.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold">{response.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {response.usageCount} usos
                        </span>
                        <Badge 
                          variant={response.successRate >= 80 ? "default" : 
                                  response.successRate >= 60 ? "secondary" : "destructive"}
                        >
                          {response.successRate.toFixed(1)}% sucesso
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {response.usageCount}
                      </div>
                      <div className="text-xs text-muted-foreground">usos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Uso por Canal */}
          <Card>
            <CardHeader>
              <CardTitle>Uso por Canal de Comunicação</CardTitle>
              <CardDescription>
                Distribuição do uso entre diferentes canais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.usageByChannel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="channel" 
                    tickFormatter={(channel) => {
                      const labels: Record<string, string> = {
                        'whatsapp': 'WhatsApp',
                        'email': 'Email',
                        'webchat': 'Web Chat',
                        'telegram': 'Telegram'
                      };
                      return labels[channel] || channel;
                    }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} usos`, 'Quantidade']}
                  />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Insights e Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Insights e Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Oportunidade</h4>
                  <p className="text-sm text-blue-700">
                    A pasta "Qualificação" tem 31.3% do uso total. Considere criar mais 
                    respostas para esta categoria.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Destaque</h4>
                  <p className="text-sm text-green-700">
                    WhatsApp representa 54.2% do uso. Suas respostas estão bem 
                    otimizadas para este canal.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Atenção</h4>
                  <p className="text-sm text-yellow-700">
                    A pasta "Fechamento" tem apenas 7.9% do uso. Revise se as 
                    respostas estão adequadas.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">🚀 Crescimento</h4>
                  <p className="text-sm text-purple-700">
                    Uso cresceu 23% este mês. Continue expandindo o playbook 
                    com novas respostas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}