import { EnhancedMetricCard } from "@/components/dashboard/EnhancedMetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { FunnelAnalysis } from "@/components/dashboard/FunnelAnalysis";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { DollarSign, Users, Activity, TrendingUp, Target, MessageCircle, UserCheck, Calendar } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 min-h-full bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Dashboard de Vendas
        </h1>
        <p className="text-muted-foreground text-lg">
          Visão geral do desempenho da sua equipe de vendas
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedMetricCard
          title="Receita Total"
          value="R$ 387.500"
          subtitle="Meta: R$ 450.000"
          icon={DollarSign}
          change="+23.5% vs. mês passado"
          changeType="increase"
          color="bg-green-500"
        />
        <EnhancedMetricCard
          title="Novos Leads"
          value="1.247"
          subtitle="Meta: 1.500"
          icon={Users}
          change="+18.2% vs. mês passado"
          changeType="increase"
          color="bg-blue-500"
        />
        <EnhancedMetricCard
          title="Taxa de Conversão"
          value="12,5%"
          subtitle="Meta: 15%"
          icon={TrendingUp}
          change="-2.1% vs. mês passado"
          changeType="decrease"
          color="bg-purple-500"
        />
        <EnhancedMetricCard
          title="Ticket Médio"
          value="R$ 2.850"
          subtitle="Meta: R$ 3.000"
          icon={Target}
          change="+8.7% vs. mês passado"
          changeType="increase"
          color="bg-amber-500"
        />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedMetricCard
          title="Atendimentos Ativos"
          value="57"
          subtitle="12 aguardando"
          icon={MessageCircle}
          change="+12 desde ontem"
          changeType="increase"
          color="bg-orange-500"
        />
        <EnhancedMetricCard
          title="Clientes Ativos"
          value="1.834"
          subtitle="468 novos este mês"
          icon={UserCheck}
          change="+15.3% vs. mês passado"
          changeType="increase"
          color="bg-cyan-500"
        />
        <EnhancedMetricCard
          title="Tempo Médio de Ciclo"
          value="18 dias"
          subtitle="Meta: 15 dias"
          icon={Calendar}
          change="+2 dias vs. mês passado"
          changeType="decrease"
          color="bg-pink-500"
        />
        <EnhancedMetricCard
          title="Pipeline Value"
          value="R$ 1.2M"
          subtitle="234 oportunidades"
          icon={Activity}
          change="+31.2% vs. mês passado"
          changeType="increase"
          color="bg-indigo-500"
        />
      </div>

      {/* Progresso das Metas */}
      <GoalsProgress />

      {/* Gráficos e Análises */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SalesChart />
        <FunnelAnalysis />
      </div>

      {/* Atividades e Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopPerformers />
        <RecentActivities />
      </div>
    </div>
  );
}