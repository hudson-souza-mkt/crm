import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  DollarSign, 
  Calendar,
  Target,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";
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
  console.log('- Open:', open);
  console.log('- Lead:', lead);
  console.log('- Active Tab:', activeTab);

  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Não informado";
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  // Renderização FORÇADA da aba de informações
  const renderInfoTab = () => {
    console.log('🎯 RENDERIZANDO ABA INFO - FORÇADO');
    
    return (
      <div className="p-6 space-y-6">
        {/* Header de Debug */}
        <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-green-800">
            ✅ ABA INFORMAÇÕES FUNCIONANDO!
          </h1>
          <p className="text-green-700">
            Se você vê este texto, a aba está renderizando corretamente.
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(lead.value)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Etapa Atual</p>
                  <p className="text-xl font-bold text-blue-600">{lead.stage}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Origem</p>
                  <p className="text-lg font-bold text-purple-600">{lead.source || 'Manual'}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-lg font-bold text-amber-600">{lead.status || 'Ativo'}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                <p className="text-lg font-semibold">{lead.name}</p>
              </div>

              {lead.company && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                  <p className="text-sm flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    {lead.company}
                  </p>
                </div>
              )}

              {lead.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {lead.phone}
                  </p>
                </div>
              )}

              {lead.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {lead.email}
                  </p>
                </div>
              )}

              {lead.assignedTo && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                  <p className="text-sm">{lead.assignedTo}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detalhes do Negócio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Detalhes do Negócio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Valor do Negócio</label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(lead.value)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Etapa Atual</label>
                <Badge variant="outline" className="ml-2 text-lg px-3 py-1">
                  {lead.stage}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-sm">{lead.status || "Ativo"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Origem</label>
                <p className="text-sm">{lead.source || "Manual"}</p>
              </div>

              {lead.funnel && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Funil</label>
                  <p className="text-sm">{lead.funnel}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Datas Importantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Datas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                <p className="text-sm font-semibold">{formatDate(lead.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                <p className="text-sm font-semibold">{formatDate(lead.updatedAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Último contato</label>
                <p className="text-sm font-semibold">{formatDate(lead.lastContact)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags e Observações */}
        {(lead.tags?.length > 0 || lead.notes) && (
          <Card>
            <CardHeader>
              <CardTitle>Tags e Observações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.tags && lead.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {lead.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {lead.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observações</label>
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{lead.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        {onStageChange && (
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => console.log('Voltar etapa clicado')}
                >
                  Voltar Etapa
                </Button>
                <Button 
                  size="sm"
                  onClick={() => console.log('Avançar etapa clicado')}
                >
                  Avançar Etapa
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Renderização do conteúdo baseado na aba
  const renderContent = () => {
    console.log('🎯 Renderizando conteúdo para tab:', activeTab);
    
    // FORÇA a renderização da aba info
    if (activeTab === "info") {
      return renderInfoTab();
    }
    
    if (activeTab === "history") {
      return (
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Histórico de mudanças do lead...</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    if (activeTab === "activities") {
      return (
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lista de atividades...</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    if (activeTab === "files") {
      return (
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Arquivos anexados...</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Fallback - sempre renderiza a aba info
    console.log('❌ Tab não reconhecida, renderizando INFO como fallback');
    return renderInfoTab();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
            <Badge variant="outline">
              {lead.stage}
            </Badge>
            {lead.value && (
              <Badge variant="secondary">
                {formatCurrency(lead.value)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Debug Info */}
        <div className="bg-blue-100 p-2 text-sm border border-blue-300">
          <strong>🔍 DEBUG:</strong> Tab ativa = "{activeTab}" | Lead = {lead.name}
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

        {/* Conteúdo da Aba */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-yellow-100 p-2 text-sm border border-yellow-300">
            <strong>📦 CONTAINER:</strong> Você vê esta barra amarela? Conteúdo será renderizado abaixo.
          </div>
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}