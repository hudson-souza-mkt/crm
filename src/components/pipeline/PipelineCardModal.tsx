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

  console.log('🔍 Modal aberto:', open);
  console.log('🔍 Lead recebido:', lead);
  console.log('🔍 Tab ativa:', activeTab);

  const renderTabContent = () => {
    console.log('🎯 Renderizando conteúdo para tab:', activeTab);
    
    if (activeTab === "info") {
      console.log('✅ Entrando na aba INFO');
      try {
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">TESTE - Informações do Negócio</h1>
            
            <div className="space-y-4">
              <div className="bg-blue-100 p-4 rounded">
                <h2 className="font-bold">Nome do Lead:</h2>
                <p>{lead?.name || 'Nome não encontrado'}</p>
              </div>
              
              <div className="bg-green-100 p-4 rounded">
                <h2 className="font-bold">Etapa:</h2>
                <p>{lead?.stage || 'Etapa não encontrada'}</p>
              </div>
              
              <div className="bg-yellow-100 p-4 rounded">
                <h2 className="font-bold">Valor:</h2>
                <p>R$ {lead?.value || 0}</p>
              </div>
              
              <div className="bg-purple-100 p-4 rounded">
                <h2 className="font-bold">Empresa:</h2>
                <p>{lead?.company || 'Não informado'}</p>
              </div>
              
              <div className="bg-red-100 p-4 rounded">
                <h2 className="font-bold">Telefone:</h2>
                <p>{lead?.phone || 'Não informado'}</p>
              </div>
              
              <div className="bg-indigo-100 p-4 rounded">
                <h2 className="font-bold">Email:</h2>
                <p>{lead?.email || 'Não informado'}</p>
              </div>
            </div>
          </div>
        );
      } catch (error) {
        console.error('❌ Erro ao renderizar aba INFO:', error);
        return (
          <div className="p-6">
            <h1 className="text-red-600 font-bold">ERRO ao renderizar aba INFO</h1>
            <p>Verifique o console para detalhes</p>
          </div>
        );
      }
    }
    
    if (activeTab === "history") {
      console.log('✅ Entrando na aba HISTORY');
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Histórico</h1>
          <p>Conteúdo do histórico...</p>
        </div>
      );
    }
    
    if (activeTab === "activities") {
      console.log('✅ Entrando na aba ACTIVITIES');
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-600">Atividades</h1>
          <p>Conteúdo das atividades...</p>
        </div>
      );
    }
    
    if (activeTab === "files") {
      console.log('✅ Entrando na aba FILES');
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-orange-600">Arquivos</h1>
          <p>Conteúdo dos arquivos...</p>
        </div>
      );
    }
    
    console.log('❌ Tab não reconhecida:', activeTab);
    return (
      <div className="p-6">
        <h1 className="text-red-600 font-bold">Tab não encontrada: {activeTab}</h1>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead?.name || 'Lead sem nome'}
            <Badge variant="outline">
              {lead?.stage || 'Sem etapa'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Debug Info */}
        <div className="bg-yellow-100 p-2 text-sm">
          <strong>DEBUG:</strong> Tab ativa = "{activeTab}" | Lead = {lead?.name || 'undefined'}
        </div>

        {/* Navegação das Abas */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => {
                console.log('🔄 Clicando em INFO');
                setActiveTab("info");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "info"
                  ? "border-primary text-primary bg-blue-50"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Informações do Negócio
            </button>
            <button
              onClick={() => {
                console.log('🔄 Clicando em HISTORY');
                setActiveTab("history");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-primary text-primary bg-blue-50"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => {
                console.log('🔄 Clicando em ACTIVITIES');
                setActiveTab("activities");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "activities"
                  ? "border-primary text-primary bg-blue-50"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Atividades
            </button>
            <button
              onClick={() => {
                console.log('🔄 Clicando em FILES');
                setActiveTab("files");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "files"
                  ? "border-primary text-primary bg-blue-50"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Arquivos
            </button>
          </div>
        </div>

        {/* Container do Conteúdo */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="bg-red-100 p-2 text-sm">
            <strong>CONTAINER:</strong> Você vê esta barra vermelha?
          </div>
          {renderTabContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}