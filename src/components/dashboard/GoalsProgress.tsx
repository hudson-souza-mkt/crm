import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

const goals = [
  {
    title: 'Meta Mensal de Vendas',
    current: 387500,
    target: 450000,
    percentage: 86,
    trend: 'up',
    period: 'Junho 2025'
  },
  {
    title: 'Novos Leads',
    current: 1247,
    target: 1500,
    percentage: 83,
    trend: 'up',
    period: 'Este mês'
  },
  {
    title: 'Taxa de Conversão',
    current: 12.5,
    target: 15,
    percentage: 83,
    trend: 'down',
    period: 'Últimos 30 dias'
  },
  {
    title: 'Ticket Médio',
    current: 2850,
    target: 3000,
    percentage: 95,
    trend: 'up',
    period: 'Este mês'
  },
];

export function GoalsProgress() {
  const formatValue = (value: number, title: string) => {
    if (title.includes('Vendas') || title.includes('Ticket')) {
      return `R$ ${value.toLocaleString('pt-BR')}`;
    }
    if (title.includes('Taxa')) {
      return `${value}%`;
    }
    return value.toLocaleString('pt-BR');
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Progresso das Metas
        </CardTitle>
        <CardDescription>
          Acompanhamento das principais métricas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-3 p-4 rounded-lg border bg-gradient-to-r from-muted/30 to-muted/10">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{goal.title}</h4>
                <Badge variant={goal.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  {goal.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {goal.percentage}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Atual:</span>
                  <span className="font-semibold">{formatValue(goal.current, goal.title)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Meta:</span>
                  <span>{formatValue(goal.target, goal.title)}</span>
                </div>
                <Progress value={goal.percentage} className="h-2" />
              </div>
              
              <p className="text-xs text-muted-foreground">{goal.period}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}