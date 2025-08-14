import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DateRange } from "react-day-picker";

// Função para simular variação nos dados com base no período
const getVariedData = (dateRange?: DateRange) => {
  // Fator de variação com base na data final do período
  const variationFactor = dateRange?.to 
    ? (dateRange.to.getDate() / 31) * (dateRange.to.getMonth() + 1) / 12
    : 0.8;
  
  return [
    {
      id: 1,
      name: 'Ana Silva',
      avatar: '',
      sales: `R$ ${Math.round(125000 * (0.9 + variationFactor * 0.4)).toLocaleString('pt-BR')}`,
      deals: Math.round(23 * (0.9 + variationFactor * 0.4)),
      goal: Math.round(85 * (0.9 + variationFactor * 0.4)),
      trend: `+${Math.round(12 * variationFactor)}%`
    },
    {
      id: 2,
      name: 'Carlos Santos',
      avatar: '',
      sales: `R$ ${Math.round(98500 * (0.9 + variationFactor * 0.3)).toLocaleString('pt-BR')}`,
      deals: Math.round(18 * (0.9 + variationFactor * 0.3)),
      goal: Math.round(72 * (0.9 + variationFactor * 0.3)),
      trend: `+${Math.round(8 * variationFactor)}%`
    },
    {
      id: 3,
      name: 'Marina Costa',
      avatar: '',
      sales: `R$ ${Math.round(87200 * (0.9 + variationFactor * 0.5)).toLocaleString('pt-BR')}`,
      deals: Math.round(15 * (0.9 + variationFactor * 0.5)),
      goal: Math.round(68 * (0.9 + variationFactor * 0.5)),
      trend: `+${Math.round(15 * variationFactor)}%`
    },
    {
      id: 4,
      name: 'Pedro Oliveira',
      avatar: '',
      sales: `R$ ${Math.round(76800 * (0.9 + variationFactor * 0.2)).toLocaleString('pt-BR')}`,
      deals: Math.round(12 * (0.9 + variationFactor * 0.2)),
      goal: Math.round(58 * (0.9 + variationFactor * 0.2)),
      trend: `+${Math.round(5 * variationFactor)}%`
    },
  ];
};

interface TopPerformersProps {
  dateRange?: DateRange;
}

export function TopPerformers({ dateRange }: TopPerformersProps) {
  const performers = getVariedData(dateRange);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Top Vendedores
        </CardTitle>
        <CardDescription>
          Melhores performances do período
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {performers.map((performer, index) => (
          <div key={performer.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground w-6">
                #{index + 1}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={performer.avatar} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {performer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium truncate">{performer.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {performer.trend}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{performer.sales}</span>
                <span>{performer.deals} negócios</span>
              </div>
              <Progress value={performer.goal} className="h-1" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}