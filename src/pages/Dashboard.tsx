import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Função para buscar os dados do dashboard
const fetchDashboardMetrics = async () => {
  // 1. Encontrar o ID da etapa "Ganho"
  const { data: stageData, error: stageError } = await supabase
    .from("pipeline_stages")
    .select("id")
    .eq("name", "Ganho")
    .limit(1)
    .single();

  if (stageError) {
    console.error("Erro ao buscar etapa 'Ganho':", stageError);
  }
  const wonStageId = stageData?.id;

  // 2. Calcular o total de vendas (deals na etapa "Ganho")
  let totalSales = 0;
  if (wonStageId) {
    const { data: salesData, error: salesError } = await supabase
      .from("deals")
      .select("value")
      .eq("pipeline_stage_id", wonStageId);

    if (salesError) throw new Error(salesError.message);
    totalSales = salesData.reduce((sum, deal) => sum + deal.value, 0);
  }

  // 3. Calcular novos leads nos últimos 30 dias
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: newLeadsCount, error: leadsError } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString());

  if (leadsError) throw new Error(leadsError.message);

  return { totalSales, newLeadsCount };
};

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: fetchDashboardMetrics,
  });

  const formatCurrency = (value: number | undefined) => {
    if (typeof value === 'undefined') return "R$ 0,00";
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <MetricCard
              title="Total de Vendas"
              value={formatCurrency(data?.totalSales)}
              icon={DollarSign}
              change="+20.1% vs. mês passado"
              changeType="increase"
            />
            <MetricCard
              title="Novos Leads (30d)"
              value={`+${data?.newLeadsCount || 0}`}
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
          </>
        )}
      </div>
      {/* Futuramente adicionaremos gráficos aqui */}
    </div>
  );
}