import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  FileText,
  HelpCircle,
  MessageSquare,
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import type { ConversationStep, AIAgent, StepCompletionCondition } from "@/types/aiAgent";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Templates pré-configurados para facilitar a criação
const CONVERSATION_TEMPLATES = [
  {
    id: "welcome_qualification",
    name: "Boas-vindas e Qualificação",
    description: "Fluxo básico para dar boas-vindas e qualificar leads",
    steps: [
      {
        id: "welcome",
        name: "Boas-vindas",
        description: "Dar boas-vindas ao lead e se apresentar",
        instructions: "Cumprimente o lead pelo nome, apresente-se e explique brevemente como pode ajudar."
      },
      {
        id: "need_discovery",
        name: "Descoberta de necessidades",
        description: "Identificar necessidades e dores do lead",
        instructions: "Faça perguntas abertas para descobrir o que o lead está buscando e quais são suas principais dores."
      },
      {
        id: "qualification",
        name: "Qualificação",
        description: "Qualificar se o lead tem fit com o produto",
        instructions: "Faça perguntas para entender se o lead tem fit com nossos produtos. Explore orçamento, timing e poder de decisão."
      }
    ]
  },
  {
    id: "lead_nurturing",
    name: "Nutrição de Leads",
    description: "Fluxo para nutrir leads ainda não prontos para compra",
    steps: [
      {
        id: "introduction",
        name: "Apresentação",
        description: "Apresentar a empresa e os produtos",
        instructions: "Apresente brevemente a empresa e os principais produtos/serviços."
      },
      {
        id: "value_proposition",
        name: "Proposta de valor",
        description: "Explicar a proposta de valor",
        instructions: "Explique como seus produtos resolvem problemas específicos e o valor que entregam."
      },
      {
        id: "content_offer",
        name: "Oferta de conteúdo",
        description: "Oferecer materiais educativos",
        instructions: "Ofereça materiais educativos relevantes (e-books, webinars, etc) relacionados às dores do lead."
      },
      {
        id: "follow_up",
        name: "Agendamento de follow-up",
        description: "Agendar próximo contato",
        instructions: "Pergunte quando seria um bom momento para retomar o contato para continuar a conversa."
      }
    ]
  },
  {
    id: "sales_presentation",
    name: "Apresentação de Vendas",
    description: "Fluxo para apresentação comercial e fechamento",
    steps: [
      {
        id: "recap_needs",
        name: "Recapitular necessidades",
        description: "Revisar as necessidades identificadas",
        instructions: "Recapitule as necessidades e dores que o lead compartilhou anteriormente."
      },
      {
        id: "solution_presentation",
        name: "Apresentação da solução",
        description: "Apresentar a solução ideal",
        instructions: "Apresente a solução mais adequada para as necessidades do lead, destacando como resolve cada ponto mencionado."
      },
      {
        id: "handle_objections",
        name: "Tratar objeções",
        description: "Identificar e tratar objeções",
        instructions: "Pergunte se há dúvidas ou preocupações e responda cada objeção de forma clara e direta."
      },
      {
        id: "closing",
        name: "Fechamento",
        description: "Propor próximos passos",
        instructions: "Proponha os próximos passos concretos, como uma demonstração, reunião com especialista ou proposta comercial."
      }
    ]
  }
];

interface AgentConversationFlowConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentConversationFlowConfig({ data, onChange, onSave }: AgentConversationFlowConfigProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "template" | "advanced">("visual");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  
  // Estado local para gerenciar os passos da conversa
  const [steps, setSteps] = useState<ConversationStep[]>(
    data.conversationFlow || []
  );
  
  // Atualizar o agente com os passos modificados
  const updateSteps = (newSteps: ConversationStep[]) => {
    setSteps(newSteps);
    onChange({
      conversationFlow: newSteps
    });
  };
  
  // Adicionar novo passo
  const addStep = () => {
    const newStep: ConversationStep = {
      id: `step-${Date.now()}`,
      name: "Novo passo",
      description: "Descrição do passo",
      order: steps.length,
      instructions: "",
      systemPrompt: "",
      completionCondition: "manual",
      pipelineAction: "add_note"
    };
    
    updateSteps([...steps, newStep]);
  };
  
  // Remover passo
  const removeStep = (stepId: string) => {
    const newSteps = steps.filter(step => step.id !== stepId);
    // Reordenar os passos restantes
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    
    updateSteps(reorderedSteps);
  };
  
  // Mover passo para cima
  const moveStepUp = (index: number) => {
    if (index === 0) return;
    
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index - 1];
    newSteps[index - 1] = temp;
    
    // Atualizar a propriedade order
    newSteps.forEach((step, i) => {
      step.order = i;
    });
    
    updateSteps(newSteps);
  };
  
  // Mover passo para baixo
  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    
    // Atualizar a propriedade order
    newSteps.forEach((step, i) => {
      step.order = i;
    });
    
    updateSteps(newSteps);
  };
  
  // Atualizar um passo específico
  const updateStep = (index: number, updates: Partial<ConversationStep>) => {
    const newSteps = steps.map((step, i) => 
      i === index ? { ...step, ...updates } : step
    );
    
    updateSteps(newSteps);
  };
  
  // Aplicar template
  const applyTemplate = () => {
    if (!selectedTemplate) return;
    
    const template = CONVERSATION_TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;
    
    // Converter o template para o formato ConversationStep
    const templateSteps: ConversationStep[] = template.steps.map((step, index) => ({
      id: `step-${Date.now()}-${index}`,
      name: step.name,
      description: step.description,
      order: index,
      instructions: step.instructions,
      systemPrompt: "",
      completionCondition: "automatic",
      pipelineAction: "add_note"
    }));
    
    // Perguntar ao usuário se deseja substituir ou anexar
    if (steps.length > 0) {
      if (confirm("Deseja substituir o fluxo atual ou anexar este template ao final?")) {
        // Substituir
        updateSteps(templateSteps);
      } else {
        // Anexar - ajustar order
        const appendedSteps = templateSteps.map((step, index) => ({
          ...step,
          order: steps.length + index
        }));
        updateSteps([...steps, ...appendedSteps]);
      }
    } else {
      // Não há passos, simplesmente aplicar o template
      updateSteps(templateSteps);
    }
    
    // Reset da seleção
    setSelectedTemplate("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Fluxo de Conversa</h3>
        <p className="text-sm text-muted-foreground">
          Defina como o agente deve conduzir a conversa com o lead, passo a passo
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>
        
        {/* Visualização simples */}
        <TabsContent value="visual" className="space-y-4 pt-4">
          {steps.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum passo definido</h3>
              <p className="text-muted-foreground mb-4">
                Defina como o agente deve conduzir a conversa, passo a passo.
              </p>
              <Button onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar primeiro passo
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {steps.map((step, index) => (
                <Card key={step.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <Badge variant="outline" className="text-xs rounded-full h-6 w-6 flex items-center justify-center p-0">
                          {index + 1}
                        </Badge>
                        <CardTitle className="text-base">{step.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveStepUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveStepDown(index)}
                          disabled={index === steps.length - 1}
                          className="h-8 w-8"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeStep(step.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor={`step-${index}-instructions`}>Instruções para o agente</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="max-w-xs">Instruções detalhadas sobre como o agente deve agir nesta etapa da conversa.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Textarea
                          id={`step-${index}-instructions`}
                          value={step.instructions}
                          onChange={(e) => updateStep(index, { instructions: e.target.value })}
                          placeholder="Ex: Cumprimente o lead pelo nome e faça perguntas abertas sobre suas necessidades..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Quando avançar para o próximo passo?</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="max-w-xs">Define quando o agente deve considerar este passo concluído e avançar para o próximo.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <RadioGroup
                          value={step.completionCondition || "automatic"}
                          onValueChange={(value) => updateStep(index, { 
                            completionCondition: value as StepCompletionCondition 
                          })}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="automatic" id={`step-${index}-auto`} />
                            <Label htmlFor={`step-${index}-auto`} className="cursor-pointer">Automaticamente (após uma resposta)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="conditional" id={`step-${index}-conditional`} />
                            <Label htmlFor={`step-${index}-conditional`} className="cursor-pointer">Quando critério for atendido</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="manual" id={`step-${index}-manual`} />
                            <Label htmlFor={`step-${index}-manual`} className="cursor-pointer">Manualmente (pelo agente)</Label>
                          </div>
                        </RadioGroup>
                        
                        {step.completionCondition === "conditional" && (
                          <div className="pl-6 pt-1">
                            <Input
                              value={step.completionCriteria || ""}
                              onChange={(e) => updateStep(index, { completionCriteria: e.target.value })}
                              placeholder="Ex: cliente forneceu email ou telefone"
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </Card>
              ))}
              
              <div className="flex justify-center pt-2">
                <Button onClick={addStep} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar passo
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Templates */}
        <TabsContent value="template" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            {CONVERSATION_TEMPLATES.map((template) => (
              <Card key={template.id} className={`cursor-pointer transition-all ${selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`} onClick={() => setSelectedTemplate(template.id)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline">{template.steps.length} passos</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {template.steps.map((step, i) => (
                      <React.Fragment key={i}>
                        <span>{step.name}</span>
                        {i < template.steps.length - 1 && <ArrowRight className="h-3 w-3 mx-1" />}
                      </React.Fragment>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-4">
                  {selectedTemplate === template.id && (
                    <Button onClick={applyTemplate} size="sm" className="w-full">
                      Aplicar template
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Configurações avançadas */}
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configurações avançadas</CardTitle>
              <CardDescription>
                Opções avançadas para usuários experientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="use-system-prompt">Usar prompts de sistema personalizados</Label>
                  <Switch id="use-system-prompt" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Permite definir prompts de sistema detalhados para cada passo (para usuários avançados)
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="use-branches">Habilitar ramificações condicionais</Label>
                  <Switch id="use-branches" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Permite criar caminhos diferentes com base nas respostas do usuário
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pipeline-integration">Integração com pipeline</Label>
                  <Switch id="pipeline-integration" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Sincronizar avanços de conversa com movimentações no pipeline de vendas
                </p>
              </div>
              
              <div className="space-y-2 mt-6">
                <Label htmlFor="export-flow">Exportar/Importar fluxo</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Exportar JSON
                  </Button>
                  <Button variant="outline" size="sm">
                    Importar JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <CardTitle className="text-base text-amber-700">Dica para usuários avançados</CardTitle>
                  <CardDescription className="text-amber-600">
                    As configurações avançadas são recomendadas apenas para usuários com experiência em IA conversacional.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700">
                Para melhores resultados, comece com a visão simplificada ou com templates prontos,
                e personalize à medida que ganha experiência com os agentes.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Fluxo</Button>
      </div>
    </div>
  );
}