import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealInfo } from "@/components/deals/DealInfo";
import type { Lead } from "@/pages/Leads"; // Usando a interface da página de Leads
import { User, Building, Phone, Calendar, UserCheck, Info } from "lucide-react";

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | React.ReactNode }) => (
  <div className="flex items-center gap-3 py-2 border-b">
    <Icon className="h-5 w-5 text-muted-foreground" />
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      {value && <p className="font-medium text-sm">{value}</p>}
    </div>
  </div>
);

export function LeadDetailDialog({ lead, open, onOpenChange }: LeadDetailDialogProps) {
  if (!lead) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
          <DialogDescription>
            Gerencie todos os detalhes deste lead e do negócio associado.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Informações Gerais</TabsTrigger>
              <TabsTrigger value="deal">Detalhes do Negócio</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Resumo do Lead</h3>
                <div className="space-y-2">
                    <DetailItem icon={User} label="Nome do Lead" value={lead.name} />
                    <DetailItem icon={Building} label="Empresa" value={lead.company} />
                    <DetailItem icon={Phone} label="Telefone" value={lead.phone} />
                    <DetailItem icon={Info} label="Documento" value={lead.document} />
                    <DetailItem icon={UserCheck} label="Vendedor Responsável" value={lead.salesperson} />
                    <DetailItem icon={Calendar} label="Data de Criação" value={lead.date} />
                </div>
            </TabsContent>
            <TabsContent value="deal" className="mt-4">
              <DealInfo deal={lead} />
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <p>Aqui ficará o histórico de alterações do lead e do negócio.</p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}