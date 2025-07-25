import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DollarSign, Users, Activity, TrendingUp, Target, MessageCircle, Calendar } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const salesData = [
  { name: 'Jan', valor: 32000 },
  { name: 'Fev', valor: 28000 },
  { name: 'Mar', valor: 41000 },
  { name: 'Abr', valor: 38000 },
  { name: 'Mai', valor: 45000 },
  { name: 'Jun', valor: 52000 },
];

const statusData = [
  { name: 'Por concluir', value: 9, color: '#818cf8' },
  { name: 'Concluídas', value: 12, color: '#10b981' },
  { name: 'Atrasadas', value: 2, color: '#f87171' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Tabs defaultValue="dia">
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="dia" className="text-xs px-3">Hoje</TabsTrigger>
              <TabsTrigger value="semana" className="text-xs px-3">Semana</TabsTrigger>
              <TabsTrigger value="mes" className="text-xs px-3">Mês</TabsTrigger>
              <TabsTrigger value="ano" className="text-xs px-3">Ano</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">R$ 387.500</span>
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+23,5%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">86%</span>
              </div>
              <Progress value={86} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos Leads</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">1.247</span>
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+18,2%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">83%</span>
              </div>
              <Progress value={83} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">12,5%</span>
              <div className="flex items-center text-red-500 text-sm">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                <span>-2,1%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">65%</span>
              </div>
              <Progress value={65} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">R$ 2.850</span>
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+8,7%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Resumo visual de tarefas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="corporate-card col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas concluídas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            <div className="text-4xl font-bold">12</div>
            <div className="text-xs text-muted-foreground mt-1">de 23 tarefas</div>
          </CardContent>
        </Card>
        
        <Card className="corporate-card col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas pendentes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            <div className="text-4xl font-bold">9</div>
            <div className="text-xs text-muted-foreground mt-1">1 filtro ativo</div>
          </CardContent>
        </Card>
        
        <Card className="corporate-card col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas atrasadas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            <div className="text-4xl font-bold text-red-500">2</div>
            <div className="text-xs text-muted-foreground mt-1">1 filtro ativo</div>
          </CardContent>
        </Card>
        
        <Card className="corporate-card col-span-1">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de tarefas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            <div className="text-4xl font-bold">23</div>
            <div className="text-xs text-muted-foreground mt-1">sem filtros</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="corporate-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendas por mês</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `R$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`R$${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.25rem',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <Bar 
                    dataKey="valor" 
                    fill="#818cf8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="corporate-card">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas por status</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="70%" height="70%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Tarefas']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.25rem',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Seção adicional - Tarefas por seção */}
      <Card className="corporate-card">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas por seção</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical" 
                data={[
                  { name: 'A fazer', valor: 2 },
                  { name: 'Em execução', valor: 6 },
                  { name: 'Feito', valor: 1 }
                ]} 
                margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Tarefas']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.25rem',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Bar 
                  dataKey="valor" 
                  fill="#818cf8"
                  radius={[0, 4, 4, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}