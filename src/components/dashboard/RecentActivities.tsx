import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, DollarSign, UserPlus, Target, MessageCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, addHours, addMinutes, differenceInDays, format, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

// Lista completa de atividades para filtrar
const allActivities = [
  {
    id: 1,
    type: 'sale',
    icon: DollarSign,
    title: 'Venda fechada',
    description: 'Ana Silva fechou negócio com TechCorp',
    value: 'R$ 15.000',
    date: addMinutes(new Date(), -2),
    user: 'AS'
  },
  {
    id: 2,
    type: 'lead',
    icon: UserPlus,
    title: 'Novo lead qualificado',
    description: 'Lead da campanha Facebook convertido',
    value: 'Marketing Digital',
    date: addMinutes(new Date(), -15),
    user: 'CS'
  },
  {
    id: 3,
    type: 'goal',
    icon: Target,
    title: 'Meta atingida',
    description: 'Carlos Santos atingiu 100% da meta mensal',
    value: '23 vendas',
    date: addHours(new Date(), -1),
    user: 'CS'
  },
  {
    id: 4,
    type: 'chat',
    icon: MessageCircle,
    title: 'Atendimento iniciado',
    description: 'Novo chat com lead interessado em consultoria',
    value: 'Consultoria',
    date: addHours(new Date(), -2),
    user: 'MC'
  },
  {
    id: 5,
    type: 'sale',
    icon: DollarSign,
    title: 'Venda fechada',
    description: 'Pedro Oliveira fechou negócio com GlobalTech',
    value: 'R$ 8.500',
    date: addHours(new Date(), -5),
    user: 'PO'
  },
  {
    id: 6,
    type: 'lead',
    icon: UserPlus,
    title: 'Novo lead qualificado',
    description: 'Lead da campanha Google Ads convertido',
    value: 'Software ERP',
    date: addHours(new Date(), -8),
    user: 'MC'
  },
  {
    id: 7,
    type: 'chat',
    icon: MessageCircle,
    title: 'Atendimento finalizado',
    description: 'Chat com cliente convertido em proposta',
    value: 'CRM Enterprise',
    date: addHours(new Date(), -12),
    user: 'AS'
  },
  {
    id: 8,
    type: 'goal',
    icon: Target,
    title: 'Meta parcial atingida',
    description: 'Marina Costa atingiu 75% da meta trimestral',
    value: '15 vendas',
    date: addDays(new Date(), -1),
    user: 'MC'
  },
  {
    id: 9,
    type: 'sale',
    icon: DollarSign,
    title: 'Venda fechada',
    description: 'Ana Silva fechou negócio com DataSystems',
    value: 'R$ 22.000',
    date: addDays(new Date(), -2),
    user: 'AS'
  },
  {
    id: 10,
    type: 'lead',
    icon: UserPlus,
    title: 'Novo lead qualificado',
    description: 'Lead de indicação convertido',
    value: 'Integração API',
    date: addDays(new Date(), -3),
    user: 'PO'
  },
  {
    id: 11,
    type: 'chat',
    icon: MessageCircle,
    title: 'Suporte prestado',
    description: 'Atendimento de suporte técnico concluído',
    value: 'Configuração',
    date: addDays(new Date(), -4),
    user: 'CS'
  },
  {
    id: 12,
    type: 'sale',
    icon: DollarSign,
    title: 'Venda fechada',
    description: 'Carlos Santos fechou negócio com SmartSolutions',
    value: 'R$ 18.500',
    date: addDays(new Date(), -5),
    user: 'CS'
  },
  {
    id: 13,
    type: 'goal',
    icon: Target,
    title: 'Meta de equipe atingida',
    description: 'Equipe de vendas atingiu meta mensal',
    value: '120% da meta',
    date: addDays(new Date(), -7),
    user: 'AS'
  },
  {
    id: 14,
    type: 'lead',
    icon: UserPlus,
    title: 'Lead reativado',
    description: 'Cliente antigo voltou a demonstrar interesse',
    value: 'Upgrade',
    date: addDays(new Date(), -10),
    user: 'MC'
  },
];

// Função para formatar o tempo relativo
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} min atrás`;
  }
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h atrás`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
  }
  
  return format(date, "dd/MM/yyyy", { locale: ptBR });
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'sale': return 'text-green-600 bg-green-100';
    case 'lead': return 'text-blue-600 bg-blue-100';
    case 'goal': return 'text-purple-600 bg-purple-100';
    case 'chat': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

interface RecentActivitiesProps {
  dateRange?: DateRange;
}

export function RecentActivities({ dateRange }: RecentActivitiesProps) {
  // Filtrar atividades com base no período selecionado
  const filteredActivities = !dateRange?.from || !dateRange?.to
    ? allActivities.slice(0, 6) // Mostrar apenas as 6 mais recentes se não houver filtro
    : allActivities.filter(activity => 
        isWithinInterval(activity.date, {
          start: dateRange.from,
          end: dateRange.to
        })
      );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚡ Atividades Recentes
        </CardTitle>
        <CardDescription>
          {filteredActivities.length} atividades no período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => {
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
                      {formatRelativeTime(activity.date)}
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
          })
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma atividade encontrada no período selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}