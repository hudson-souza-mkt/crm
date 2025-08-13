import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import type { Lead } from "@/components/pipeline/PipelineCard";

interface PipelineCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onStageChange?: (leadId: string, newStage: string) => void;
  onLeadUpdate?: (leadId: string, updates: Partial<Lead>) => void;
}

export function PipelineCardModal({
  open,
  onOpenChange,
  lead,
  onStageChange,
  onLeadUpdate
}: PipelineCardModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  console.log('🔍 Modal Debug:');
  console.log('- Modal aberto:', open);
  console.log('- Lead:', lead);
  console.log('- Tab ativa:', activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
            <Badge variant="outline">
              {lead.stage}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="activities">Atividades</TabsTrigger>
              <TabsTrigger value="files">Arquivos</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="info">
                <div className="p-4 bg-green-100 rounded-lg">
                  <h2 className="text-xl font-bold text-green-800 mb-4">✅ Informações do Negócio</h2>
                  <div className="space-y-2">
                    <p><strong>Nome:</strong> {lead.name}</p>
                    <p><strong>Empresa:</strong> {lead.company || 'N/A'}</p>
                    <p><strong>Telefone:</strong> {lead.phone || 'N/A'}</p>
                    <p><strong>Email:</strong> {lead.email || 'N/A'}</p>
                    <p><strong>Etapa:</strong> {lead.stage}</p>
                    <p><strong>Valor:</strong> R$ {(lead.value || 0).toLocaleString('pt-BR')}</p>
                    <p><strong>Responsável:</strong> {lead.assignedTo || 'N/A'}</p>
                  </div>
                  
                  {onStageChange && (
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => onStageChange(lead.id, "Qualificação")}
                      >
                        Mover para Qualificação
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onStageChange(lead.id, "Proposta")}
                      >
                        Mover para Proposta
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="p-4 bg-blue-100 rounded-lg">
                  <h2 className="text-xl font-bold text-blue-800">📋 Histórico</h2>
                  <p>Histórico de mudanças do lead...</p>
                </div>
              </TabsContent>

              <TabsContent value="activities">
                <div className="p-4 bg-purple-100 rounded-lg">
                  <h2 className="text-xl font-bold text-purple-800">⚡ Atividades</h2>
                  <p>Lista de atividades...</p>
                </div>
              </TabsContent>

              <TabsContent value="files">
                <div className="p-4 bg-orange-100 rounded-lg">
                  <h2 className="text-xl font-bold text-orange-800">📁 Arquivos</h2>
                  <p>Arquivos anexados...</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}