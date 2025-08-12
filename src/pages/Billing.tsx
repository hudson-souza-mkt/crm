import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Zap,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Download,
  Plus,
  Crown,
  Star,
  Check,
  X
} from "lucide-react";
import { BillingOverview } from "@/components/billing/BillingOverview";
import { UsageAnalytics } from "@/components/billing/UsageAnalytics";
import { PlanComparison } from "@/components/billing/PlanComparison";
import { PaymentMethods } from "@/components/billing/PaymentMethods";
import { InvoiceHistory } from "@/components/billing/InvoiceHistory";
import { useBilling } from "@/hooks/useBilling";

export default function Billing() {
  const [activeTab, setActiveTab] = useState("overview");
  const { balance, usageStats, alerts, plans, loading } = useBilling();

  const currentPlan = plans.find(p => p.id === balance.currentPlan);
  const usagePercentage = (balance.usedCredits / balance.totalCredits) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Créditos</h1>
          <p className="text-muted-foreground">
            Gerencie seus créditos, planos e uso dos agentes de IA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Baixar Fatura
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Recarregar Créditos
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 2).map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.severity === 'error' 
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : alert.severity === 'warning'
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">{alert.title}</span>
                <span className="text-sm">{alert.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plano Atual</p>
                <p className="text-2xl font-bold">{currentPlan?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Renova em {balance.renewalDate.toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Crown className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Créditos Restantes</p>
                <p className="text-2xl font-bold text-green-600">
                  {balance.remainingCredits.toLocaleString()}
                </p>
                <Progress value={100 - usagePercentage} className="mt-2" />
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gasto Este Mês</p>
                <p className="text-2xl font-bold">R$ {usageStats.totalCost.toFixed(2)}</p>
                <p className="text-xs text-green-600">↗ +12% vs mês anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversas</p>
                <p className="text-2xl font-bold">
                  {usageStats.byAgent.reduce((sum, agent) => sum + agent.conversations, 0)}
                </p>
                <p className="text-xs text-blue-600">Este mês</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Uso Detalhado
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagamento
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Faturas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <BillingOverview balance={balance} usageStats={usageStats} />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <UsageAnalytics usageStats={usageStats} />
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <PlanComparison plans={plans} currentPlan={balance.currentPlan} />
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <PaymentMethods />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}