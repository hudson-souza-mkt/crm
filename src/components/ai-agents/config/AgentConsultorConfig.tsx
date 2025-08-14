import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  X, 
  Brain, 
  FileText, 
  Target, 
  Clock, 
  Bell,
  TrendingUp,
  Users,
  Star,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import type { AIAgent, AnalysisGuideline, AnalysisType, AnalysisFrequency } from "@/types/aiAgent";

interface AgentConsultorConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

const analysisTypeLabels = {
  vendas: "Análise de Vendas",
  atendimento: "Qualidade do Atendimento", 
  qualificacao: "Processo de Qualificação",
  oportunidades: "Oportunidades Perdidas",
  satisfacao: "Satisfação do Cliente",
  personalizado: "Análise Personalizada"
};

const analysisTypeDescriptions = {
  vendas: "Analisa técnicas de vendas, objeções e fechamento",
  atendimento: "Avalia cordialidade, eficiência e resolução de problemas",
  qualificacao: "Verifica se as perguntas certas foram feitas",
  oportunidades: "Identifica chances perdidas de upsell ou cross-sell",
  satisfacao: "Mede o nível de satisfação e experiência do cliente",
  personalizado: "Análise customizada conforme suas necessidades"
};

const frequencyLabels = {
  tempo_real: "Tempo Real",
  diario: "Diário",
  semanal: "Semanal", 
  mensal: "Mensal",
  manual: "Manual"
};

export function AgentConsultorConfig({ data, onChange, onSave }: AgentConsultorConfigProps) {
  const [newGuideline, setNewGuideline] = useState<Partial<AnalysisGuideline>>({
    name: "",
    description: "",
    type: "vendas",
    prompt: "",
    active: true,
    priority: "media"
  });

  const updateConsultorConfig = (field: string, value: any) => {
    onChange({
      consultorConfig: {
        ...data.consultorConfig,
        [field]: value
      }
    });
  };

  const handleAddGuideline = () => {
    if (!newGuideline.name || !newGuideline.prompt) return;

    const guideline: AnalysisGuideline = {
      id: `guideline-${Date.now()}`,
      name: newGuideline.name || "",
      description: newGuideline.description || "",
      type: newGuideline.type || "vendas",
      prompt: newGuideline.prompt || "",
      active: newGuideline.active || true,
      priority: newGuideline.priority || "media"
    };

    const currentGuidelines = data.consultorConfig?.guidelines || [];
    updateConsultorConfig("guidelines", [...currentGuidelines, guideline]);
    
    setNewGuideline({
      name: "",
      description: "",
      type: "vendas",
      prompt: "",
      active: true,
      priority: "media"
    });
  };

  const handleRemoveGuideline = (guidelineId: string) => {
    const currentGuidelines = data.consultorConfig?.guidelines || [];
    updateConsultorConfig("guidelines", currentGuidelines.filter(g => g.id !== guidelineId));
  };

  const handleToggleGuideline = (guidelineId: string) => {
    const currentGuidelines = data.consultorConfig?.guidelines || [];
    updateConsultorConfig("guidelines", currentGuidelines.map(g => 
      g.id === guidelineId ? { ...g, active: !g.active } : g
    ));
  };

  const getPriorityColor = (priority: 'alta' | 'media' | 'baixa') => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-700';
      case 'media': return 'bg-yellow-100 text-yellow-700';
      case 'baixa': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: AnalysisType) => {
    switch (type) {
      case 'vendas': return <TrendingUp className="h-4 w-4" />;
      case 'atendimento': return <Users className="h-4 w-4" />;
      case 'qualificacao': return <Target className="h-4 w-4" />;
      case 'oportunidades': return <Star className="h-4 w-4" />;
      case 'satisfacao': return <CheckCircle className="h-4 w-4" />;
      case 'personalizado': return <Brain className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Configurações do Consultor IA</h3>
        <p className="text-sm text-muted-foreground">
          Configure como o agente consultor deve analisar conversas e gerar insights
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Defina como e quando o consultor deve fazer análises
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="consultorEnabled">Ativar Análises Automáticas</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que o consultor analise conversas automaticamente
                </p>
              </div>
              <Switch
                id="consultorEnabled"
                checked={data.consultorConfig?.enabled || false}
                onCheckedChange={(checked) => updateConsultorConfig("enabled", checked)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="analysisFrequency">Frequência de Análise</Label>
                <Select
                  value={data.consultorConfig?.analysisFrequency || "manual"}
                  onValueChange={(value: AnalysisFrequency) => updateConsultorConfig("analysisFrequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(frequencyLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Quando o consultor deve fazer análises
                </p>
              </div>

              <div>
                <Label htmlFor="analysisScope">Escopo de Análise</Label>
                <Select
                  value={data.consultorConfig?.analysisScope || "todas_conversas"}
                  onValueChange={(value) => updateConsultorConfig("analysisScope", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas_conversas">Todas as conversas</SelectItem>
                    <SelectItem value="apenas_finalizadas">Apenas finalizadas</SelectItem>
                    <SelectItem value="com_problemas">Com problemas identificados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoGenerateReports">Gerar Relatórios Automáticos</Label>
                  <p className="text-sm text-muted-foreground">
                    Cria relatórios automaticamente após análises
                  </p>
                </div>
                <Switch
                  id="autoGenerateReports"
                  checked={data.consultorConfig?.autoGenerateReports || false}
                  onCheckedChange={(checked) => updateConsultorConfig("autoGenerateReports", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifyOnInsights">Notificar sobre Insights</Label>
                  <p className="text-sm text-muted-foreground">
                    Envia notificações quando encontrar insights importantes
                  </p>
                </div>
                <Switch
                  id="notifyOnInsights"
                  checked={data.consultorConfig?.notifyOnInsights || false}
                  onCheckedChange={(checked) => updateConsultorConfig("notifyOnInsights", checked)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reportFormat">Formato dos Relatórios</Label>
              <Select
                value={data.consultorConfig?.reportFormat || "resumo"}
                onValueChange={(value) => updateConsultorConfig("reportFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resumo">Resumo Executivo</SelectItem>
                  <SelectItem value="detalhado">Análise Detalhada</SelectItem>
                  <SelectItem value="pontos_chave">Pontos-Chave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orientações de Análise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Orientações de Análise
            </CardTitle>
            <CardDescription>
              Configure que tipo de análises o consultor deve fazer e como
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulário para nova orientação */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Nova Orientação
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <Label htmlFor="guidelineName">Nome da Orientação</Label>
                  <Input
                    id="guidelineName"
                    value={newGuideline.name || ""}
                    onChange={(e) => setNewGuideline({ ...newGuideline, name: e.target.value })}
                    placeholder="Ex: Análise de Técnicas de Vendas"
                  />
                </div>
                <div>
                  <Label htmlFor="guidelineType">Tipo de Análise</Label>
                  <Select
                    value={newGuideline.type || "vendas"}
                    onValueChange={(value: AnalysisType) => setNewGuideline({ ...newGuideline, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(analysisTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-3">
                <Label htmlFor="guidelineDescription">Descrição</Label>
                <Input
                  id="guidelineDescription"
                  value={newGuideline.description || ""}
                  onChange={(e) => setNewGuideline({ ...newGuideline, description: e.target.value })}
                  placeholder="Breve descrição do que será analisado"
                />
              </div>

              <div className="mb-3">
                <Label htmlFor="guidelinePrompt">Prompt de Análise</Label>
                <Textarea
                  id="guidelinePrompt"
                  value={newGuideline.prompt || ""}
                  onChange={(e) => setNewGuideline({ ...newGuideline, prompt: e.target.value })}
                  placeholder="Ex: Analise a última conversa com o cliente e aponte onde o vendedor pode melhorar suas técnicas de fechamento..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Instrução específica sobre como fazer a análise
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <Label htmlFor="guidelinePriority">Prioridade</Label>
                  <Select
                    value={newGuideline.priority || "media"}
                    onValueChange={(value: 'alta' | 'media' | 'baixa') => setNewGuideline({ ...newGuideline, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="guidelineActive">Ativar Orientação</Label>
                  <Switch
                    id="guidelineActive"
                    checked={newGuideline.active || true}
                    onCheckedChange={(checked) => setNewGuideline({ ...newGuideline, active: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleAddGuideline} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Orientação
              </Button>
            </div>

            {/* Lista de orientações */}
            {data.consultorConfig?.guidelines && data.consultorConfig.guidelines.length > 0 && (
              <div className="space-y-3">
                <Label>Orientações Configuradas:</Label>
                {data.consultorConfig.guidelines.map((guideline) => (
                  <div key={guideline.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(guideline.type)}
                          <h4 className="font-medium">{guideline.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getPriorityColor(guideline.priority)}>
                            {guideline.priority}
                          </Badge>
                          <Badge variant={guideline.active ? "default" : "secondary"}>
                            {guideline.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={guideline.active}
                          onCheckedChange={() => handleToggleGuideline(guideline.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveGuideline(guideline.id)}
                          className="h-8 w-8 text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">
                          {analysisTypeLabels[guideline.type]}
                        </Badge>
                        <span>•</span>
                        <span>{analysisTypeDescriptions[guideline.type]}</span>
                      </div>
                      
                      {guideline.description && (
                        <p className="text-sm text-muted-foreground">{guideline.description}</p>
                      )}
                      
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        {guideline.prompt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Templates de orientações */}
            <div className="mt-6">
              <Label className="mb-3 block">Templates de Orientações Populares:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    name: "Melhoria em Vendas",
                    type: "vendas" as AnalysisType,
                    prompt: "Analise a última conversa com o cliente e aponte onde o vendedor pode melhorar suas técnicas de fechamento, tratamento de objeções e apresentação de valor."
                  },
                  {
                    name: "Qualidade do Atendimento",
                    type: "atendimento" as AnalysisType,
                    prompt: "Avalie a cordialidade, tempo de resposta e eficiência na resolução do problema do cliente. Sugira melhorias no atendimento."
                  },
                  {
                    name: "Oportunidades Perdidas",
                    type: "oportunidades" as AnalysisType,
                    prompt: "Identifique oportunidades de upsell, cross-sell ou expansão de conta que não foram exploradas durante a conversa."
                  },
                  {
                    name: "Satisfação do Cliente",
                    type: "satisfacao" as AnalysisType,
                    prompt: "Analise sinais de satisfação ou insatisfação do cliente e sugira ações para melhorar a experiência."
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-muted/50" onClick={() => {
                    setNewGuideline({
                      name: template.name,
                      type: template.type,
                      prompt: template.prompt,
                      description: analysisTypeDescriptions[template.type],
                      active: true,
                      priority: "media"
                    });
                  }}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(template.type)}
                        <span className="font-medium text-sm">{template.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.prompt}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Configurações</Button>
      </div>
    </div>
  );
}