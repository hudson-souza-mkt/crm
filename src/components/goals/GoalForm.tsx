import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
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
import type { Goal, GoalCategory, GoalPeriod, GoalStatus } from "@/pages/Goals";

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
  currentValue: z.coerce.number().min(0, {
    message: "O valor atual não pode ser negativo.",
  }),
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
}

export function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "revenue",
      targetValue: 0,
      currentValue: 0,
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

  // Preencher o formulário com valores existentes quando editando
  useEffect(() => {
    if (goal) {
      form.reset({
        title: goal.title,
        description: goal.description || "",
        category: goal.category,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
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

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      title: values.title,
      description: values.description,
      category: values.category as GoalCategory,
      targetValue: values.targetValue,
      currentValue: values.currentValue,
      startDate: values.dateRange.from,
      endDate: values.dateRange.to,
      period: values.period as GoalPeriod,
      status: values.status as GoalStatus,
      responsible: values.responsible,
      team: values.team,
      id: goal?.id || "",
      createdAt: goal?.createdAt || new Date(),
      updatedAt: new Date(),
    });
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Atual</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Progresso atual desta meta.
                  </FormDescription>
                  <FormMessage />
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