import { useState } from "react";
import { EnhancedMetricCard } from "@/components/dashboard/EnhancedMetricCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopPerformers } from "@/components/dashboard/TopPerformers";
import { GoalsProgress } from "@/components/dashboard/GoalsProgress";
import { FunnelAnalysis } from "@/components/dashboard/FunnelAnalysis";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { DateRange } from "react-day-picker";
import { DollarSign, Users, Activity, TrendingUp, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  // Formatar período para exibição
  const formattedPeriod = dateRange?.from && dateRange?.to 
    ? `${format(dateRange.from, "dd 'de' MMMM", { locale: ptBR })} - ${format(dateRange.to, "dd 'de' MMMM", { locale: ptBR })}`
    : "Este mês";

  // Função que seria usada para exportar relatórios
  const exportReport = () => {
    alert("Exportando relatório para o período: " + formattedPeriod);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Período: {formattedPeriod}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <DateRangePicker onChange={setDateRange} />
          
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="vendas">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendas" className="mt-6 space-y-6">
          {/* Cards de métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnhancedMetricCard
              title="Total de Vendas"
              value="R$ 387.500"
              icon={DollarSign}
              change="+23,5% vs período anterior"
              changeType="increase"
              subtitle="Meta: R$ 450.000"
              gradient="from-green-500 to-green-600"
            />
            <EnhancedMetricCard
              title="Novos Leads"
              value="1.247"
              icon={Users}
              change="+18,2% vs período anterior"
              changeType="increase"
              subtitle="Meta: 1.500"
              gradient="from-blue-500 to-blue-600"
            />
            <EnhancedMetricCard
              title="Taxa de Conversão"
              value="12,5%"
              icon={TrendingUp}
              change="-2,1% vs período anterior"
              changeType="decrease"
              subtitle="Meta: 15%"
              gradient="from-purple-500 to-purple-600"
            />
            <EnhancedMetricCard
              title="Ticket Médio"
              value="R$ 2.850"
              icon={Activity}
              change="+8,7% vs período anterior"
              changeType="increase"
              subtitle="Meta: R$ 3.000"
              gradient="from-orange-500 to-orange-600"
            />
          </div>
          
          {/* Gráfico e Top Vendedores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SalesChart dateRange={dateRange} />
            <TopPerformers dateRange={dateRange} />
          </div>
          
          {/* Metas e Funil */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <GoalsProgress dateRange={dateRange} />
            <FunnelAnalysis dateRange={dateRange} />
          </div>
          
          {/* Atividades Recentes */}
          <RecentActivities dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="atendimento" className="mt-6">
          <div className="border rounded-md p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Dashboard de Atendimento</h3>
            <p className="text-muted-foreground">
              Estatísticas de atendimento para o período: {formattedPeriod}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="marketing" className="mt-6">
          <div className="border rounded-md p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Dashboard de Marketing</h3>
            <p className="text-muted-foreground">
              Estatísticas de marketing para o período: {formattedPeriod}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro" className="mt-6">
          <div className="border rounded-md p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Dashboard Financeiro</h3>
            <p className="text-muted-foreground">
              Estatísticas financeiras para o período: {formattedPeriod}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}