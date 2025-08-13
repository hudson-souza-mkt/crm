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

            <div className="mt-4 border-2 border-red-500 p-4">
              <p className="text-red-600 font-bold mb-4">
                CONTAINER DAS ABAS - Se você vê este texto, o container funciona
              </p>
              
              <TabsContent value="info" className="border-2 border-green-500 p-4">
                <h1 className="text-4xl font-bold text-green-600">
                  TESTE INFORMAÇÕES - VOCÊ VÊ ESTE TEXTO?
                </h1>
                <p className="text-2xl text-black">Nome do Lead: {lead.name}</p>
                <p className="text-2xl text-black">Etapa: {lead.stage}</p>
                <div className="w-full h-20 bg-green-500 mt-4">
                  <p className="text-white text-xl p-4">BLOCO VERDE - VOCÊ VÊ ISTO?</p>
                </div>
              </TabsContent>

              <TabsContent value="history" className="border-2 border-blue-500 p-4">
                <h1 className="text-4xl font-bold text-blue-600">
                  TESTE HISTÓRICO - VOCÊ VÊ ESTE TEXTO?
                </h1>
                <div className="w-full h-20 bg-blue-500 mt-4">
                  <p className="text-white text-xl p-4">BLOCO AZUL - VOCÊ VÊ ISTO?</p>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="border-2 border-purple-500 p-4">
                <h1 className="text-4xl font-bold text-purple-600">
                  TESTE ATIVIDADES - VOCÊ VÊ ESTE TEXTO?
                </h1>
                <div className="w-full h-20 bg-purple-500 mt-4">
                  <p className="text-white text-xl p-4">BLOCO ROXO - VOCÊ VÊ ISTO?</p>
                </div>
              </TabsContent>

              <TabsContent value="files" className="border-2 border-orange-500 p-4">
                <h1 className="text-4xl font-bold text-orange-600">
                  TESTE ARQUIVOS - VOCÊ VÊ ESTE TEXTO?
                </h1>
                <div className="w-full h-20 bg-orange-500 mt-4">
                  <p className="text-white text-xl p-4">BLOCO LARANJA - VOCÊ VÊ ISTO?</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}