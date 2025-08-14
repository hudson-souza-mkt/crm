import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  FileText, 
  MessageSquare, 
  GitBranch, 
  Target, 
  Settings, 
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle,
  ArrowRight,
  Zap,
  BrainCircuit
} from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { AIAgent, ConversationStep, PipelineAction, StepCompletionCondition } from "@/types/aiAgent";

interface AgentInstructionsConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

// Mock data para pipelines (em um sistema real viria do backend)
const mockPipelines = [
  {
    id: "pipeline-1",
    name: "Vendas Principal",
    stages: [
      { id: "stage-1", name: "Novo Lead", order: 0 },
      { id: "stage-2", name: "Qualificação", order: 1 },
      { id: "stage-3", name: "Apresentação", order: 2 },
      { id: "stage-4", name: "Proposta", order: 3 },
      { id: "stage-5", name: "Negociação", order: 4 },
      { id: "stage-6", name: "Ganho", order: 5 },
      { id: "stage-7", name: "Perdido", order: 6 }
    ]
  },
  {
    id: "pipeline-2",
    name: "Suporte Técnico",
    stages: [
      { id: "support-1", name: "Ticket Aberto", order: 0 },
      { id: "support-2", name: "Em Análise", order: 1 },
      { id: "support-3", name: "Em Desenvolvimento", order: 2 },
      { id: "support-4", name: "Resolvido", order: 3 }
    ]
  }
];

export function AgentInstructionsConfig({ data, onChange, onSave }: AgentInstructionsConfigProps) {
  const [newProhibitedTopic, setNewProhibitedTopic] = useState("");
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [newStep, setNewStep] = useState<Partial<ConversationStep>>({
    name: "",
    description: "",
    pipelineStage: "",
    pipelineAction: "move_stage",
    instructions: "",
    systemPrompt: "",
    completionCondition: "manual"
  });

  const selectedPipeline = mockPipelines.find(p => p.id === data.pipelineConfig?.defaultPipeline) || mockPipelines[0];

  const handleAddStep = () => {
    if (!newStep.name || !newStep.instructions) return;

    const step: ConversationStep = {
      id: `step-${Date.now()}`,
      name: newStep.name || "",
      description: newStep.description || "",
      order: (data.conversationFlow?.length || 0),
      pipelineStage: newStep.pipelineStage,
      pipelineAction: newStep.pipelineAction || "move_stage",
      instructions: newStep.instructions || "",
      systemPrompt: newStep.systemPrompt || "",
      completionCondition: newStep.completionCondition || "manual",
      completionCriteria: newStep.completionCriteria,
      autoActions: newStep.autoActions
    };

    const currentSteps = data.conversationFlow || [];
    onChange({ conversationFlow: [...currentSteps, step] });
    
    setNewStep({
      name: "",
      description: "",
      pipelineStage: "",
      pipelineAction: "move_stage",
      instructions: "",
      systemPrompt: "",
      completionCondition: "manual"
    });
  };

  const handleRemoveStep = (stepId: string) => {
    const currentSteps = data.conversationFlow || [];
    onChange({ 
      conversationFlow: currentSteps.filter(step => step.id !== stepId)
    });
  };

  const handleUpdateStep = (stepId: string, updates: Partial<ConversationStep>) => {
    const currentSteps = data.conversationFlow || [];
    onChange({
      conversationFlow: currentSteps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    });
  };

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const handleAddProhibitedTopic = () => {
    if (newProhibitedTopic.trim()) {
      onChange({
        prohibitedTopics: [...(data.prohibitedTopics || []), newProhibitedTopic.trim()]
      });
      setNewProhibitedTopic("");
    }
  };

  const handleRemoveProhibitedTopic = (index: number) => {
    const newTopics = [...(data.prohibitedTopics || [])];
    newTopics.splice(index, 1);
    onChange({ prohibitedTopics: newTopics });
  };

  const updatePipelineConfig = (field: string, value: any) => {
    onChange({
      pipelineConfig: {
        ...data.pipelineConfig,
        [field]: value
      }
    });
  };

  const getPipelineActionLabel = (action: PipelineAction) => {
    const labels = {
      create_deal: "Criar negócio",
      move_stage: "Mover etapa",
      update_value: "Atualizar valor",
      add_note: "Adicionar nota",
      schedule_task: "Agendar tarefa"
    };
    return labels[action];
  };

  const getCompletionConditionLabel = (condition: StepCompletionCondition) => {
    const labels = {
      manual: "Manual",
      automatic: "Automático",
      conditional: "Condicional"
    };
    return labels[condition];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Instruções e Fluxo</h3>
        <p className="text-sm text-muted-foreground">
          Configure como o agente deve se comportar e interagir
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Instruções do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {data.type === 'consultor' ? 'Orientações de Análise' : 'Instruções Gerais do Sistema'}
            </CardTitle>
            <CardDescription>
              {data.type === 'consultor' 
                ? 'Defina o que o agente deve analisar e quais insights ele deve gerar.'
                : 'Instruções principais que definem o comportamento geral do agente.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="systemInstructions">
                {data.type === 'consultor' ? 'Instruções de Análise' : 'Prompt do Sistema'}
              </Label>
              <Textarea
                id="systemInstructions"
                value={data.systemInstructions || ""}
                onChange={(e) => onChange({ systemInstructions: e.target.value })}
                placeholder={
                  data.type === 'consultor'
                    ? "Ex: Analise a última conversa com o cliente e aponte onde o vendedor pode melhorar."
                    : "Você é um assistente virtual especializado em... Sua missão é..."
                }
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {data.type !== 'consultor' && "Use {nome}, {empresa} para personalização automática"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configurações específicas para agentes que não são consultores */}
        {data.type !== 'consultor' && (
          <>
            {/* Configuração de Pipeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Integração com Pipeline
                </CardTitle>
                <CardDescription>
                  Configure como o agente interage com o pipeline de vendas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pipelineEnabled">Ativar Integração com Pipeline</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que o agente crie e mova negócios automaticamente
                    </p>
                  </div>
                  <Switch
                    id="pipelineEnabled"
                    checked={data.pipelineConfig?.enabled || false}
                    onCheckedChange={(checked) => updatePipelineConfig("enabled", checked)}
                  />
                </div>

                {data.pipelineConfig?.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="defaultPipeline">Pipeline Padrão</Label>
                      <Select
                        value={data.pipelineConfig?.defaultPipeline || ""}
                        onValueChange={(value) => updatePipelineConfig("defaultPipeline", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um pipeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPipelines.map(pipeline => (
                            <SelectItem key={pipeline.id} value={pipeline.id}>
                              {pipeline.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="autoCreateDeals">Criar Negócios Automaticamente</Label>
                      <Switch
                        id="autoCreateDeals"
                        checked={data.pipelineConfig?.autoCreateDeals || false}
                        onCheckedChange={(checked) => updatePipelineConfig("autoCreateDeals", checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dealNamingPattern">Padrão de Nome do Negócio</Label>
                      <Input
                        id="dealNamingPattern"
                        value={data.pipelineConfig?.dealNamingPattern || ""}
                        onChange={(e) => updatePipelineConfig("dealNamingPattern", e.target.value)}
                        placeholder="Ex: {cliente} - {produto}"
                      />
                    </div>

                    <div>
                      <Label htmlFor="defaultDealValue">Valor Padrão do Negócio</Label>
                      <Input
                        id="defaultDealValue"
                        type="number"
                        value={data.pipelineConfig?.defaultDealValue || 0}
                        onChange={(e) => updatePipelineConfig("defaultDealValue", parseFloat(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fluxo de Conversa Integrado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Fluxo de Conversa Integrado
                </CardTitle>
                <CardDescription>
                  Defina os passos da conversa e conecte com etapas do pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulário para novo passo */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h5 className="font-medium mb-3 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Novo Passo
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label htmlFor="stepName">Nome do Passo</Label>
                      <Input
                        id="stepName"
                        value={newStep.name || ""}
                        onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                        placeholder="Ex: Cumprimentar o cliente"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stepDescription">Descrição</Label>
                      <Input
                        id="stepDescription"
                        value={newStep.description || ""}
                        onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                        placeholder="Breve descrição do objetivo"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <Label htmlFor="pipelineStage">Etapa do Pipeline</Label>
                      <Select
                        value={newStep.pipelineStage || ""}
                        onValueChange={(value) => setNewStep({ ...newStep, pipelineStage: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma etapa" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedPipeline?.stages.map(stage => (
                            <SelectItem key={stage.id} value={stage.id}>
                              {stage.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="pipelineAction">Ação no Pipeline</Label>
                      <Select
                        value={newStep.pipelineAction || "move_stage"}
                        onValueChange={(value: PipelineAction) => setNewStep({ ...newStep, pipelineAction: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="create_deal">Criar negócio</SelectItem>
                          <SelectItem value="move_stage">Mover etapa</SelectItem>
                          <SelectItem value="update_value">Atualizar valor</SelectItem>
                          <SelectItem value="add_note">Adicionar nota</SelectItem>
                          <SelectItem value="schedule_task">Agendar tarefa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="completionCondition">Condição de Conclusão</Label>
                      <Select
                        value={newStep.completionCondition || "manual"}
                        onValueChange={(value: StepCompletionCondition) => setNewStep({ ...newStep, completionCondition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automático</SelectItem>
                          <SelectItem value="conditional">Condicional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="stepInstructions">Instruções para esta Etapa</Label>
                    <Textarea
                      id="stepInstructions"
                      value={newStep.instructions || ""}
                      onChange={(e) => setNewStep({ ...newStep, instructions: e.target.value })}
                      placeholder="Como o agente deve se comportar nesta etapa..."
                      rows={3}
                    />
                  </div>

                  <div className="mb-3">
                    <Label htmlFor="stepSystemPrompt">Prompt Específico (opcional)</Label>
                    <Textarea
                      id="stepSystemPrompt"
                      value={newStep.systemPrompt || ""}
                      onChange={(e) => setNewStep({ ...newStep, systemPrompt: e.target.value })}
                      placeholder="Prompt específico para esta etapa..."
                      rows={2}
                    />
                  </div>

                  {newStep.completionCondition === "conditional" && (
                    <div className="mb-3">
                      <Label htmlFor="completionCriteria">Critérios de Conclusão</Label>
                      <Input
                        id="completionCriteria"
                        value={newStep.completionCriteria || ""}
                        onChange={(e) => setNewStep({ ...newStep, completionCriteria: e.target.value })}
                        placeholder="Ex: cliente confirma interesse"
                      />
                    </div>
                  )}

                  <Button onClick={handleAddStep} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Passo
                  </Button>
                </div>

                {/* Lista de passos */}
                {data.conversationFlow && data.conversationFlow.length > 0 && (
                  <div className="space-y-3">
                    <Label>Fluxo de Conversa Configurado:</Label>
                    {data.conversationFlow.map((step, index) => (
                      <Collapsible key={step.id}>
                        <div className="border rounded-lg">
                          <CollapsibleTrigger 
                            className="w-full p-3 flex items-center justify-between hover:bg-muted/50"
                            onClick={() => toggleStepExpansion(step.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{step.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Target className="h-3 w-3" />
                                  {selectedPipeline?.stages.find(s => s.id === step.pipelineStage)?.name || "Sem etapa"}
                                  <ArrowRight className="h-3 w-3" />
                                  {getPipelineActionLabel(step.pipelineAction)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={step.completionCondition === "automatic" ? "default" : "secondary"}>
                                {getCompletionConditionLabel(step.completionCondition)}
                              </Badge>
                              {expandedSteps.has(step.id) ? 
                                <ChevronUp className="h-4 w-4" /> : 
                                <ChevronDown className="h-4 w-4" />
                              }
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="px-3 pb-3">
                            <div className="space-y-3 pt-3 border-t">
                              <div>
                                <Label className="text-xs">Descrição</Label>
                                <p className="text-sm text-muted-foreground">{step.description || "Sem descrição"}</p>
                              </div>
                              
                              <div>
                                <Label className="text-xs">Instruções</Label>
                                <p className="text-sm">{step.instructions}</p>
                              </div>
                              
                              {step.systemPrompt && (
                                <div>
                                  <Label className="text-xs">Prompt Específico</Label>
                                  <p className="text-sm font-mono bg-muted p-2 rounded text-xs">{step.systemPrompt}</p>
                                </div>
                              )}
                              
                              {step.completionCriteria && (
                                <div>
                                  <Label className="text-xs">Critérios de Conclusão</Label>
                                  <p className="text-sm text-muted-foreground">{step.completionCriteria}</p>
                                </div>
                              )}
                              
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3 mr-1" />
                                  Editar
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleRemoveStep(step.id)}
                                  className="text-red-600"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Remover
                                </Button>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      
                      </Collapsible>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Tópicos Proibidos */}
        <Card>
          <CardHeader>
            <CardTitle>Tópicos Proibidos</CardTitle>
            <CardDescription>
              Assuntos que o agente não deve abordar ou responder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newProhibitedTopic}
                onChange={(e) => setNewProhibitedTopic(e.target.value)}
                placeholder="Ex: Informações confidenciais"
                onKeyPress={(e) => e.key === "Enter" && handleAddProhibitedTopic()}
              />
              <Button onClick={handleAddProhibitedTopic} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.prohibitedTopics && data.prohibitedTopics.length > 0 && (
              <div className="space-y-2">
                <Label>Tópicos Restritos:</Label>
                <div className="flex flex-wrap gap-2">
                  {data.prohibitedTopics.map((topic, index) => (
                    <Badge key={index} variant="destructive" className="gap-1">
                      {topic}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveProhibitedTopic(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Instruções</Button>
      </div>
    </div>
  );
}