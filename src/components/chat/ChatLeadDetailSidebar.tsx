import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, User, Tag, List, ExternalLink } from "lucide-react";
import type { Lead } from "@/components/pipeline/PipelineCard";

const InfoField = ({ label, value, placeholder, link }: { label: string, value?: string, placeholder: string, link?: string }) => (
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

interface ChatLeadDetailSidebarProps {
  lead: Lead;
}

export function ChatLeadDetailSidebar({ lead }: ChatLeadDetailSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-gray-50">
      <div className="p-6 border-b">
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
          <span>{lead.salesperson}</span>
        </div>
      </div>

      <Tabs defaultValue="perfil" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 px-4 flex-shrink-0">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="endereco">Endereço</TabsTrigger>
          <TabsTrigger value="campos">Campos</TabsTrigger>
          <TabsTrigger value="utms">UTMs</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-y-auto p-6">
          <TabsContent value="perfil" className="space-y-4 mt-0">
            <InfoField label="Nome" value={lead.name} placeholder="Informe o nome" />
            <InfoField label="Empresa" value={lead.company} placeholder="Informe a empresa do lead" />
            <InfoField label="E-mail" value="joao.silva@example.com" placeholder="Informe o e-mail" />
            <InfoField label="Telefone" value={lead.phone} placeholder="Informe o telefone" />
            <InfoField label="Instagram" value="joao.silva.mkt" placeholder="Informe o Instagram" link="https://instagram.com/joao.silva.mkt" />
          </TabsContent>
          <TabsContent value="endereco" className="mt-0">
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum endereço informado.</p>
          </TabsContent>
          <TabsContent value="campos" className="mt-0">
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum campo adicional.</p>
          </TabsContent>
          <TabsContent value="utms" className="space-y-4 mt-0">
            <InfoField label="utm_source" value={lead.utms?.utm_source} placeholder="Não informado" />
            <InfoField label="utm_medium" value={lead.utms?.utm_medium} placeholder="Não informado" />
            <InfoField label="utm_campaign" value={lead.utms?.utm_campaign} placeholder="Não informado" />
            <InfoField label="utm_term" value={lead.utms?.utm_term} placeholder="Não informado" />
            <InfoField label="utm_content" value={lead.utms?.utm_content} placeholder="Não informado" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}