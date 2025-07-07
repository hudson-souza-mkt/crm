import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  BarChart,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Timer,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Goal } from "@/pages/Goals";

interface GoalsSummaryProps {
  goals: Goal[];
}

export function GoalsSummary({ goals }: GoalsSummaryProps) {
  // Função para calcular estatísticas
  const calculateStats = () => {
    const totalGoals = goals.length;
    const activeGoals = goals.filter(goal => goal.status === "active").length;
    const completedGoals = goals.filter(goal => goal.status === "completed").length;
    const overdueGoals = goals.filter(goal => goal.status === "overdue").length;
    
    const avgProgress = goals.length > 0
      ? goals.reduce((sum, goal) => sum + (goal.currentValue / goal.targetValue) * 100, 0) / totalGoals
      : 0;
    
    const nearCompletionGoals = goals.filter(goal => {
      const progress = (goal.currentValue / goal.targetValue) * 100;
      return goal.status === "active" && progress >= 85 && progress < 100;
    }).length;
    
    const atRiskGoals = goals.filter(goal => {
      const progress = (goal.currentValue / goal.targetValue) * 100;
      const now = new Date();
      const totalDuration = goal.endDate.getTime() - goal.startDate.getTime();
      const elapsed = now.getTime() - goal.startDate.getTime();
      const timeProgress = (elapsed / totalDuration) * 100;
      
      // Meta está em risco se passou mais de 70% do tempo mas o progresso está abaixo de 50%
      return goal.status === "active" && timeProgress > 70 && progress < 50;
    }).length;
    
    return {
      totalGoals,
      activeGoals,
      completedGoals,
      overdueGoals,
      avgProgress,
      nearCompletionGoals,
      atRiskGoals,
    };
  };

  const stats = calculateStats();

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 70) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Progresso Médio
              </p>
              <div className="text-2xl font-bold">
                {stats.avgProgress.toFixed(1)}%
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Progress value={stats.avgProgress} className="h-2" />
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 mr-1 text-green-500" />
            <span>2.5% a mais que o mês anterior</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Metas Ativas
              </p>
              <div className="flex items-end gap-1">
                <div className="text-2xl font-bold">{stats.activeGoals}</div>
                <div className="text-sm text-muted-foreground mb-0.5">
                  de {stats.totalGoals}
                </div>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 rounded-md p-2">
              <div className="text-sm font-medium text-green-600">{stats.completedGoals}</div>
              <div className="text-xs text-muted-foreground">Concluídas</div>
            </div>
            <div className="bg-amber-50 rounded-md p-2">
              <div className="text-sm font-medium text-amber-600">{stats.nearCompletionGoals}</div>
              <div className="text-xs text-muted-foreground">Quase lá</div>
            </div>
            <div className="bg-red-50 rounded-md p-2">
              <div className="text-sm font-medium text-red-600">{stats.atRiskGoals}</div>
              <div className="text-xs text-muted-foreground">Em risco</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Taxa de Conclusão
              </p>
              <div className={cn(
                "text-2xl font-bold",
                getCompletionRateColor((stats.completedGoals / stats.totalGoals) * 100 || 0)
              )}>
                {stats.totalGoals ? ((stats.completedGoals / stats.totalGoals) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Metas mensais</span>
              <span className="font-medium">
                {((goals.filter(g => g.period === "monthly" && g.status === "completed").length / 
                   Math.max(1, goals.filter(g => g.period === "monthly").length)) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Metas trimestrais</span>
              <span className="font-medium">
                {((goals.filter(g => g.period === "quarterly" && g.status === "completed").length / 
                   Math.max(1, goals.filter(g => g.period === "quarterly").length)) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Metas anuais</span>
              <span className="font-medium">
                {((goals.filter(g => g.period === "yearly" && g.status === "completed").length / 
                   Math.max(1, goals.filter(g => g.period === "yearly").length)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Próximos Vencimentos
              </p>
              <div className="text-2xl font-bold">
                {goals.filter(g => {
                  const now = new Date();
                  const daysUntilEnd = Math.ceil((g.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return g.status === "active" && daysUntilEnd <= 7;
                }).length}
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Timer className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          
          {/* Lista de próximos vencimentos */}
          <div className="space-y-2">
            {goals
              .filter(g => {
                const now = new Date();
                const daysUntilEnd = Math.ceil((g.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return g.status === "active" && daysUntilEnd <= 7;
              })
              .slice(0, 3)
              .map((goal, index) => {
                const now = new Date();
                const daysUntilEnd = Math.ceil((goal.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const progress = (goal.currentValue / goal.targetValue) * 100;
                
                return (
                  <div key={index} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      {progress >= 85 ? (
                        <ArrowUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className="truncate max-w-[140px]">{goal.title}</span>
                    </div>
                    <div className={cn(
                      "text-xs font-medium",
                      daysUntilEnd <= 2 ? "text-red-600" : "text-amber-600"
                    )}>
                      {daysUntilEnd} dia{daysUntilEnd !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })
            }
            
            {goals.filter(g => {
              const now = new Date();
              const daysUntilEnd = Math.ceil((g.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return g.status === "active" && daysUntilEnd <= 7;
            }).length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-2">
                Nenhuma meta vencendo em breve
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}