import { EnhancedMetricCard } from "@/components/dashboard/EnhancedMetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { FunnelAnalysis } from "@/components/dashboard/FunnelAnalysis";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { DollarSign, Users, Activity, TrendingUp, Target, MessageCircle, UserCheck, Calendar, Sparkles } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 min-h-full">
      {/* Header com gradiente */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl" />
        <div className="relative space-y-4 p-8 glass rounded-3xl border border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                Dashboard de Vendas
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Visão geral do desempenho da sua equipe de vendas
              </p>
            </div>
          </div>
          
          {/* Indicadores rápidos */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-700 font-medium">86% da meta mensal</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm text-blue-700 font-medium">1.247 leads ativos</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-sm text-purple-700 font-medium">57 atendimentos</span>
            </div>
          </div>
        </div>
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
          gradient="from-green-500 to-emerald-600"
        />
        <EnhancedMetricCard
          title="Novos Leads"
          value="1.247"
          subtitle="Meta: 1.500"
          icon={Users}
          change="+18.2% vs. mês passado"
          changeType="increase"
          gradient="from-blue-500 to-cyan-600"
        />
        <EnhancedMetricCard
          title="Taxa de Conversão"
          value="12,5%"
          subtitle="Meta: 15%"
          icon={TrendingUp}
          change="-2.1% vs. mês passado"
          changeType="decrease"
          gradient="from-purple-500 to-pink-600"
        />
        <EnhancedMetricCard
          title="Ticket Médio"
          value="R$ 2.850"
          subtitle="Meta: R$ 3.000"
          icon={Target}
          change="+8.7% vs. mês passado"
          changeType="increase"
          gradient="from-amber-500 to-orange-600"
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
          gradient="from-orange-500 to-red-500"
        />
        <EnhancedMetricCard
          title="Clientes Ativos"
          value="1.834"
          subtitle="468 novos este mês"
          icon={UserCheck}
          change="+15.3% vs. mês passado"
          changeType="increase"
          gradient="from-cyan-500 to-blue-500"
        />
        <EnhancedMetricCard
          title="Tempo Médio de Ciclo"
          value="18 dias"
          subtitle="Meta: 15 dias"
          icon={Calendar}
          change="+2 dias vs. mês passado"
          changeType="decrease"
          gradient="from-pink-500 to-rose-500"
        />
        <EnhancedMetricCard
          title="Pipeline Value"
          value="R$ 1.2M"
          subtitle="234 oportunidades"
          icon={Activity}
          change="+31.2% vs. mês passado"
          changeType="increase"
          gradient="from-indigo-500 to-purple-500"
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