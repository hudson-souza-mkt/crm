import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  DollarSign,
  Users,
  Target,
  ShoppingCart,
  RefreshCcw,
  BarChart,
  Database,
  HandCoins,
} from "lucide-react";
import type { Goal, GoalCategory, GoalStatus, DataSource } from "@/pages/Goals";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GoalsListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  dataSources: DataSource[];
}

export function GoalsList({ goals, onEdit, onDelete, dataSources }: GoalsListProps) {
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const formatValue = (value: number, category: GoalCategory) => {
    if (category === "revenue" || category === "ticket") {
      return `R$ ${value.toLocaleString('pt-BR')}`;
    }
    if (category === "conversion" || category === "retention") {
      return `${value}%`;
    }
    return value.toLocaleString('pt-BR');
  };

  const getCategoryIcon = (category: GoalCategory) => {
    switch (category) {
      case "revenue": return <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />;
      case "leads": return <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />;
      case "conversion": return <Target className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />;
      case "ticket": return <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />;
      case "deals": return <BarChart className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-500" />;
      case "retention": return <RefreshCcw className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-500" />;
      default: return <Target className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200 font-normal text-xs">Em andamento</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200 font-normal text-xs">Concluída</Badge>;
      case "overdue":
        return <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200 font-normal text-xs">Atrasada</Badge>;
    }
  };

  const calculateProgress = (current: number, target: number) => {
    const progress = (current / target) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const formatDateRange = (start: Date, end: Date) => {
    return `${start.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`;
  };

  const getDataSourceName = (goal: Goal) => {
    if (!goal.isAutoCalculated || !goal.dataSourceId) return null;
    const source = dataSources.find(ds => ds.id === goal.dataSourceId);
    return source ? source.name : null;
  };

  const confirmDelete = (goalId: string) => {
    setGoalToDelete(goalId);
  };

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      onDelete(goalToDelete);
      setGoalToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="table-corporate">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] sm:w-[180px] text-xs sm:text-sm">Meta</TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Categoria</TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">Período</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Atual</TableHead>
              <TableHead className="text-right text-xs sm:text-sm">Meta</TableHead>
              <TableHead className="text-xs sm:text-sm">Progresso</TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Status</TableHead>
              <TableHead className="w-[60px] sm:w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 sm:py-8 text-muted-foreground text-sm">
                  Nenhuma meta encontrada para este período.
                </TableCell>
              </TableRow>
            ) : (
              goals.map((goal) => {
                const progress = calculateProgress(goal.currentValue, goal.targetValue);
                const dataSourceName = getDataSourceName(goal);
                
                return (
                  <TableRow key={goal.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm truncate">{goal.title}</span>
                        {goal.description && (
                          <span className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[180px]">
                            {goal.description}
                          </span>
                        )}
                        {/* Mostrar categoria em mobile */}
                        <div className="flex items-center gap-1 mt-1 sm:hidden">
                          {getCategoryIcon(goal.category)}
                          <span className="text-xs text-muted-foreground">
                            {goal.category === "revenue" ? "Receita" :
                             goal.category === "leads" ? "Leads" :
                             goal.category === "conversion" ? "Conversão" :
                             goal.category === "retention" ? "Retenção" :
                             goal.category === "ticket" ? "Ticket médio" :
                             goal.category === "deals" ? "Negócios" : "Personalizada"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(goal.category)}
                        <span className="capitalize text-xs sm:text-sm">
                          {goal.category === "revenue" ? "Receita" :
                           goal.category === "leads" ? "Leads" :
                           goal.category === "conversion" ? "Conversão" :
                           goal.category === "retention" ? "Retenção" :
                           goal.category === "ticket" ? "Ticket médio" :
                           goal.category === "deals" ? "Negócios" : "Personalizada"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                      {formatDateRange(goal.startDate, goal.endDate)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-xs sm:text-sm">
                          {formatValue(goal.currentValue, goal.category)}
                        </span>
                        
                        {goal.isAutoCalculated && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Database className="h-3 w-3 text-blue-500 ml-1" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Valor automático de: {dataSourceName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {!goal.isAutoCalculated && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <HandCoins className="h-3 w-3 text-gray-400 ml-1" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Valor definido manualmente</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm">
                      {formatValue(goal.targetValue, goal.category)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium whitespace-nowrap">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(goal.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 sm:w-40">
                          <DropdownMenuItem onClick={() => onEdit(goal)}>
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            <span className="text-xs sm:text-sm">Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => confirmDelete(goal.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            <span className="text-xs sm:text-sm">Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!goalToDelete} onOpenChange={(open) => !open && setGoalToDelete(null)}>
        <AlertDialogContent className="mx-4 sm:mx-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente esta meta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="text-sm">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 text-sm">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}