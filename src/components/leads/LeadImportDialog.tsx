import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";

interface LeadImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadImportDialog({ open, onOpenChange }: LeadImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    // Em um app real, isso baixaria um template CSV
    toast.success("Template de importação baixado!");
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Por favor selecione um arquivo para importar");
      return;
    }

    setUploading(true);
    
    // Simula o processo de upload
    setTimeout(() => {
      setUploading(false);
      toast.success(`${file.name} importado com sucesso!`);
      setFile(null);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importar Leads</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV ou Excel com sua lista de leads.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm mb-2">
              Arraste e solte seu arquivo aqui ou
            </p>
            <div className="flex justify-center">
              <Label 
                htmlFor="file-upload" 
                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
              >
                <span>Selecione um arquivo</span>
                <Input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground mt-2">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Formatos suportados: CSV, Excel (.xlsx, .xls)</p>
            <p className="mt-1">Máximo 1000 leads por importação</p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm font-normal mt-2"
              onClick={handleDownloadTemplate}
            >
              <Download className="h-3 w-3 mr-1" />
              Baixar template de importação
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || uploading}>
            {uploading ? "Importando..." : "Importar Leads"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}