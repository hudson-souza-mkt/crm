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
  Edit,
  Trash2,
  MoreHorizontal
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

  const currentStage = pipelineStages.find(stage => stage.name === lead.stage);
  const currentStageIndex = currentStage?.order || 0;
  const progressPercentage = ((currentStageIndex + 1) / (pipelineStages.length - 1)) * 100;

  const canMoveForward = currentStageIndex < pipelineStages.length - 2; // Não pode ir além de "Ganho"
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

  const formatDate = (date?: Date) => {
    if (!date || !isValid(date)) return "Não definida";
    try {
      return format(date, "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return "Data inválida";
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
            <Badge variant="outline" className={getStageColor(lead.stage)}>
              {lead.stage}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informações do Negócio</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex-1 overflow-y-auto space-y-6">
            {/* Progress do Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progresso do Pipeline
                </CardTitle>
                <CardDescription>
                  Etapa atual e próximos passos para avançar o negócio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barra de Progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Início</span>
                    <span>Fechamento</span>
                  </div>
                </div>

                {/* Etapa Atual */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${currentStage?.color}-500`}></div>
                    <div>
                      <h4 className="font-medium">{lead.stage}</h4>
                      <p className="text-sm text-muted-foreground">
                        {daysInCurrentStage} dias nesta etapa
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {currentStage?.probability}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Probabilidade
                    </div>
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

                {/* Próximas Ações Sugeridas */}
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Próximas ações sugeridas:</h5>
                  <div className="space-y-1">
                    {getNextActions().map((action, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-muted-foreground" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Financeiras */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Informações Financeiras
                </CardTitle>
                <CardDescription>
                  Valores, descontos e custos do negócio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Valores */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor Base</span>
                      <span className="font-medium">R$ {baseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    {discountPercent > 0 && (
                      <div className="flex justify-between items-center text-red-600">
                        <span className="text-sm flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          Desconto ({discountPercent}%)
                        </span>
                        <span className="font-medium">- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    
                    {shippingCost > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          Frete
                        </span>
                        <span className="font-medium">R$ {shippingCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Valor Total</span>
                      <span className="text-primary">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Valor Esperado</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        R$ {(totalValue * (currentStage?.probability || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-blue-700">
                        Baseado na probabilidade de {currentStage?.probability}%
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Previsão de Fechamento</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {formatDate(lead.expectedCloseDate)}
                      </div>
                    </div>

                    {daysInCurrentStage > 7 && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-900">Atenção</span>
                        </div>
                        <div className="text-xs text-yellow-700">
                          Negócio há {daysInCurrentStage} dias na mesma etapa
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Lead */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{lead.phone || "Não informado"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{lead.email || "Não informado"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{lead.company || "Pessoa física"}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Responsável</span>
                      <div className="text-sm font-medium">{lead.assignedTo || "Não atribuído"}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Origem</span>
                      <div className="text-sm">{lead.source || "Não informado"}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Criado em</span>
                      <div className="text-sm">{formatSimpleDate(lead.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs text-muted-foreground mb-2 block">Tags</span>
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
                  <div className="mt-4">
                    <span className="text-xs text-muted-foreground mb-2 block">Observações</span>
                    <div className="text-sm bg-muted/50 p-3 rounded-lg">
                      {lead.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="flex-1 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Conteúdo da aba de contato...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-y-auto">
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
          </TabsContent>

          <TabsContent value="tasks" className="flex-1 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Tarefas e Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Conteúdo da aba de tarefas...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}