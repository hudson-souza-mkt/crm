import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Database, HandCoins } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Goal, GoalCategory, GoalPeriod, GoalStatus, DataSource } from "@/pages/Goals";

// Schema atualizado para incluir opções de fonte de dados
const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres.",
  }),
  description: z.string().optional(),
  category: z.enum(["revenue", "leads", "conversion", "retention", "ticket", "deals", "custom"], {
    required_error: "Selecione uma categoria.",
  }),
  targetValue: z.coerce.number().positive({
    message: "O valor da meta deve ser positivo.",
  }),
  valueSource: z.enum(["manual", "auto"], {
    required_error: "Selecione a fonte do valor atual.",
  }),
  currentValue: z.coerce.number().min(0, {
    message: "O valor atual não pode ser negativo.",
  }).optional(),
  dataSourceId: z.string().optional(),
  period: z.enum(["monthly", "quarterly", "yearly"], {
    required_error: "Selecione um período.",
  }),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  status: z.enum(["active", "completed", "overdue"], {
    required_error: "Selecione um status.",
  }),
  responsible: z.string().optional(),
  team: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GoalFormProps {
  goal?: Goal | null;
  onSubmit: (values: Omit<Goal, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  dataSources: DataSource[];
}

export function GoalForm({ goal, onSubmit, onCancel, dataSources }: GoalFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory>("revenue");
  
  // Filtrar fontes de dados compatíveis com a categoria selecionada
  const compatibleDataSources = dataSources.filter(ds => 
    ds.category.includes(selectedCategory as GoalCategory)
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "revenue",
      targetValue: 0,
      valueSource: "manual",
      currentValue: 0,
      dataSourceId: "",
      period: "monthly",
      dateRange: {
        from: new Date(),
        to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
      status: "active",
      responsible: "",
      team: "",
    },
  });

  // Atualizar a lista de fontes compatíveis quando a categoria muda
  const watchCategory = form.watch("category");
  useEffect(() => {
    setSelectedCategory(watchCategory as GoalCategory);
  }, [watchCategory]);

  // Preencher o formulário com valores existentes quando editando
  useEffect(() => {
    if (goal) {
      form.reset({
        title: goal.title,
        description: goal.description || "",
        category: goal.category,
        targetValue: goal.targetValue,
        valueSource: goal.isAutoCalculated ? "auto" : "manual",
        currentValue: goal.isAutoCalculated ? undefined : goal.currentValue,
        dataSourceId: goal.dataSourceId,
        period: goal.period,
        dateRange: {
          from: goal.startDate,
          to: goal.endDate,
        },
        status: goal.status,
        responsible: goal.responsible || "",
        team: goal.team || "",
      });
    }
  }, [goal, form]);

  // Quando a fonte de valor muda, resetar campos relacionados
  const watchValueSource = form.watch("valueSource");
  useEffect(() => {
    if (watchValueSource === "manual") {
      form.setValue("dataSourceId", undefined);
    } else if (watchValueSource === "auto") {
      form.setValue("currentValue", undefined);
    }
  }, [watchValueSource, form]);

  // Atualizar o valor atual quando selecionar uma fonte de dados
  const watchDataSourceId = form.watch("dataSourceId");
  useEffect(() => {
    if (watchValueSource === "auto" && watchDataSourceId) {
      const selectedSource = dataSources.find(ds => ds.id === watchDataSourceId);
      if (selectedSource) {
        // Não definimos o currentValue no form, apenas mostramos o valor da fonte para referência
        // O valor real será atualizado dinamicamente da fonte de dados
      }
    }
  }, [watchDataSourceId, watchValueSource, dataSources, form]);

  const handleFormSubmit = (values: FormValues) => {
    // Determinar o valor atual com base na fonte selecionada
    let currentValue = 0;
    let isAutoCalculated = values.valueSource === "auto";
    
    if (isAutoCalculated && values.dataSourceId) {
      const dataSource = dataSources.find(ds => ds.id === values.dataSourceId);
      currentValue = dataSource ? dataSource.value : 0;
    } else if (values.currentValue !== undefined) {
      currentValue = values.currentValue;
    }
    
    onSubmit({
      title: values.title,
      description: values.description,
      category: values.category as GoalCategory,
      targetValue: values.targetValue,
      currentValue,
      startDate: values.dateRange.from,
      endDate: values.dateRange.to,
      period: values.period as GoalPeriod,
      status: values.status as GoalStatus,
      responsible: values.responsible,
      team: values.team,
      dataSourceId: values.dataSourceId,
      isAutoCalculated,
      id: goal?.id || "",
      createdAt: goal?.createdAt || new Date(),
      updatedAt: new Date(),
    });
  };

  // Renderizar o valor atual da fonte de dados selecionada
  const renderCurrentSourceValue = () => {
    if (watchValueSource === "auto" && watchDataSourceId) {
      const dataSource = dataSources.find(ds => ds.id === watchDataSourceId);
      if (dataSource) {
        const formattedValue = formatValue(dataSource.value, watchCategory as GoalCategory);
        return (
          <div className="mt-2 p-2 bg-muted rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Valor atual da fonte:</span>
              <span className="font-medium">{formattedValue}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{dataSource.description}</p>
          </div>
        );
      }
    }
    return null;
  };

  const formatValue = (value: number, category: GoalCategory) => {
    if (category === "revenue" || category === "ticket") {
      return `R$ ${value.toLocaleString('pt-BR')}`;
    }
    if (category === "conversion" || category === "retention") {
      return `${value}%`;
    }
    return value.toLocaleString('pt-BR');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Meta Mensal de Vendas" {...field} />
                  </FormControl>
                  <FormDescription>
                    Um nome claro e conciso para sua meta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o objetivo desta meta em detalhes..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="revenue">Receita</SelectItem>
                      <SelectItem value="leads">Leads</SelectItem>
                      <SelectItem value="conversion">Taxa de Conversão</SelectItem>
                      <SelectItem value="retention">Retenção</SelectItem>
                      <SelectItem value="ticket">Ticket Médio</SelectItem>
                      <SelectItem value="deals">Número de Negócios</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um período" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Meta</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Valor alvo a ser atingido.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Seleção de fonte do valor atual */}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="valueSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonte do Valor Atual</FormLabel>
                  <FormControl>
                    <Tabs 
                      value={field.value} 
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="manual" className="flex items-center gap-2">
                          <HandCoins className="h-4 w-4" />
                          Manual
                        </TabsTrigger>
                        <TabsTrigger value="auto" className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Automático
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="manual" className="pt-4">
                        <FormField
                          control={form.control}
                          name="currentValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Atual</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0" 
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormDescription>
                                Digite manualmente o valor atual desta meta.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      <TabsContent value="auto" className="pt-4">
                        <FormField
                          control={form.control}
                          name="dataSourceId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fonte de Dados do Sistema</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma fonte de dados" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {compatibleDataSources.length > 0 ? (
                                    compatibleDataSources.map(source => (
                                      <SelectItem key={source.id} value={source.id}>
                                        {source.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="none" disabled>
                                      Nenhuma fonte disponível para esta categoria
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                O valor será calculado automaticamente a partir dos dados do sistema.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {renderCurrentSourceValue()}
                      </TabsContent>
                    </Tabs>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Período da Meta</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "P", { locale: ptBR })} -{" "}
                              {format(field.value.to, "P", { locale: ptBR })}
                            </>
                          ) : (
                            format(field.value.from, "P", { locale: ptBR })
                          )
                        ) : (
                          <span>Selecione um período</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setDate(new Date().getDate() - 1))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Em andamento</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="overdue">Atrasada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipe</FormLabel>
                <FormControl>
                  <Input placeholder="Equipe responsável" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{goal ? "Atualizar Meta" : "Criar Meta"}</Button>
        </div>
      </form>
    </Form>
  );
}