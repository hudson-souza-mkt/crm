import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  lead
}: PipelineCardModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  console.log('🚨 MODAL RENDERIZANDO');
  console.log('🚨 Open:', open);
  console.log('🚨 Lead:', lead);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            TESTE MÍNIMO - {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', fontSize: '20px' }}>
          🚨 VOCÊ VÊ ESTE TEXTO VERMELHO?
        </div>

        <div style={{ border: '3px solid blue', padding: '20px' }}>
          <h1 style={{ fontSize: '24px', color: 'blue' }}>
            TESTE BÁSICO
          </h1>
          
          <div style={{ backgroundColor: 'yellow', padding: '10px', margin: '10px 0' }}>
            Tab ativa: {activeTab}
          </div>

          <div style={{ backgroundColor: 'green', padding: '10px', margin: '10px 0' }}>
            Nome do lead: {lead.name}
          </div>

          <button 
            onClick={() => {
              console.log('🔄 CLICOU NO BOTÃO');
              setActiveTab("info");
            }}
            style={{ 
              backgroundColor: 'purple', 
              color: 'white', 
              padding: '10px 20px',
              border: 'none',
              fontSize: '16px'
            }}
          >
            CLIQUE AQUI - TESTE
          </button>

          {activeTab === "info" && (
            <div style={{ backgroundColor: 'orange', padding: '20px', margin: '20px 0' }}>
              <h2 style={{ fontSize: '20px' }}>
                🎯 ABA INFO FUNCIONANDO!
              </h2>
              <p>Nome: {lead.name}</p>
              <p>Etapa: {lead.stage}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}