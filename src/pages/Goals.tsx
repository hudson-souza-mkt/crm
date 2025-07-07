import { useState } from "react";
import { GoalsList } from "@/components/goals/GoalsList";
import { GoalForm } from "@/components/goals/GoalForm";
import { GoalsSummary } from "@/components/goals/GoalsSummary";
import { GoalFilter } from "@/components/goals/GoalFilter";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export type GoalPeriod = "monthly" | "quarterly" | "yearly";
export type GoalStatus = "active" | "completed" | "overdue";
export type GoalCategory = "revenue" | "leads" | "conversion" | "retention" | "ticket" | "deals" | "custom";

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
}

// Dados de metas fictícios
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
    updatedAt: new Date("2025-06-15")
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
    updatedAt: new Date("2025-06-15")
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
    updatedAt: new Date("2025-06-15")
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
    updatedAt: new Date("2025-06-15")
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
    updatedAt: new Date("2025-06-15")
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
    updatedAt: new Date("2025-06-15")
  }
];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<GoalPeriod>("monthly");
  const { toast } = useToast();

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Metas</h1>
          <p className="text-muted-foreground mt-1">
            Crie e acompanhe metas para sua equipe de vendas
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="gap-1"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <GoalForm 
                onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal} 
                goal={editingGoal}
                onCancel={closeDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isFilterOpen && <GoalFilter />}

      <GoalsSummary goals={goals} />

      <Tabs defaultValue="monthly" value={activeTab} onValueChange={value => setActiveTab(value as GoalPeriod)}>
        <TabsList className="mb-4">
          <TabsTrigger value="monthly">Metas Mensais</TabsTrigger>
          <TabsTrigger value="quarterly">Metas Trimestrais</TabsTrigger>
          <TabsTrigger value="yearly">Metas Anuais</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <GoalsList 
            goals={filteredGoals} 
            onEdit={handleEditGoal} 
            onDelete={handleDeleteGoal} 
          />
        </TabsContent>
        <TabsContent value="quarterly">
          <GoalsList 
            goals={filteredGoals} 
            onEdit={handleEditGoal} 
            onDelete={handleDeleteGoal} 
          />
        </TabsContent>
        <TabsContent value="yearly">
          <GoalsList 
            goals={filteredGoals} 
            onEdit={handleEditGoal} 
            onDelete={handleDeleteGoal} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}