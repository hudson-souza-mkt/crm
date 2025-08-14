import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Função para calcular valores ajustados com base no período
const getAdjustedGoals = (dateRange?: DateRange) => {
  // Se não houver período definido, usar valores padrão
  if (!dateRange?.from || !dateRange?.to) {
    return [
      {
        title: 'Meta Mensal de Vendas',
        current: 387500,
        target: 450000,
        percentage: 86,
        trend: 'up',
        period: 'Este mês'
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
      }
    ];
  }
  
  // Calcular a duração do período em dias
  const daysDiff = differenceInDays(dateRange.to, dateRange.from) + 1;
  
  // Ajustar o fator com base na duração (para períodos mais longos, valores maiores)
  const durationFactor = Math.min(daysDiff / 30, 12); // Limitar a 12x o valor mensal
  
  // Fator de variação adicional (para simular flutuações)
  const variationFactor = (dateRange.to.getDate() / 31) * 0.2 + 0.9;
  
  // Período formatado
  const formattedPeriod = `${format(dateRange.from, "dd/MM", { locale: ptBR })} - ${format(dateRange.to, "dd/MM", { locale: ptBR })}`;
  
  // Calcular valores proporcionais ao período
  const salesTarget = Math.round(450000 * durationFactor);
  const salesCurrent = Math.round(salesTarget * 0.86 * variationFactor);
  const salesPercentage = Math.round((salesCurrent / salesTarget) * 100);
  
  const leadsTarget = Math.round(1500 * durationFactor);
  const leadsCurrent = Math.round(leadsTarget * 0.83 * variationFactor);
  const leadsPercentage = Math.round((leadsCurrent / leadsTarget) * 100);
  
  const conversionRate = Math.round(12.5 * variationFactor * 10) / 10;
  const conversionTarget = 15;
  const conversionPercentage = Math.round((conversionRate / conversionTarget) * 100);
  
  const ticketAverage = Math.round(2850 * variationFactor);
  const ticketTarget = 3000;
  const ticketPercentage = Math.round((ticketAverage / ticketTarget) * 100);
  
  return [
    {
      title: 'Vendas',
      current: salesCurrent,
      target: salesTarget,
      percentage: salesPercentage,
      trend: salesPercentage >= 85 ? 'up' : 'down',
      period: formattedPeriod
    },
    {
      title: 'Novos Leads',
      current: leadsCurrent,
      target: leadsTarget,
      percentage: leadsPercentage,
      trend: leadsPercentage >= 80 ? 'up' : 'down',
      period: formattedPeriod
    },
    {
      title: 'Taxa de Conversão',
      current: conversionRate,
      target: conversionTarget,
      percentage: conversionPercentage,
      trend: conversionPercentage >= 80 ? 'up' : 'down',
      period: formattedPeriod
    },
    {
      title: 'Ticket Médio',
      current: ticketAverage,
      target: ticketTarget,
      percentage: ticketPercentage,
      trend: ticketPercentage >= 90 ? 'up' : 'down',
      period: formattedPeriod
    }
  ];
};

interface GoalsProgressProps {
  dateRange?: DateRange;
}

export function GoalsProgress({ dateRange }: GoalsProgressProps) {
  const goals = getAdjustedGoals(dateRange);

  const formatValue = (value: number, title: string) => {
    if (title.includes('Vendas') || title.includes('Ticket')) {
      return `R$ ${value.toLocaleString('pt-BR')}`;
    }
    if (title.includes('Taxa') || title.includes('Conversão')) {
      return `${value}%`;
    }
    return value.toLocaleString('pt-BR');
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>
          🎯 Progresso das Metas
        </CardTitle>
        <CardDescription>
          Acompanhamento das principais métricas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-3 p-4 rounded-lg border">
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