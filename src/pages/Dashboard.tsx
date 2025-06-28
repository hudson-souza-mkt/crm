import MetricCard from "@/components/dashboard/MetricCard";
import SalesFunnelChart from "@/components/dashboard/SalesFunnelChart";
import LeadsBySourceChart from "@/components/dashboard/LeadsBySourceChart";
import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total de Negócios" 
          value="R$ 120.500" 
          icon={DollarSign} 
          change="+20.1% desde o mês passado"
          changeType="increase"
        />
        <MetricCard 
          title="Negócios Ganhos" 
          value="R$ 89.300" 
          icon={TrendingUp} 
          change="+15.2% desde o mês passado"
          changeType="increase"
        />
        <MetricCard 
          title="Negócios Perdidos" 
          value="R$ 31.200" 
          icon={TrendingDown} 
          change="+5.7% desde o mês passado"
          changeType="decrease"
        />
        <MetricCard 
          title="Novos Leads" 
          value="+1,234" 
          icon={Users} 
          change="+80 desde ontem"
          changeType="increase"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SalesFunnelChart />
        <LeadsBySourceChart />
      </div>
    </div>
  );
};

export default Dashboard;