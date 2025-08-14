import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";

// Função para obter dados de funil ajustados pelo período selecionado
const getAdjustedFunnelData = (dateRange?: DateRange) => {
  // Valores base para um mês
  const baseData = [
    { stage: 'Leads', count: 1250, percentage: 100, color: 'bg-blue-500' },
    { stage: 'Qualificados', count: 875, percentage: 70, color: 'bg-purple-500' },
    { stage: 'Propostas', count: 350, percentage: 28, color: 'bg-amber-500' },
    { stage: 'Negociação', count: 175, percentage: 14, color: 'bg-orange-500' },
    { stage: 'Fechados', count: 87, percentage: 7, color: 'bg-green-500' },
  ];
  
  // Se não houver período definido, retornar valores base
  if (!dateRange?.from || !dateRange?.to) {
    return baseData;
  }
  
  // Calcular duração do período em dias
  const daysDiff = differenceInDays(dateRange.to, dateRange.from) + 1;
  
  // Fator de ajuste baseado na duração (para período de 30 dias, fator é 1)
  const durationFactor = daysDiff / 30;
  
  // Fator de variação adicional (para simular flutuações)
  const variationFactor = (dateRange.to.getDate() / 31) * 0.3 + 0.85;
  
  // Ajustar contagens mantendo as mesmas proporções
  const adjustedData = baseData.map(stage => {
    const adjustedCount = Math.round(stage.count * durationFactor * variationFactor);
    return {
      ...stage,
      count: adjustedCount
    };
  });
  
  // Recalcular percentuais em relação ao primeiro estágio
  const firstStageCount = adjustedData[0].count;
  return adjustedData.map(stage => ({
    ...stage,
    percentage: Math.round((stage.count / firstStageCount) * 100)
  }));
};

interface FunnelAnalysisProps {
  dateRange?: DateRange;
}

export function FunnelAnalysis({ dateRange }: FunnelAnalysisProps) {
  const funnelData = getAdjustedFunnelData(dateRange);
  
  // Calcular taxa de conversão geral
  const conversionRate = funnelData.length > 0 
    ? (funnelData[funnelData.length - 1].count / funnelData[0].count) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 Análise do Funil
        </CardTitle>
        <CardDescription>
          Conversão por etapa do pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {funnelData.map((stage, index) => (
          <div key={stage.stage} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="font-medium text-sm">{stage.stage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {stage.count.toLocaleString('pt-BR')}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {stage.percentage}%
                </span>
              </div>
            </div>
            <Progress value={stage.percentage} className="h-2" />
          </div>
        ))}
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de conversão geral:</span>
            <span className="font-semibold text-green-600">{conversionRate.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}