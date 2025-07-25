import { useState } from "react";
import { GoalsList } from "@/components/goals/GoalsList";
import { GoalForm } from "@/components/goals/GoalForm";
import { GoalsSummary } from "@/components/goals/GoalsSummary";
import { GoalFilter } from "@/components/goals/GoalFilter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Sliders, ChevronDown, BarChartHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export type GoalPeriod = "monthly" | "quarterly" | "yearly";
export type GoalStatus = "active" | "completed" | "overdue";
export type GoalCategory = "revenue" | "leads" | "conversion" | "retention" | "ticket" | "deals" | "custom";

// Interface para fonte de dados
export interface DataSource {
  id: string;
  name: string;
  description: string;
  category: GoalCategory[];
  value: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate: Date;
  period: GoalPeriod;
  status: GoalStatus;
  responsible?: string;
  team?: string;
  createdAt: Date;
  updatedAt: Date;
  dataSourceId?: string;
  isAutoCalculated: boolean;
}

// Fontes de dados disponíveis no sistema
export const dataSources: DataSource[] = [
  {
    id: "new_leads_current_month",
    name: "Novos leads (mês atual)",
    description: "Total de novos leads cadastrados no mês atual",
    category: ["leads"],
    value: 1247
  },
  {
    id: "qualified_leads_current_month",
    name: "Leads qualificados (mês atual)",
    description: "Total de leads que foram qualificados no mês atual",
    category: ["leads", "conversion"],
    value: 784
  },
  {
    id: "total_sales_current_month",
    name: "Valor total de vendas (mês atual)",
    description: "Soma de todas as vendas realizadas no mês atual",
    category: ["revenue"],
    value: 387500
  },
  {
    id: "approved_proposals_value",
    name: "Valor de propostas aprovadas (mês atual)",
    description: "Soma do valor de todas as propostas aprovadas no mês atual",
    category: ["revenue"],
    value: 425000
  },
  {
    id: "conversion_rate",
    name: "Taxa de conversão de leads (%)",
    description: "Percentual de leads convertidos em clientes",
    category: ["conversion"],
    value: 12.5
  },
  {
    id: "proposal_closure_rate",
    name: "Taxa de fechamento de propostas (%)",
    description: "Percentual de propostas que resultaram em vendas",
    category: ["conversion"],
    value: 47.3
  },
  {
    id: "avg_ticket_value",
    name: "Ticket médio (mês atual)",
    description: "Valor médio das vendas realizadas no mês atual",
    category: ["ticket"],
    value: 2850
  },
  {
    id: "closed_deals_count",
    name: "Número de negócios fechados (mês atual)",
    description: "Total de negócios fechados no mês atual",
    category: ["deals"],
    value: 87
  },
  {
    id: "active_deals_count",
    name: "Número de negócios em andamento",
    description: "Total de negócios atualmente em negociação",
    category: ["deals"],
    value: 234
  },
  {
    id: "customer_retention_rate",
    name: "Taxa de retenção de clientes (%)",
    description: "Percentual de clientes que renovaram seus contratos",
    category: ["retention"],
    value: 85.2
  }
];

// Dados de metas fictícios atualizados com fontes de dados
const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Meta Mensal de Vendas",
    description: "Atingir R$ 450.000 em vendas para o mês de Junho",
    category: "revenue",
    targetValue: 450000,
    currentValue: 387500,
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-30"),
    period: "monthly",
    status: "active",
    responsible: "Equipe de Vendas",
    team: "Comercial",
    createdAt: new Date("2025-05-25"),
    updatedAt: new Date("2025-06-15"),
    dataSourceId: "total_sales_current_month",
    isAutoCalculated: true
  },
  {
    id: "2",
    title: "Novos Leads Qualificados",
    description: "Captar 1.500 novos leads qualificados no mês",
    category: "leads",
    targetValue: 1500,
    currentValue: 1247,
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-30"),
    period: "monthly",
    status: "active",
    responsible: "Equipe de Marketing",
    team: "Marketing",
    createdAt: new Date("2025-05-25"),
    updatedAt: new Date("2025-06-15"),
    dataSourceId: "new_leads_current_month",
    isAutoCalculated: true
  },
  {
    id: "3",
    title: "Taxa de Conversão",
    description: "Aumentar a taxa de conversão de leads para 15%",
    category: "conversion",
    targetValue: 15,
    currentValue: 12.5,
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-30"),
    period: "monthly",
    status: "active",
    responsible: "Equipe de Vendas",
    team: "Comercial",
    createdAt: new Date("2025-05-25"),
    updatedAt: new Date("2025-06-15"),
    dataSourceId: "conversion_rate",
    isAutoCalculated: true
  },
  {
    id: "4",
    title: "Ticket Médio",
    description: "Aumentar o ticket médio para R$ 3.000",
    category: "ticket",
    targetValue: 3000,
    currentValue: 2850,
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-30"),
    period: "monthly",
    status: "active",
    responsible: "Equipe de Vendas",
    team: "Comercial",
    createdAt: new Date("2025-05-25"),
    updatedAt: new Date("2025-06-15"),
    dataSourceId: "avg_ticket_value",
    isAutoCalculated: true
  },
  {
    id: "5",
    title: "Meta Trimestral de Receita",
    description: "Atingir R$ 1.500.000 em receita para o trimestre",
    category: "revenue",
    targetValue: 1500000,
    currentValue: 1200000,
    startDate: new Date("2025-04-01"),
    endDate: new Date("2025-06-30"),
    period: "quarterly",
    status: "active",
    responsible: "Diretor Comercial",
    team: "Diretoria",
    createdAt: new Date("2025-03-25"),
    updatedAt: new Date("2025-06-15"),
    isAutoCalculated: false
  },
  {
    id: "6",
    title: "Meta Anual de Crescimento",
    description: "Crescer 30% em relação ao ano anterior",
    category: "revenue",
    targetValue: 30,
    currentValue: 23.5,
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-12-31"),
    period: "yearly",
    status: "active",
    responsible: "CEO",
    team: "Diretoria",
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2025-06-15"),
    isAutoCalculated: false
  }
];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<GoalPeriod>("monthly");
  const { toast } = useToast();

  // Função para atualizar automaticamente os valores atuais das metas com fonte de dados
  const updateAutoCalculatedGoals = () => {
    setGoals(prev => prev.map(goal => {
      if (goal.isAutoCalculated && goal.dataSourceId) {
        const dataSource = dataSources.find(ds => ds.id === goal.dataSourceId);
        if (dataSource) {
          return {
            ...goal,
            currentValue: dataSource.value,
            updatedAt: new Date()
          };
        }
      }
      return goal;
    }));
  };

  // Filtrar metas pelo período ativo
  const filteredGoals = goals.filter(goal => goal.period === activeTab);

  const handleCreateGoal = (newGoal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    const goal: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setGoals([...goals, goal]);
    setIsDialogOpen(false);
    toast({
      title: "Meta criada com sucesso",
      description: `A meta "${goal.title}" foi adicionada.`,
    });
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(goal => 
      goal.id === updatedGoal.id ? { ...updatedGoal, updatedAt: new Date() } : goal
    ));
    setEditingGoal(null);
    setIsDialogOpen(false);
    toast({
      title: "Meta atualizada com sucesso",
      description: `A meta "${updatedGoal.title}" foi atualizada.`,
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    toast({
      title: "Meta excluída",
      description: "A meta foi excluída com sucesso.",
      variant: "destructive",
    });
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
  };

  // Simular atualização automática das metas ao trocar de aba
  const handleTabChange = (value: string) => {
    setActiveTab(value as GoalPeriod);
    updateAutoCalculatedGoals();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Metas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie e acompanhe suas metas de vendas, leads e conversão
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="h-9 gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <Plus className="h-4 w-4" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <GoalForm 
                onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal} 
                goal={editingGoal}
                onCancel={closeDialog}
                dataSources={dataSources}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isFilterOpen && <GoalFilter />}

      {/* Resumo de cards com números principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Total de metas concluídas</h3>
            <p className="text-4xl font-bold">
              {goals.filter(goal => goal.status === "completed").length}
            </p>
            <div className="text-xs text-muted-foreground mt-1">1 filtro aplicado</div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Metas em andamento</h3>
            <p className="text-4xl font-bold">
              {goals.filter(goal => goal.status === "active").length}
            </p>
            <div className="text-xs text-muted-foreground mt-1">1 filtro aplicado</div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Metas atrasadas</h3>
            <p className="text-4xl font-bold text-red-500">
              {goals.filter(goal => goal.status === "overdue").length}
            </p>
            <div className="text-xs text-muted-foreground mt-1">1 filtro aplicado</div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Total de metas</h3>
            <p className="text-4xl font-bold">
              {goals.length}
            </p>
            <div className="text-xs text-muted-foreground mt-1">Sem filtros</div>
          </CardContent>
        </Card>
      </div>

      <Card className="corporate-card overflow-hidden">
        <CardHeader className="bg-secondary/30 px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Metas</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Sliders className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <BarChartHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="monthly" value={activeTab} onValueChange={handleTabChange}>
            <div className="border-b">
              <TabsList className="p-0 h-10 bg-transparent border-b">
                <TabsTrigger 
                  value="monthly" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-10"
                >
                  Metas Mensais
                </TabsTrigger>
                <TabsTrigger 
                  value="quarterly" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-10"
                >
                  Metas Trimestrais
                </TabsTrigger>
                <TabsTrigger 
                  value="yearly" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-10"
                >
                  Metas Anuais
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="monthly" className="m-0">
              <GoalsList 
                goals={filteredGoals} 
                onEdit={handleEditGoal} 
                onDelete={handleDeleteGoal}
                dataSources={dataSources}
              />
            </TabsContent>
            <TabsContent value="quarterly" className="m-0">
              <GoalsList 
                goals={filteredGoals} 
                onEdit={handleEditGoal} 
                onDelete={handleDeleteGoal}
                dataSources={dataSources}
              />
            </TabsContent>
            <TabsContent value="yearly" className="m-0">
              <GoalsList 
                goals={filteredGoals} 
                onEdit={handleEditGoal} 
                onDelete={handleDeleteGoal}
                dataSources={dataSources} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}