import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag, X } from "lucide-react";
import type { Deal } from "./DealInfo";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const dealSchema = z.object({
  name: z.string().min(3, "O nome é obrigatório."),
  value: z.coerce.number().min(0, "O valor não pode ser negativo."),
  stage: z.string(),
  salesperson: z.string().min(1, "O vendedor é obrigatório."),
  priority: z.enum(["red", "green"]).optional(),
  tags: z.array(z.string()),
  phone: z.string().optional(),
  document: z.string().optional(),
  company: z.string().min(1, "O nome da empresa é obrigatório."),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface DealFormProps {
  deal: Deal;
  onSave: (deal: Deal) => void;
  onCancel: () => void;
}

export function DealForm({ deal, onSave, onCancel }: DealFormProps) {
  const [tagInput, setTagInput] = useState("");

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: deal.name,
      value: deal.value || 0,
      stage: deal.stage,
      salesperson: deal.salesperson,
      priority: deal.priority,
      tags: deal.tags || [],
      phone: deal.phone,
      document: deal.document,
      company: deal.company,
    },
  });

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...form.getValues("tags"), tagInput.trim()];
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = form.getValues("tags").filter(tag => tag !== tagToRemove);
    form.setValue("tags", newTags);
  };

  const onSubmit = (values: DealFormValues) => {
    const updatedDeal: Deal = {
      ...deal,
      name: values.name,
      value: values.value,
      stage: values.stage,
      salesperson: values.salesperson,
      priority: values.priority,
      tags: values.tags,
      phone: values.phone,
      document: values.document,
      company: values.company,
    };
    onSave(updatedDeal);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Contato</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etapa do Funil</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Novo Lead">Novo Lead</SelectItem>
                      <SelectItem value="Qualificação">Qualificação</SelectItem>
                      <SelectItem value="Apresentação">Apresentação</SelectItem>
                      <SelectItem value="Proposta">Proposta</SelectItem>
                      <SelectItem value="Negociação">Negociação</SelectItem>
                      <SelectItem value="Ganho">Ganho</SelectItem>
                      <SelectItem value="Perdido">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="salesperson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendedor Responsável</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Amanda Vendas">Amanda Vendas</SelectItem>
                      <SelectItem value="Carlos Almeida">Carlos Almeida</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="green">Normal</SelectItem>
                      <SelectItem value="red">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento (CPF/CNPJ)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {field.value.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Pressione Enter para adicionar uma tag"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </Form>
  );
}