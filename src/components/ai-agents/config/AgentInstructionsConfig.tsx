import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import type { AIAgent } from "@/types/aiAgent";

interface AgentInstructionsConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentInstructionsConfig({ data, onChange, onSave }: AgentInstructionsConfigProps) {
  const [newFlowStep, setNewFlowStep] = useState("");
  const [newProhibitedTopic, setNewProhibitedTopic] = useState("");

  const handleAddFlowStep = () => {
    if (newFlowStep.trim()) {
      onChange({
        conversationFlow: [...(data.conversationFlow || []), newFlowStep.trim()]
      });
      setNewFlowStep("");
    }
  };

  const handleRemoveFlowStep = (index: number) => {
    const newFlow = [...(data.conversationFlow || [])];
    newFlow.splice(index, 1);
    onChange({ conversationFlow: newFlow });
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Instruções e Comportamento</h3>
        <p className="text-sm text-muted-foreground">
          Configure como o agente deve se comportar e conduzir conversas
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Instruções do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Instruções do Sistema
            </CardTitle>
            <CardDescription>
              Instruções principais que definem o comportamento do agente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="systemInstructions">Prompt do Sistema</Label>
              <Textarea
                id="systemInstructions"
                value={data.systemInstructions || ""}
                onChange={(e) => onChange({ systemInstructions: e.target.value })}
                placeholder="Você é um assistente virtual especializado em... Sua missão é..."
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use {"{nome}"}, {"{empresa}"} para personalização automática
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Fluxo de Conversa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Fluxo de Conversa
            </CardTitle>
            <CardDescription>
              Defina os passos que o agente deve seguir durante a conversa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFlowStep}
                onChange={(e) => setNewFlowStep(e.target.value)}
                placeholder="Ex: Cumprimentar o cliente"
                onKeyPress={(e) => e.key === "Enter" && handleAddFlowStep()}
              />
              <Button onClick={handleAddFlowStep} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.conversationFlow && data.conversationFlow.length > 0 && (
              <div className="space-y-2">
                <Label>Passos do Fluxo:</Label>
                {data.conversationFlow.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFlowStep(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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

        {/* Exemplos de Diálogos */}
        <Card>
          <CardHeader>
            <CardTitle>Exemplos de Diálogos</CardTitle>
            <CardDescription>
              Exemplos de como o agente deve responder em situações específicas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="greeting">Saudação Inicial</Label>
                <Textarea
                  id="greeting"
                  placeholder="Olá! Sou [nome do agente]. Como posso ajudar você hoje?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="objection">Tratamento de Objeções</Label>
                <Textarea
                  id="objection"
                  placeholder="Entendo sua preocupação. Deixe-me esclarecer..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="closing">Encerramento</Label>
                <Textarea
                  id="closing"
                  placeholder="Foi um prazer ajudar! Há mais alguma coisa que posso fazer?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="escalation">Escalação para Humano</Label>
                <Textarea
                  id="escalation"
                  placeholder="Vou conectar você com um especialista humano..."
                  rows={3}
                />
              </div>
            </div>
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