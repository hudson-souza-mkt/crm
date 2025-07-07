import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const funnelData = [
  { stage: 'Leads', count: 1250, percentage: 100, color: 'bg-blue-500' },
  { stage: 'Qualificados', count: 875, percentage: 70, color: 'bg-purple-500' },
  { stage: 'Propostas', count: 350, percentage: 28, color: 'bg-amber-500' },
  { stage: 'Negociação', count: 175, percentage: 14, color: 'bg-orange-500' },
  { stage: 'Fechados', count: 87, percentage: 7, color: 'bg-green-500' },
];

export function FunnelAnalysis() {
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
                  {stage.count}
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
            <span className="font-semibold text-green-600">7%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}