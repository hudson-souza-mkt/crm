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
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  DollarSign, 
  Calendar,
  Target,
  ArrowRight,
  ArrowLeft,
  Clock,
  TrendingUp,
  FileText,
  Tag,
  MapPin,
  Globe,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  Star,
  Percent,
  CreditCard,
  Truck
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

// Configuração das etapas do pipeline
const PIPELINE_STAGES = [
  { name: "Novo Lead", order: 0, color: "bg-blue-500", probability: 10 },
  { name: "Qualificação", order: 1, color: "bg-purple-500", probability: 25 },
  { name: "Apresentação", order: 2, color: "bg-amber-500", probability: 40 },
  { name: "Proposta", order: 3, color: "bg-indigo-500", probability: 60 },
  { name: "Negociação", order: 4, color: "bg-pink-500", probability: 80 },
  { name: "Ganho", order: 5, color: "bg-green-500", probability: 100 },
  { name: "Perdido", order: 6, color: "bg-red-500", probability: 0 },
];

export function PipelineCardModal({
  open,
  onOpenChange,
  lead,
  onStageChange,
  onLeadUpdate
}: PipelineCardModalProps) {
  const [activeTab, setActiveTab] = useState("info");

  // Funções utilitárias
  const formatDate = (date?: Date) => {
    if (!date || !isValid(date)) return "Não informado";
    try {
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const formatDateTime = (date?: Date) => {
    if (!date || !isValid(date)) return "Não informado";
    try {
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Cálculos do negócio
  const currentStage = PIPELINE_STAGES.find(stage => stage.name === lead.stage);
  const currentStageIndex = currentStage?.order || 0;
  const progressPercentage = ((currentStageIndex + 1) / (PIPELINE_STAGES.length - 1)) * 100;
  
  const baseValue = lead.value || 0;
  const discountPercent = lead.discount || 0;
  const discountAmount = (baseValue * discountPercent) / 100;
  const shippingCost = lead.shippingCost || 0;
  const totalValue = baseValue - discountAmount + shippingCost;
  const expectedValue = (totalValue * (currentStage?.probability || 0)) / 100;

  const daysInStage = lead.stageUpdatedAt && isValid(lead.stageUpdatedAt)
    ? differenceInDays(new Date(), lead.stageUpdatedAt)
    : 0;

  const daysTotal = lead.createdAt && isValid(lead.createdAt)
    ? differenceInDays(new Date(), lead.createdAt)
    : 0;

  // Componente da aba de informações
  const InfoTab = () => (
    <div className="p-6 space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Esperado</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(expectedValue)}</p>
                <p className="text-xs text-muted-foreground">{currentStage?.probability}% probabilidade</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dias na Etapa</p>
                <p className="text-2xl font-bold text-purple-600">{daysInStage}</p>
                <p className="text-xs text-muted-foreground">{lead.stage}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progresso</p>
                <p className="text-2xl font-bold text-amber-600">{Math.round(progressPercentage)}%</p>
                <Progress value={progressPercentage} className="mt-1" />
              </div>
              <Target className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Informações Detalhadas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                    <p className="text-sm font-medium">{lead.name}</p>
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

                  {lead.document && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Documento</label>
                      <p className="text-sm">{lead.document}</p>
                    </div>
                  )}

                  {lead.assignedTo && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                      <p className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {lead.assignedTo}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
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

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Origem</label>
                    <p className="text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      {lead.source || 'Manual'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant="outline" className="ml-2">
                      {lead.status || 'Ativo'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes Financeiros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detalhes Financeiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Valor Base */}
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Valor Base</span>
                  </div>
                  <span className="text-lg font-bold">{formatCurrency(baseValue)}</span>
                </div>

                {/* Desconto */}
                {discountPercent > 0 && (
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-700">Desconto ({discountPercent}%)</span>
                    </div>
                    <span className="text-lg font-bold text-red-600">- {formatCurrency(discountAmount)}</span>
                  </div>
                )}

                {/* Frete */}
                {shippingCost > 0 && (
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-700">Frete</span>
                    </div>
                    <span className="text-lg font-bold text-amber-600">+ {formatCurrency(shippingCost)}</span>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-bold text-green-700">Valor Total</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</span>
                </div>

                {/* Valor Esperado */}
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-700">Valor Esperado ({currentStage?.probability}%)</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{formatCurrency(expectedValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progresso do Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Progresso do Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timeline Visual */}
              <div className="relative">
                <div className="flex justify-between items-center mb-4">
                  {PIPELINE_STAGES.slice(0, -1).map((stage, index) => (
                    <div key={stage.name} className="flex flex-col items-center flex-1">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                        ${index <= currentStageIndex ? stage.color : 'bg-gray-300'}
                      `}>
                        {index + 1}
                      </div>
                      <div className="text-xs text-center mt-1 max-w-16 leading-tight">
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
                    style={{ width: `${(currentStageIndex / (PIPELINE_STAGES.length - 2)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Ações de Movimento */}
              {onStageChange && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const prevStage = PIPELINE_STAGES.find(s => s.order === currentStageIndex - 1);
                      if (prevStage) onStageChange(lead.id, prevStage.name);
                    }}
                    disabled={currentStageIndex <= 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar Etapa
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const nextStage = PIPELINE_STAGES.find(s => s.order === currentStageIndex + 1);
                      if (nextStage) onStageChange(lead.id, nextStage.name);
                    }}
                    disabled={currentStageIndex >= PIPELINE_STAGES.length - 2}
                    className="flex-1"
                  >
                    Avançar Etapa
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Informações Complementares */}
        <div className="space-y-6">
          {/* Datas Importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                <p className="text-sm">{formatDateTime(lead.createdAt)}</p>
                <p className="text-xs text-muted-foreground">há {daysTotal} dias</p>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                <p className="text-sm">{formatDateTime(lead.updatedAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Atualização da etapa</label>
                <p className="text-sm">{formatDateTime(lead.stageUpdatedAt)}</p>
                <p className="text-xs text-muted-foreground">há {daysInStage} dias</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Último contato</label>
                <p className="text-sm">{formatDateTime(lead.lastContact)}</p>
              </div>

              {lead.expectedCloseDate && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Previsão de fechamento</label>
                  <p className="text-sm">{formatDate(lead.expectedCloseDate)}</p>
                </div>
              )}

              {lead.nextFollowUp && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Próximo follow-up</label>
                  <p className="text-sm">{formatDateTime(lead.nextFollowUp)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags e Observações */}
          {(lead.tags?.length > 0 || lead.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tags e Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lead.tags && lead.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </label>
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
                      <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* UTMs */}
          {lead.utms && Object.keys(lead.utms).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Parâmetros UTM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(lead.utms).map(([key, value]) => (
                  value && (
                    <div key={key}>
                      <label className="text-xs font-medium text-muted-foreground uppercase">
                        {key.replace('utm_', '')}
                      </label>
                      <p className="text-sm">{value}</p>
                    </div>
                  )
                ))}
              </CardContent>
            </Card>
          )}

          {/* Alertas */}
          {daysInStage > 7 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Atenção Necessária</span>
                </div>
                <div className="text-xs text-yellow-700">
                  Este negócio está há {daysInStage} dias na etapa "{lead.stage}". 
                  Considere tomar uma ação para avançar o processo.
                </div>
              </CardContent>
            </Card>
          )}

          {lead.stage === "Ganho" && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Negócio Fechado!</span>
                </div>
                <div className="text-xs text-green-700">
                  Parabéns! Este negócio foi fechado com sucesso.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // Outras abas simplificadas
  const HistoryTab = () => (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Mudanças</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Histórico de mudanças do lead será implementado aqui...</p>
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
          <p className="text-muted-foreground">Lista de atividades será implementada aqui...</p>
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
          <p className="text-muted-foreground">Arquivos anexados serão listados aqui...</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {lead.name}
            <Badge variant="outline" className={currentStage?.color.replace('bg-', 'border-').replace('-500', '-200')}>
              {lead.stage}
            </Badge>
            {lead.value && (
              <Badge variant="secondary">
                {formatCurrency(lead.value)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Navegação das Abas */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: "info", label: "Informações do Negócio", icon: Target },
              { id: "history", label: "Histórico", icon: Clock },
              { id: "activities", label: "Atividades", icon: Activity },
              { id: "files", label: "Arquivos", icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da Aba */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "info" && <InfoTab />}
          {activeTab === "history" && <HistoryTab />}
          {activeTab === "activities" && <ActivitiesTab />}
          {activeTab === "files" && <FilesTab />}
        </div>
      </DialogContent>
    </Dialog>
  );
}