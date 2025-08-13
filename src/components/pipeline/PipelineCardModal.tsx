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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {lead.name} - {lead.stage}
          </DialogTitle>
        </DialogHeader>

        {/* Navegação Simples */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Informações do Negócio
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "activities"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Atividades
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "files"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Arquivos
            </button>
          </nav>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "info" && (
            <div className="space-y-6">
              {/* Header de Teste */}
              <div className="bg-green-100 border-2 border-green-500 p-6 rounded-lg">
                <h1 className="text-3xl font-bold text-green-800 mb-2">
                  🎉 FUNCIONOU! INFORMAÇÕES DO NEGÓCIO
                </h1>
                <p className="text-green-700 text-lg">
                  Finalmente! A aba está renderizando corretamente.
                </p>
              </div>

              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 text-blue-800">👤 Informações do Cliente</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Nome:</span> {lead.name}
                    </div>
                    <div>
                      <span className="font-medium">Telefone:</span> {lead.phone || "Não informado"}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {lead.email || "Não informado"}
                    </div>
                    <div>
                      <span className="font-medium">Empresa:</span> {lead.company || "Não informado"}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 text-green-800">💰 Detalhes do Negócio</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Valor:</span> R$ {lead.value || 0}
                    </div>
                    <div>
                      <span className="font-medium">Etapa:</span> {lead.stage}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {lead.status || "Ativo"}
                    </div>
                    <div>
                      <span className="font-medium">Origem:</span> {lead.source || "Manual"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-purple-800">📅 Datas Importantes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium">Criado em:</span><br />
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('pt-BR') : "Não informado"}
                  </div>
                  <div>
                    <span className="font-medium">Atualizado em:</span><br />
                    {lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString('pt-BR') : "Não informado"}
                  </div>
                  <div>
                    <span className="font-medium">Último contato:</span><br />
                    {lead.lastContact ? new Date(lead.lastContact).toLocaleDateString('pt-BR') : "Não informado"}
                  </div>
                </div>
              </div>

              {/* Tags e Observações */}
              {(lead.tags?.length > 0 || lead.notes) && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 text-yellow-800">🏷️ Tags e Observações</h3>
                  
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="mb-4">
                      <span className="font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lead.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {lead.notes && (
                    <div>
                      <span className="font-medium">Observações:</span>
                      <div className="mt-2 p-3 bg-white rounded border">
                        {lead.notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ações */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">⚡ Ações Rápidas</h3>
                <div className="flex gap-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Voltar Etapa
                  </button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Avançar Etapa
                  </button>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    Editar Lead
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">📊 Histórico</h2>
              <p className="text-blue-700">Histórico de mudanças do lead será implementado aqui...</p>
            </div>
          )}

          {activeTab === "activities" && (
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-green-800 mb-4">🎯 Atividades</h2>
              <p className="text-green-700">Lista de atividades será implementada aqui...</p>
            </div>
          )}

          {activeTab === "files" && (
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">📁 Arquivos</h2>
              <p className="text-purple-700">Arquivos anexados serão listados aqui...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}