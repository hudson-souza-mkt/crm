import { MetricCard } from "@/components/dashboard/MetricCard";
import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Receita Total"
          value="R$ 45.231,89"
          icon={DollarSign}
          change="+20.1% do último mês"
        />
        <MetricCard
          title="Assinaturas"
          value="+2.350"
          icon={Users}
          change="+180.1% do último mês"
        />
        <MetricCard
          title="Vendas"
          value="+12.234"
          icon={TrendingUp}
          change="+19% do último mês"
        />
        <MetricCard
          title="Ativos Agora"
          value="+573"
          icon={Activity}
          change="+201 desde a última hora"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Visão Geral da Receita</CardTitle>
            <CardDescription>Um gráfico mostrando a receita ao longo do tempo.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            [Gráfico de Linha Aqui]
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vendas Recentes</CardTitle>
            <CardDescription>Você fez 265 vendas este mês.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            [Lista de Vendas Aqui]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}