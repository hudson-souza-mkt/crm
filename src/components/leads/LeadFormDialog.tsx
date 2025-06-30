import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LeadSource } from "@/types/lead";
import { mockLeads } from "./LeadList";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(8, "Telefone inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  company: z.string().optional(),
  document: z.string().optional(),
  source: z.enum(["chat", "manual", "import", "webhook"], {
    required_error: "A origem é obrigatória.",
  }),
  funnel: z.string().optional(),
  stage: z.string().optional(),
  value: z.number().optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: any; // Optional lead for editing
  onSubmit?: (values: FormValues) => void; // Novo prop para receber dados do form
}

const sourceOptions: { value: LeadSource; label: string }[] = [
    { value: "manual", label: "Manual" },
    { value: "chat", label: "Chat" },
    { value: "import", label: "Importação" },
    { value: "webhook", label: "Sistema Externo" },
];

export function LeadFormDialog({ open, onOpenChange, lead, onSubmit }: LeadFormDialogProps) {
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: lead ? {
      name: lead.name,
      phone: lead.phone,
      email: lead.email || "",
      company: lead.company || "",
      document: lead.document || "",
      source: lead.source || "manual",
      funnel: lead.funnel || "",
      stage: lead.stage || "",
      value: lead.value || undefined,
      notes: lead.notes || "",
      assignedTo: lead.assignedTo || "",
    } : {
      name: "",
      phone: "",
      email: "",
      company: "",
      document: "",
      source: "manual",
      funnel: "",
      stage: "",
      notes: "",
      assignedTo: "",
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    // Verificar duplicação (mockado, em um app real seria no banco)
    const isDuplicate = mockLeads.some(
      existingLead => {
        if (lead && existingLead.id === lead.id) {
          return false; // Don't compare the lead against itself when editing
        }
        const phoneMatch = values.phone && existingLead.phone === values.phone;
        const documentMatch = values.document && existingLead.document && existingLead.document === values.document;
        return phoneMatch || documentMatch;
      }
    );

    if (isDuplicate) {
      toast.error("Já existe um contato com este telefone ou documento.");
      return;
    }

    // Se o prop onSubmit foi fornecido, chamá-lo com os valores
    if (onSubmit) {
      onSubmit(values);
    } else {
      console.log(values);
      // Aqui salvaríamos o lead no banco de dados
      toast.success(lead ? "Lead atualizado com sucesso!" : "Lead criado com sucesso!");
      onOpenChange(false);
    }
    
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{lead ? "Editar Lead" : "Novo Lead"}</DialogTitle>
          <DialogDescription>
            {lead 
              ? "Atualize os dados do lead existente."
              : "Adicione um novo lead ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sourceOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="funnel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funil</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um funil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aquisicao">Aquisição e Qualificação</SelectItem>
                        <SelectItem value="vendas">Funil de Vendas</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etapa</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma etapa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="novo">Novo Lead</SelectItem>
                        <SelectItem value="qualificacao">Qualificação</SelectItem>
                        <SelectItem value="conversando">Conversando</SelectItem>
                        <SelectItem value="proposta">Proposta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Adicione notas ou observações sobre este lead"
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{lead ? "Salvar alterações" : "Criar lead"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}