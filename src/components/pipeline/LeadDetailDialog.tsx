import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, User, Tag, List, Briefcase, Plus, ExternalLink } from "lucide-react";
import type { Lead } from "@/types/lead";

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InfoField = ({ label, value, placeholder, link }: { label: string, value?: string | null, placeholder: string, link?: string }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    {value ? (
      <div className="flex items-center justify-between group">
        <p className="text-sm text-gray-800">{value}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary" />
          </a>
        )}
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">{placeholder}</p>
    )}
  </div>
);

export function LeadDetailDialog({ lead, open, onOpenChange }: LeadDetailDialogProps) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <div className="flex h-full flex-col bg-gray-50">
          <div className="p-6 border-b bg-white">
            <div className="relative w-24 h-24 mx-auto">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                  {lead.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold text-center mt-4">{lead.name}</h2>
            <p className="text-sm text-muted-foreground text-center">{lead.company || "Sem empresa"}</p>
            
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start text-muted-foreground">
                <Tag className="h-4 w-4 mr-2" /> Adicionar tags
              </Button>
              <Button variant="outline" className="w-full justify-start text-muted-foreground">
                <List className="h-4 w-4 mr-2" /> Adicionar listas
              </Button>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              <span>{lead.assignedTo || "Sem responsável"}</span>
            </div>
          </div>

          <div className="p-6">
            <Tabs defaultValue="perfil">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="campos">Campos</TabsTrigger>
                <TabsTrigger value="utms">UTMs</TabsTrigger>
              </TabsList>
              <TabsContent value="perfil" className="space-y-4 mt-6">
                <InfoField label="Nome" value={lead.name} placeholder="Informe o nome" />
                <InfoField label="Empresa" value={lead.company} placeholder="Informe a empresa do lead" />
                <InfoField label="E-mail" value={lead.email} placeholder="Informe o e-mail" />
                <InfoField label="Telefone" value={lead.phone} placeholder="Informe o telefone" />
                <InfoField label="Documento (CPF/CNPJ)" value={lead.document} placeholder="Não informado" />
              </TabsContent>
              <TabsContent value="endereco" className="mt-6">
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum endereço informado.</p>
              </TabsContent>
              <TabsContent value="campos" className="mt-6">
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum campo adicional.</p>
              </TabsContent>
              <TabsContent value="utms" className="space-y-4 mt-6">
                <InfoField label="utm_source" value={lead.utms?.utm_source} placeholder="Não informado" />
                <InfoField label="utm_medium" value={lead.utms?.utm_medium} placeholder="Não informado" />
                <InfoField label="utm_campaign" value={lead.utms?.utm_campaign} placeholder="Não informado" />
                <InfoField label="utm_term" value={lead.utms?.utm_term} placeholder="Não informado" />
                <InfoField label="utm_content" value={lead.utms?.utm_content} placeholder="Não informado" />
              </TabsContent>
            </Tabs>
          </div>

          <div className="px-6 pb-6 border-t">
            <h3 className="font-semibold my-4">Negócios</h3>
            <div className="text-center py-8 text-muted-foreground bg-white rounded-lg border">
              <Briefcase className="mx-auto h-10 w-10 mb-2" />
              <p className="mb-4">Nenhum negócio ativo.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Negócio
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}