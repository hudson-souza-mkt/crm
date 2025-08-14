import { EnhancedMetricCard } from "@/components/dashboard/EnhancedMetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { FunnelAnalysis } from "@/components/dashboard/FunnelAnalysis";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <EnhancedMetricCard
          title="Total de Vendas"
          value="R$ 387.500"
          icon={DollarSign}
          change="+23,5% vs mês passado"
          changeType="increase"
          subtitle="Meta: R$ 450.000"
          gradient="from-green-500 to-green-600"
        />
        <EnhancedMetricCard
          title="Novos Leads"
          value="1.247"
          icon={Users}
          change="+18,2% vs mês passado"
          changeType="increase"
          subtitle="Meta: 1.500"
          gradient="from-blue-500 to-blue-600"
        />
        <EnhancedMetricCard
          title="Taxa de Conversão"
          value="12,5%"
          icon={TrendingUp}
          change="-2,1% vs mês passado"
          changeType="decrease"
          subtitle="Meta: 15%"
          gradient="from-purple-500 to-purple-600"
        />
        <EnhancedMetricCard
          title="Ticket Médio"
          value="R$ 2.850"
          icon={Activity}
          change="+8,7% vs mês passado"
          changeType="increase"
          subtitle="Meta: R$ 3.000"
          gradient="from-orange-500 to-orange-600"
        />
      </div>
      
      {/* Gráfico e Top Vendedores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SalesChart />
        <TopPerformers />
      </div>
      
      {/* Metas e Funil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GoalsProgress />
        <FunnelAnalysis />
      </div>
      
      {/* Atividades Recentes */}
      <RecentActivities />
    </div>
  );
}