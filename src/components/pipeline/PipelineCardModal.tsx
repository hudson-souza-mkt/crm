import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  // Renderizar conteúdo baseado na aba ativa
  const renderTabContent = () => {
    console.log('🎯 Renderizando aba:', activeTab);
    
    switch (activeTab) {
      case "info":
        console.log('📋 Renderizando aba INFO');
        return (
          <div style={{ padding: '20px', backgroundColor: '#f0f0f0', border: '3px solid red' }}>
            <h1 style={{ fontSize: '24px', color: 'red', fontWeight: 'bold' }}>
              🎯 ABA INFORMAÇÕES FUNCIONANDO!
            </h1>
            <p style={{ fontSize: '18px', color: 'blue' }}>
              Nome: {lead.name}
            </p>
            <p style={{ fontSize: '18px', color: 'green' }}>
              Etapa: {lead.stage}
            </p>
            <div style={{ width: '100%', height: '50px', backgroundColor: 'yellow', marginTop: '10px' }}>
              <p style={{ padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                BLOCO AMARELO - VOCÊ VÊ ISTO?
              </p>
            </div>
          </div>
        );

      case "history":
        console.log('📋 Renderizando aba HISTORY');
        return (
          <div style={{ padding: '20px', backgroundColor: '#e0f0ff', border: '3px solid blue' }}>
            <h1 style={{ fontSize: '24px', color: 'blue', fontWeight: 'bold' }}>
              📋 ABA HISTÓRICO FUNCIONANDO!
            </h1>
            <p>Histórico de mudanças...</p>
          </div>
        );

      case "activities":
        console.log('📋 Renderizando aba ACTIVITIES');
        return (
          <div style={{ padding: '20px', backgroundColor: '#f0e0ff', border: '3px solid purple' }}>
            <h1 style={{ fontSize: '24px', color: 'purple', fontWeight: 'bold' }}>
              ⚡ ABA ATIVIDADES FUNCIONANDO!
            </h1>
            <p>Lista de atividades...</p>
          </div>
        );

      case "files":
        console.log('📋 Renderizando aba FILES');
        return (
          <div style={{ padding: '20px', backgroundColor: '#ffe0d0', border: '3px solid orange' }}>
            <h1 style={{ fontSize: '24px', color: 'orange', fontWeight: 'bold' }}>
              📁 ABA ARQUIVOS FUNCIONANDO!
            </h1>
            <p>Arquivos anexados...</p>
          </div>
        );

      default:
        console.log('❌ Aba não encontrada:', activeTab);
        return (
          <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
            <h1>ERRO: Aba não encontrada</h1>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
            <Badge variant="outline">
              {lead.stage}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Debug Info */}
        <div style={{ padding: '10px', backgroundColor: 'lightblue', border: '1px solid blue' }}>
          <p><strong>Debug:</strong> Tab ativa = {activeTab}</p>
          <p><strong>Lead:</strong> {lead.name}</p>
        </div>

        {/* Navegação Manual das Abas */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => {
                console.log('🔄 Clicou em INFO');
                setActiveTab("info");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "info"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Informações do Negócio
            </button>
            <button
              onClick={() => {
                console.log('🔄 Clicou em HISTORY');
                setActiveTab("history");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => {
                console.log('🔄 Clicou em ACTIVITIES');
                setActiveTab("activities");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "activities"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Atividades
            </button>
            <button
              onClick={() => {
                console.log('🔄 Clicou em FILES');
                setActiveTab("files");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "files"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Arquivos
            </button>
          </div>
        </div>

        {/* Conteúdo da Aba */}
        <div className="flex-1 overflow-y-auto" style={{ border: '2px solid green', minHeight: '200px' }}>
          <div style={{ padding: '10px', backgroundColor: 'lightyellow' }}>
            <p><strong>CONTAINER DO CONTEÚDO - Você vê isto?</strong></p>
          </div>
          {renderTabContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}