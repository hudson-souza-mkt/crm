import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonutChart, BarChart } from "@tremor/react";
import { 
  Users, UserCheck, UserMinus, Gem, Medal, Trophy, 
  CircleDollarSign, Calendar, BarChart2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const valueFormatter = (number: number) => {
  return new Intl.NumberFormat('pt-BR').format(number);
};

// Dados de segmentação para o gráfico de donuts
const abcDistribution = [
  { name: "Clientes A", value: 48, color: "amber" },
  { name: "Clientes B", value: 136, color: "slate" },
  { name: "Clientes C", value: 863, color: "indigo" }
];

const clientStatusDistribution = [
  { name: "Ativos", value: 657, color: "emerald" },
  { name: "Inativos", value: 390, color: "rose" }
];

const customerTypeDistribution = [
  { name: "Leads", value: 1298, color: "blue" },
  { name: "Clientes", value: 1047, color: "emerald" }
];

// Dados para gráfico de barras
const revenueBySegment = [
  { segmento: "Clientes A (4%)", valor: 387500 },
  { segmento: "Clientes B (13%)", valor: 108500 },
  { segmento: "Clientes C (83%)", valor: 41000 }
];

const lifeCycleDistribution = [
  { estagio: "Novos Leads", valor: 847 },
  { estagio: "Leads Qualificados", valor: 451 },
  { estagio: "Primeiro Contato", valor: 324 },
  { estagio: "Clientes Recentes", valor: 246 },
  { estagio: "Clientes Recorrentes", valor: 389 },
  { estagio: "Clientes Inativos", valor: 88 }
];

const segmentMetrics = [
  {
    title: "Clientes Tipo A",
    icon: Trophy,
    value: "48",
    change: "+12% vs mês anterior",
    description: "4% dos clientes | 72% da receita",
    color: "text-amber-500 bg-amber-50"
  },
  {
    title: "Clientes Tipo B",
    icon: Medal,
    value: "136",
    change: "+8% vs mês anterior",
    description: "13% dos clientes | 23% da receita",
    color: "text-slate-500 bg-slate-50"
  },
  {
    title: "Clientes Tipo C",
    icon: Gem,
    value: "863",
    change: "+5% vs mês anterior",
    description: "83% dos clientes | 5% da receita",
    color: "text-indigo-500 bg-indigo-50"
  },
  {
    title: "Clientes Ativos",
    icon: UserCheck,
    value: "657",
    change: "+7% vs mês anterior",
    description: "Compra nos últimos 90 dias",
    color: "text-emerald-500 bg-emerald-50"
  },
  {
    title: "Clientes Inativos",
    icon: UserMinus,
    value: "390",
    change: "+2% vs mês anterior",
    description: "Sem compra há mais de 90 dias",
    color: "text-rose-500 bg-rose-50"
  },
  {
    title: "Leads Não Convertidos",
    icon: Users,
    value: "1.298",
    change: "+15% vs mês anterior",
    description: "Ainda não realizaram compras",
    color: "text-blue-500 bg-blue-50"
  }
];

export function CustomerSegmentDashboard() {
  return (
    <div className="space-y-6">
      {/* Métricas de Segmentação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segmentMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-full ${metric.color}`}>
                  <metric.icon className="h-4 w-4" />
                </div>
              </div>
              <CardDescription>{metric.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs de Visualização */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="abc">Curva ABC</TabsTrigger>
          <TabsTrigger value="lifecycle">Ciclo de Vida</TabsTrigger>
        </TabsList>

        {/* Tab de Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Distribuição ABC</CardTitle>
                <CardDescription>Segmentação por valor e volume</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <DonutChart
                  data={abcDistribution}
                  category="value"
                  index="name"
                  valueFormatter={valueFormatter}
                  colors={["amber", "slate", "indigo"]}
                  className="h-44"
                />
                <div className="flex justify-center gap-4 mt-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Trophy className="h-3 w-3 mr-1" />
                    Cliente A
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                    <Medal className="h-3 w-3 mr-1" />
                    Cliente B
                  </Badge>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <Gem className="h-3 w-3 mr-1" />
                    Cliente C
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Status de Atividade</CardTitle>
                <CardDescription>Clientes ativos vs inativos</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <DonutChart
                  data={clientStatusDistribution}
                  category="value"
                  index="name"
                  valueFormatter={valueFormatter}
                  colors={["emerald", "rose"]}
                  className="h-44"
                />
                <div className="flex justify-center gap-4 mt-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                    <UserMinus className="h-3 w-3 mr-1" />
                    Inativo
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tipo de Contato</CardTitle>
                <CardDescription>Leads vs clientes</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <DonutChart
                  data={customerTypeDistribution}
                  category="value"
                  index="name"
                  valueFormatter={valueFormatter}
                  colors={["blue", "emerald"]}
                  className="h-44"
                />
                <div className="flex justify-center gap-4 mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Users className="h-3 w-3 mr-1" />
                    Leads
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CircleDollarSign className="h-3 w-3 mr-1" />
                    Clientes
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Curva ABC */}
        <TabsContent value="abc" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Receita por Segmento ABC</CardTitle>
                    <CardDescription>Distribuição da receita entre segmentos de clientes</CardDescription>
                  </div>
                  <div className="p-2 rounded-full bg-amber-50 text-amber-500">
                    <CircleDollarSign className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={revenueBySegment}
                  index="segmento"
                  categories={["valor"]}
                  colors={["amber"]}
                  valueFormatter={(value) => `R$ ${valueFormatter(value)}`}
                  yAxisWidth={60}
                  showLegend={false}
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critérios de Classificação ABC</CardTitle>
                <CardDescription>Como os clientes são classificados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <h3 className="font-medium">Clientes A</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Representam 72% da receita
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Ticket médio acima de R$ 5.000
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Pelo menos 3 compras nos últimos 6 meses
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border bg-slate-50 border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Medal className="h-5 w-5 text-slate-500" />
                      <h3 className="font-medium">Clientes B</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        Representam 23% da receita
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        Ticket médio entre R$ 1.000 e R$ 5.000
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        Pelo menos 2 compras no último ano
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border bg-indigo-50 border-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Gem className="h-5 w-5 text-indigo-500" />
                      <h3 className="font-medium">Clientes C</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Representam 5% da receita
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Ticket médio abaixo de R$ 1.000
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Compras esporádicas ou únicas
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estratégias Recomendadas</CardTitle>
                <CardDescription>Ações por segmento de cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <h3 className="font-medium text-sm">Para Clientes A</h3>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Programa de fidelidade premium</li>
                      <li>• Gestor de conta dedicado</li>
                      <li>• Eventos exclusivos e previews</li>
                      <li>• Condições especiais de pagamento</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Medal className="h-4 w-4 text-slate-500" />
                      <h3 className="font-medium text-sm">Para Clientes B</h3>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Incentivos para aumento de ticket</li>
                      <li>• Comunicações personalizadas</li>
                      <li>• Ofertas especiais para upsell</li>
                      <li>• Programa de indicação</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Gem className="h-4 w-4 text-indigo-500" />
                      <h3 className="font-medium text-sm">Para Clientes C</h3>
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Automação de comunicação</li>
                      <li>• Ofertas para aumentar frequência</li>
                      <li>• Campanhas de reativação</li>
                      <li>• Análise de rentabilidade</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab de Ciclo de Vida */}
        <TabsContent value="lifecycle" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Distribuição por Estágio</CardTitle>
                  <CardDescription>Contatos por etapa no ciclo de vida</CardDescription>
                </div>
                <div className="p-2 rounded-full bg-blue-50 text-blue-500">
                  <BarChart2 className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <BarChart
                data={lifeCycleDistribution}
                index="estagio"
                categories={["valor"]}
                colors={["blue"]}
                valueFormatter={valueFormatter}
                yAxisWidth={48}
                showLegend={false}
                className="h-72"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Critérios de Atividade</CardTitle>
                <CardDescription>Como definimos clientes ativos e inativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-medium">Clientes Ativos</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Compra nos últimos 90 dias
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Interação recente com suporte/atendimento
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Abertura de emails ou engajamento em campanhas
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border bg-rose-50 border-rose-200">
                    <div className="flex items-center gap-2 mb-2">
                      <UserMinus className="h-5 w-5 text-rose-500" />
                      <h3 className="font-medium">Clientes Inativos</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Sem compras há mais de 90 dias
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Baixo engajamento em comunicações
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        Contrato expirado ou cancelado
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Definição de Lead vs Cliente</CardTitle>
                <CardDescription>Critérios de classificação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Leads</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Contato que nunca realizou compra
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Pode estar em qualquer estágio do funil
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Subclassificados por temperatura (quente/morno/frio)
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border bg-emerald-50 border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CircleDollarSign className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-medium">Clientes</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Realizou pelo menos uma compra
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Classificado por valor (ABC) e frequência
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Subclassificado por status (ativo/inativo)
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}