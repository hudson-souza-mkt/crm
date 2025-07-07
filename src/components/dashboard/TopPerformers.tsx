import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const performers = [
  {
    id: 1,
    name: 'Ana Silva',
    avatar: '',
    sales: 'R$ 125.000',
    deals: 23,
    goal: 85,
    trend: '+12%'
  },
  {
    id: 2,
    name: 'Carlos Santos',
    avatar: '',
    sales: 'R$ 98.500',
    deals: 18,
    goal: 72,
    trend: '+8%'
  },
  {
    id: 3,
    name: 'Marina Costa',
    avatar: '',
    sales: 'R$ 87.200',
    deals: 15,
    goal: 68,
    trend: '+15%'
  },
  {
    id: 4,
    name: 'Pedro Oliveira',
    avatar: '',
    sales: 'R$ 76.800',
    deals: 12,
    goal: 58,
    trend: '+5%'
  },
];

export function TopPerformers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Top Vendedores
        </CardTitle>
        <CardDescription>
          Melhores performances do mês
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