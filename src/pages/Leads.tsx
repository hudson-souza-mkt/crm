import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Filter } from "lucide-react";
import { LeadList } from "@/components/leads/LeadList";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { LeadImportDialog } from "@/components/leads/LeadImportDialog";
import { LeadSegmentsNav } from "@/components/leads/LeadSegmentsNav";
import { Lead } from "@/types/lead";

export default function Leads() {
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [activeSegment, setActiveSegment] = useState("all");

  const createLeadMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company,
        source: formData.source,
        value: formData.value,
        notes: formData.notes,
        status: 'new',
        user_id: user.id,
      });

      if (error) {
        console.error("Erro do Supabase ao inserir lead:", error);
        throw new Error(error.message || "Erro desconhecido ao criar lead");
      }
    },
    onSuccess: () => {
      toast.success("Lead criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setAddDialogOpen(false);
    },
    onError: (err: any) => {
      console.error("Erro na mutação createLeadMutation:", err);
      toast.error(`Falha ao criar lead: ${err.message || 'Ocorreu um erro.'}`);
    },
  });

  const handleNewLead = () => {
    setEditingLead(null);
    setAddDialogOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setAddDialogOpen(true);
  };

  const handleSubmitLeadForm = (values: any) => {
    // TODO: Adicionar lógica para ATUALIZAR um lead existente
    createLeadMutation.mutate(values);
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 border-r p-4 bg-card">
        <LeadSegmentsNav activeSegment={activeSegment} setActiveSegment={setActiveSegment} />
      </aside>
      <main className="flex-1 p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Leads e Clientes</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button onClick={handleNewLead}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Lead
            </Button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
            <Filter className="mr-2 h-4 w-4" />
            {filterOpen ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <LeadList filterOpen={filterOpen} onLeadClick={handleEditLead} />
        </div>

        <LeadFormDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          lead={editingLead}
          onSubmit={handleSubmitLeadForm}
        />

        <LeadImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
        />
      </main>
    </div>
  );
}