import { MetricCard } from "@/components/dashboard/MetricCard";
import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Vendas"
          value="R$ 45.231,89"
          icon={DollarSign}
          change="+20.1% vs. mês passado"
          changeType="increase"
        />
        <MetricCard
          title="Novos Leads"
          value="+2.350"
          icon={Users}
          change="+180.1% vs. mês passado"
          changeType="increase"
        />
        <MetricCard
          title="Taxa de Conversão"
          value="12,5%"
          icon={TrendingUp}
          change="-2% vs. mês passado"
          changeType="decrease"
        />
        <MetricCard
          title="Atendimentos Ativos"
          value="57"
          icon={Activity}
          change="+12 desde ontem"
          changeType="increase"
        />
      </div>
      {/* Futuramente adicionaremos gráficos aqui */}
    </div>
  );
}