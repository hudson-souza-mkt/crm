import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Repeat, Clock, Zap, AlertTriangle, Sparkles } from "lucide-react";
import { useState } from "react";
import type { AIAgent, FollowUpInterval, FollowUpTrigger, EscalationRule, TimeUnit } from "@/types/aiAgent";

interface AgentFollowUpConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentFollowUpConfig({ data, onChange, onSave }: AgentFollowUpConfigProps) {
  const [newInterval, setNewInterval] = useState<Partial<FollowUpInterval>>({
    delay: 24,
    timeUnit: 'horas',
    message: "",
    condition: "",
    useContext: false,
    contextPrompt: ""
  });

  const updateFollowUpConfig = (field: string, value: any) => {
    onChange({
      followUpConfig: {
        ...data.followUpConfig,
        [field]: value
      }
    });
  };

  const handleAddInterval = () => {
    if (!newInterval.message) return;

    const interval: FollowUpInterval = {
      delay: newInterval.delay || 24,
      timeUnit: newInterval.timeUnit || 'horas',
      message: newInterval.message || "",
      condition: newInterval.condition,
      useContext: newInterval.useContext || false,
      contextPrompt: newInterval.contextPrompt
    };

    const currentIntervals = data.followUpConfig?.intervals || [];
    updateFollowUpConfig("intervals", [...currentIntervals, interval]);
    setNewInterval({ 
      delay: 24, 
      timeUnit: 'horas', 
      message: "", 
      condition: "", 
      useContext: false,
      contextPrompt: ""
    });
  };

  const handleRemoveInterval = (index: number) => {
    const currentIntervals = [...(data.followUpConfig?.intervals || [])];
    currentIntervals.splice(index, 1);
    updateFollowUpConfig("intervals", currentIntervals);
  };

  const handleTriggerChange = (trigger: FollowUpTrigger, checked: boolean) => {
    const currentTriggers = data.followUpConfig?.triggers || [];
    const updatedTriggers = checked
      ? [...currentTriggers, trigger]
      : currentTriggers.filter(t => t !== trigger);
    updateFollowUpConfig("triggers", updatedTriggers);
  };

  const getTriggerLabel = (trigger: FollowUpTrigger) => {
    const labels = {
      tempo: "Baseado em tempo",
      acao: "Baseado em ação",
      evento: "Baseado em evento",
      manual: "Manual"
    };
    return labels[trigger];
  };

  const getTriggerDescription = (trigger: FollowUpTrigger) => {
    const descriptions = {
      tempo: "Follow-up automático após período determinado",
      acao: "Disparado por ações do lead (abertura de email, click, etc.)",
      evento: "Disparado por eventos específicos (data especial, milestone, etc.)",
      manual: "Disparado manualmente pelo usuário"
    };
    return descriptions[trigger];
  };

  const formatTimeDisplay = (delay: number, timeUnit: TimeUnit) => {
    return `${delay} ${timeUnit}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Configurações de Follow-up</h3>
        <p className="text-sm text-muted-foreground">
          Configure follow-ups automáticos para nutrir leads e manter relacionamentos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Ative e configure o comportamento geral dos follow-ups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="followUpEnabled">Ativar Follow-ups Automáticos</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que o agente envie follow-ups automaticamente
                </p>
              </div>
              <Switch
                id="followUpEnabled"
                checked={data.followUpConfig?.enabled || false}
                onCheckedChange={(checked) => updateFollowUpConfig("enabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <Label htmlFor="useConversationContext">Usar Contexto da Conversa</Label>
                <p className="text-sm text-muted-foreground">
                  Permite que o agente use informações da conversa anterior nos follow-ups
                </p>
              </div>
              <Switch
                id="useConversationContext"
                checked={data.followUpConfig?.useConversationContext || false}
                onCheckedChange={(checked) => updateFollowUpConfig("useConversationContext", checked)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="maxAttempts">Máximo de Tentativas</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min="1"
                  max="10"
                  value={data.followUpConfig?.maxAttempts || 3}
                  onChange={(e) => updateFollowUpConfig("maxAttempts", parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Quantas vezes o agente tentará contato antes de parar
                </p>
              </div>

              <div>
                <Label htmlFor="escalationRules">Regra de Escalação</Label>
                <Select
                  value={data.followUpConfig?.escalationRules || "condicional"}
                  onValueChange={(value: EscalationRule) => updateFollowUpConfig("escalationRules", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sempre_humano">Sempre escalar para humano</SelectItem>
                    <SelectItem value="condicional">Escalação condicional</SelectItem>
                    <SelectItem value="nunca">Nunca escalar</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Quando passar o atendimento para um humano
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Triggers de Follow-up */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Triggers de Ativação
            </CardTitle>
            <CardDescription>
              Defina quando os follow-ups devem ser disparados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(["tempo", "acao", "evento", "manual"] as FollowUpTrigger[]).map((trigger) => (
              <div key={trigger} className="flex items-start gap-3 p-3 border rounded-lg">
                <Switch
                  checked={data.followUpConfig?.triggers?.includes(trigger) || false}
                  onCheckedChange={(checked) => handleTriggerChange(trigger, checked)}
                />
                <div className="flex-1">
                  <Label className="font-medium">{getTriggerLabel(trigger)}</Label>
                  <p className="text-sm text-muted-foreground">
                    {getTriggerDescription(trigger)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Intervalos de Follow-up */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Intervalos de Follow-up
            </CardTitle>
            <CardDescription>
              Configure quando e como os follow-ups serão enviados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulário para novo intervalo */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <h5 className="font-medium mb-3">Adicionar Novo Intervalo</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="intervalDelay">Valor</Label>
                  <Input
                    id="intervalDelay"
                    type="number"
                    min="1"
                    value={newInterval.delay || 24}
                    onChange={(e) => setNewInterval({ ...newInterval, delay: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="timeUnit">Unidade</Label>
                  <Select
                    value={newInterval.timeUnit || 'horas'}
                    onValueChange={(value: TimeUnit) => setNewInterval({ ...newInterval, timeUnit: value })}
                  >
                    <SelectTrigger id="timeUnit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutos">Minutos</SelectItem>
                      <SelectItem value="horas">Horas</SelectItem>
                      <SelectItem value="dias">Dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="intervalMessage">Mensagem</Label>
                  <Input
                    id="intervalMessage"
                    value={newInterval.message || ""}
                    onChange={(e) => setNewInterval({ ...newInterval, message: e.target.value })}
                    placeholder="Ex: Olá! Como posso ajudar com mais alguma coisa?"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Label htmlFor="intervalCondition">Condição (opcional)</Label>
                <Input
                  id="intervalCondition"
                  value={newInterval.condition || ""}
                  onChange={(e) => setNewInterval({ ...newInterval, condition: e.target.value })}
                  placeholder="Ex: se não respondeu ao email anterior"
                />
              </div>
              
              <div className="mt-4 p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <Label htmlFor="useContext" className="font-medium">
                      Usar contexto da conversa
                    </Label>
                  </div>
                  <Switch
                    id="useContext"
                    checked={newInterval.useContext || false}
                    onCheckedChange={(checked) => setNewInterval({ ...newInterval, useContext: checked })}
                  />
                </div>
                
                {newInterval.useContext && (
                  <div className="mt-3">
                    <Label htmlFor="contextPrompt">Prompt de contextualização</Label>
                    <Textarea
                      id="contextPrompt"
                      value={newInterval.contextPrompt || ""}
                      onChange={(e) => setNewInterval({ ...newInterval, contextPrompt: e.target.value })}
                      placeholder="Ex: Utilize os tópicos discutidos na conversa anterior para personalizar a mensagem de follow-up"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Instrua o agente sobre como usar o contexto da conversa anterior
                    </p>
                  </div>
                )}
              </div>
              
              <Button onClick={handleAddInterval} className="mt-3" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Intervalo
              </Button>
            </div>

            {/* Lista de intervalos */}
            {data.followUpConfig?.intervals && data.followUpConfig.intervals.length > 0 && (
              <div className="space-y-3">
                <Label>Intervalos Configurados:</Label>
                {data.followUpConfig.intervals.map((interval, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatTimeDisplay(interval.delay, interval.timeUnit || 'horas')} após
                        </span>
                        {interval.condition && (
                          <span className="text-sm text-muted-foreground">
                            ({interval.condition})
                          </span>
                        )}
                        {interval.useContext && (
                          <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Contextualizado
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{interval.message}</p>
                      {interval.contextPrompt && interval.useContext && (
                        <div className="mt-1 text-xs text-muted-foreground border-l-2 border-amber-300 pl-2">
                          <p className="font-medium text-amber-700">Instrução de contexto:</p>
                          <p>{interval.contextPrompt}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveInterval(index)}
                      className="h-8 w-8 text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configurações Avançadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Configurações Avançadas
            </CardTitle>
            <CardDescription>
              Configurações especiais para casos específicos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weekendFollowUp">Follow-up em Fins de Semana</Label>
                <Select defaultValue="nao">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Permitir</SelectItem>
                    <SelectItem value="nao">Não permitir</SelectItem>
                    <SelectItem value="apenas_sabado">Apenas sábado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeWindow">Janela de Horário</Label>
                <Select defaultValue="comercial">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comercial">Horário comercial (9h-18h)</SelectItem>
                    <SelectItem value="estendido">Estendido (8h-20h)</SelectItem>
                    <SelectItem value="24h">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="pauseConditions">Condições para Pausar Follow-up</Label>
              <Textarea
                id="pauseConditions"
                placeholder="Ex: Se o lead responder, se marcar como não interessado, se solicitar remoção..."
                rows={3}
              />
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