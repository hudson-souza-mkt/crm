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
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  DollarSign, 
  Calendar,
  Target,
  ArrowRight,
  ArrowLeft
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

  const formatDate = (date?: Date) => {
    if (!date) return "Não informado";
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Aba de Informações do Negócio
  const InfoTab = () => (
    <div className="p-6 space-y-6">
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(lead.value)}
            </div>
            <div className="text-sm text-muted-foreground">Valor do Negócio</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {lead.stage}
            </div>
            <div className="text-sm text-muted-foreground">Etapa Atual</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {lead.source || "Manual"}
            </div>
            <div className="text-sm text-muted-foreground">Origem</div>
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
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="text-sm">{lead.name}</p>
              </div>

              {lead.company && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                  <p className="text-sm flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {lead.company}
                  </p>
                </div>
              )}

              {lead.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {lead.phone}
                  </p>
                </div>
              )}

              {lead.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4" />
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
            </div>
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
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Valor</label>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(lead.value)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Etapa Atual</label>
                <Badge variant="outline" className="ml-2">
                  {lead.stage}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-sm">{lead.status || "Ativo"}</p>
              </div>

              {lead.funnel && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Funil</label>
                  <p className="text-sm">{lead.funnel}</p>
                </div>
              )}
            </div>
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
              <p className="text-sm">{formatDate(lead.createdAt)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
              <p className="text-sm">{formatDate(lead.updatedAt)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Último contato</label>
              <p className="text-sm">{formatDate(lead.lastContact)}</p>
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
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStageChange(lead.id, "Qualificação")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar Etapa
              </Button>
              <Button 
                size="sm"
                onClick={() => onStageChange(lead.id, "Proposta")}
              >
                Avançar Etapa
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Outras abas simples
  const HistoryTab = () => (
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

  const ActivitiesTab = () => (
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

  const FilesTab = () => (
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoTab />;
      case "history":
        return <HistoryTab />;
      case "activities":
        return <ActivitiesTab />;
      case "files":
        return <FilesTab />;
      default:
        return <InfoTab />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
            <Badge variant="outline">
              {lead.stage}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Navegação das Abas */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "info"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Informações do Negócio
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Histórico
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "activities"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Atividades
            </button>
            <button
              onClick={() => setActiveTab("files")}
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
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}