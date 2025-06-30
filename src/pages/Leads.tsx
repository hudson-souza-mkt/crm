import { useState } from "react";
import { LeadList } from "@/components/leads/LeadList";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { LeadImportDialog } from "@/components/leads/LeadImportDialog";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Filter } from "lucide-react";

export default function Leads() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Leads e Clientes</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setFilterOpen(!filterOpen)}
            className="gap-1"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setImportDialogOpen(true)}
            className="gap-1"
          >
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Novo Lead
          </Button>
        </div>
      </div>

      <LeadList filterOpen={filterOpen} />
      
      <LeadFormDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
      />
      
      <LeadImportDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen} 
      />
    </div>
  );
}