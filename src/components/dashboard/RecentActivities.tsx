import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, DollarSign, UserPlus, Target, MessageCircle } from "lucide-react";

const activities = [
  {
    id: 1,
    type: 'sale',
    icon: DollarSign,
    title: 'Venda fechada',
    description: 'Ana Silva fechou negócio com TechCorp',
    value: 'R$ 15.000',
    time: '2 min atrás',
    user: 'AS'
  },
  {
    id: 2,
    type: 'lead',
    icon: UserPlus,
    title: 'Novo lead qualificado',
    description: 'Lead da campanha Facebook convertido',
    value: 'Marketing Digital',
    time: '15 min atrás',
    user: 'CS'
  },
  {
    id: 3,
    type: 'goal',
    icon: Target,
    title: 'Meta atingida',
    description: 'Carlos Santos atingiu 100% da meta mensal',
    value: '23 vendas',
    time: '1h atrás',
    user: 'CS'
  },
  {
    id: 4,
    type: 'chat',
    icon: MessageCircle,
    title: 'Atendimento iniciado',
    description: 'Novo chat com lead interessado em consultoria',
    value: 'Consultoria',
    time: '2h atrás',
    user: 'MC'
  },
];

const getActivityColor = (type: string) => {
  switch (type) {
    case 'sale': return 'text-green-600 bg-green-100';
    case 'lead': return 'text-blue-600 bg-blue-100';
    case 'goal': return 'text-purple-600 bg-purple-100';
    case 'chat': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚡ Atividades Recentes
        </CardTitle>
        <CardDescription>
          Últimas movimentações da equipe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {activity.value}
                  </Badge>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {activity.user}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}