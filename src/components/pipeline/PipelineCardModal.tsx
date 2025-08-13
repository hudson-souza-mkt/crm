import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Percent,
  Truck,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Building,
  Target,
  AlertTriangle,
  CheckCircle,
  History,
  MessageSquare,
  FileText,
  Award,
  Timer,
  Activity,
  BarChart3,
  Zap,
  Star,
  Globe,
  Users
} from "lucide-react";
import { format, differenceInDays, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Lead } from "@/components/pipeline/PipelineCard";

interface PipelineCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onStageChange?: (leadId: string, newStage: string) => void;
  onLeadUpdate?: (leadId: string, updates: Partial<Lead>) => void;
}

// Mock data para etapas do pipeline
const pipelineStages = [
  { name: "Novo Lead", order: 0, color: "blue", probability: 10 },
  { name: "Qualificação", order: 1, color: "purple", probability: 25 },
  { name: "Apresentação", order: 2, color: "amber", probability: 40 },
  { name: "Proposta", order: 3, color: "indigo", probability: 60 },
  { name: "Negociação", order: 4, color: "pink", probability: 80 },
  { name: "Ganho", order: 5, color: "green", probability: 100 },
  { name: "Perdido", order: 6, color: "red", probability: 0 },
];

// Mock data para histórico de etapas
const stageHistory = [
  {
    id: "1",
    stage: "Novo Lead",
    date: new Date("2024-01-15"),
    user: "Ana Sales",
    notes: "Lead criado via formulário do site"
  },
  {
    id: "2",
    stage: "Qualificação",
    date: new Date("2024-01-16"),
    user: "Ana Sales",
    notes: "Lead qualificado após primeira ligação"
  },
  {
    id: "3",
    stage: "Apresentação",
    date: new Date("2024-01-18"),
    user: "Ana Sales",
    notes: "Apresentação realizada via Google Meet"
  }
];

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

  const currentStage = pipelineStages.find(stage => stage.name === lead.stage);
  const currentStageIndex = currentStage?.order || 0;
  const progressPercentage = ((currentStageIndex + 1) / (pipelineStages.length - 1)) * 100;

  const canMoveForward = currentStageIndex < pipelineStages.length - 2;
  const canMoveBackward = currentStageIndex > 0;

  const nextStage = pipelineStages.find(stage => stage.order === currentStageIndex + 1);
  const previousStage = pipelineStages.find(stage => stage.order === currentStageIndex - 1);

  const daysInCurrentStage = lead.stageUpdatedAt && isValid(lead.stageUpdatedAt)
    ? differenceInDays(new Date(), lead.stageUpdatedAt)
    : 0;

  // Cálculos financeiros
  const baseValue = lead.value || 0;
  const discountPercent = lead.discount || 0;
  const discountAmount = (baseValue * discountPercent) / 100;
  const shippingCost = lead.shippingCost || 0;
  const totalValue = baseValue - discountAmount + shippingCost;

  const handleStageMove = (direction: 'forward' | 'backward') => {
    const targetStage = direction === 'forward' ? nextStage : previousStage;
    if (targetStage && onStageChange) {
      onStageChange(lead.id, targetStage.name);
    }
  };

  const getStageColor = (stageName: string) => {
    const stage = pipelineStages.find(s => s.name === stageName);
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      amber: "bg-amber-100 text-amber-700 border-amber-200",
      indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
      pink: "bg-pink-100 text-pink-700 border-pink-200",
      green: "bg-green-100 text-green-700 border-green-200",
      red: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[stage?.color || 'blue'];
  };

  const getNextActions = () => {
    const actions: Record<string, string[]> = {
      "Novo Lead": ["Fazer primeira ligação", "Enviar email de apresentação", "Qualificar necessidades"],
      "Qualificação": ["Agendar demonstração", "Enviar material técnico", "Identificar decisores"],
      "Apresentação": ["Realizar demo do produto", "Apresentar casos de sucesso", "Coletar feedback"],
      "Proposta": ["Elaborar proposta comercial", "Definir condições de pagamento", "Negociar valores"],
      "Negociação": ["Ajustar proposta", "Resolver objeções", "Definir cronograma"],
    };
    return actions[lead.stage] || [];
  };

  const formatSimpleDate = (date?: Date) => {
    if (!date || !isValid(date)) return "—";
    try {
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data simples:', error);
      return "—";
    }
  };

  const formatHistoryDate = (date: Date) => {
    if (!date || !isValid(date)) return "Data inválida";
    try {
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data do histórico:', error);
      return "Data inválida";
    }
  };

  // Renderizar conteúdo baseado na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-6 p-6">
            {/* Header com Resumo Executivo */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(progressPercentage)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progresso</div>
                    <Progress value={progressPercentage} className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {(totalValue * (currentStage?.probability || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-muted-foreground">Valor Esperado</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {currentStage?.probability}% de probabilidade
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {daysInCurrentStage}
                    </div>
                    <div className="text-sm text-muted-foreground">Dias na Etapa</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {lead.stage}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-muted-foreground">Valor Total</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {discountPercent > 0 && `${discountPercent}% desconto`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Principal - Informações do Negócio */}
              <div className="lg:col-span-2 space-y-6">
                {/* Detalhes Financeiros */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Detalhes Financeiros
                    </CardTitle>
                    <CardDescription>
                      Breakdown completo dos valores do negócio
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Valor Base */}
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">Valor Base</span>
                        </div>
                        <span className="text-lg font-bold">R$ {baseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>

                      {/* Desconto */}
                      {discountPercent > 0 && (
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Percent className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-700">Desconto ({discountPercent}%)</span>
                          </div>
                          <span className="text-lg font-bold text-red-600">- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}

                      {/* Frete */}
                      {shippingCost > 0 && (
                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-amber-600" />
                            <span className="font-medium text-amber-700">Frete</span>
                          </div>
                          <span className="text-lg font-bold text-amber-600">+ R$ {shippingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-green-600" />
                          <span className="text-lg font-bold text-green-700">Valor Total</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progresso e Ações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Progresso do Pipeline
                    </CardTitle>
                    <CardDescription>
                      Etapa atual e próximos passos para fechar o negócio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Timeline Visual */}
                    <div className="relative">
                      <div className="flex justify-between items-center mb-4">
                        {pipelineStages.slice(0, -1).map((stage, index) => (
                          <div key={stage.name} className="flex flex-col items-center flex-1">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                              ${index <= currentStageIndex 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-gray-200 text-gray-500'
                              }
                            `}>
                              {index + 1}
                            </div>
                            <div className="text-xs text-center mt-1 max-w-16">
                              {stage.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stage.probability}%
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Linha de Progresso */}
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${(currentStageIndex / (pipelineStages.length - 2)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Ações de Movimento */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStageMove('backward')}
                        disabled={!canMoveBackward}
                        className="flex-1"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {previousStage ? `Voltar para ${previousStage.name}` : 'Não pode voltar'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStageMove('forward')}
                        disabled={!canMoveForward}
                        className="flex-1"
                      >
                        {nextStage ? `Avançar para ${nextStage.name}` : 'Finalizado'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>

                    {/* Próximas Ações */}
                    <div className="space-y-3">
                      <h5 className="font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Próximas ações recomendadas:
                      </h5>
                      <div className="grid gap-2">
                        {getNextActions().map((action, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Informações Complementares */}
              <div className="space-y-6">
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
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{lead.company || "Pessoa física"}</div>
                          <div className="text-xs text-muted-foreground">Empresa</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{lead.phone || "Não informado"}</div>
                          <div className="text-xs text-muted-foreground">Telefone</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{lead.email || "Não informado"}</div>
                          <div className="text-xs text-muted-foreground">Email</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{lead.assignedTo || "Não atribuído"}</div>
                          <div className="text-xs text-muted-foreground">Responsável</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{lead.source || "Não informado"}</div>
                          <div className="text-xs text-muted-foreground">Origem</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Datas Importantes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Datas Importantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Criado em</div>
                        <div className="text-sm font-medium">{formatSimpleDate(lead.createdAt)}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground">Última atualização</div>
                        <div className="text-sm font-medium">{formatSimpleDate(lead.stageUpdatedAt)}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground">Último contato</div>
                        <div className="text-sm font-medium">{formatSimpleDate(lead.lastContact)}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground">Previsão de fechamento</div>
                        <div className="text-sm font-medium">{formatSimpleDate(lead.expectedCloseDate)}</div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Próximo follow-up</div>
                        <div className="text-sm font-medium">{formatSimpleDate(lead.nextFollowUp)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags e Observações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Tags e Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tags */}
                    {lead.tags && lead.tags.length > 0 && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Tags</div>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Observações */}
                    {lead.notes && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Observações</div>
                        <div className="text-sm bg-muted/50 p-3 rounded-lg">
                          {lead.notes}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Alertas e Avisos */}
                {daysInCurrentStage > 7 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-900">Atenção Necessária</span>
                      </div>
                      <div className="text-xs text-yellow-700">
                        Este negócio está há {daysInCurrentStage} dias na etapa "{lead.stage}". 
                        Considere tomar uma ação para avançar o processo.
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Mudanças
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stageHistory.map((entry) => (
                    <div key={entry.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{entry.stage}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatHistoryDate(entry.date)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">por {entry.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "activities":
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Conteúdo da aba de atividades...</p>
              </CardContent>
            </Card>
          </div>
        );

      case "files":
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Arquivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Conteúdo da aba de arquivos...</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Aba não encontrada</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
            <Badge variant="outline" className={getStageColor(lead.stage)}>
              {lead.stage}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Navegação Manual das Abas */}
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