import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Zap, Shield, Brain, Clock, Database, AlertTriangle } from "lucide-react";
import type { AIAgent } from "@/types/aiAgent";

interface AgentAdvancedConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentAdvancedConfig({ data, onChange, onSave }: AgentAdvancedConfigProps) {
  const updateAdvancedConfig = (field: string, value: any) => {
    onChange({
      advancedConfig: {
        ...data.advancedConfig,
        [field]: value
      }
    });
  };

  const confidenceThreshold = data.advancedConfig?.confidenceThreshold || 0.8;
  const maxResponseTime = data.advancedConfig?.maxResponseTime || 5;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Configurações Avançadas</h3>
        <p className="text-sm text-muted-foreground">
          Configure parâmetros técnicos e comportamentos avançados do agente
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Performance e Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance e Timing
            </CardTitle>
            <CardDescription>
              Configure tempos de resposta e performance do agente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="maxResponseTime">Tempo Máximo de Resposta</Label>
                <span className="text-sm text-muted-foreground">{maxResponseTime}s</span>
              </div>
              <Slider
                id="maxResponseTime"
                min={1}
                max={30}
                step={1}
                value={[maxResponseTime]}
                onValueChange={(value) => updateAdvancedConfig("maxResponseTime", value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tempo limite para o agente gerar uma resposta
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="processingMode">Modo de Processamento</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Rápido (menos preciso)</SelectItem>
                    <SelectItem value="balanced">Balanceado</SelectItem>
                    <SelectItem value="accurate">Preciso (mais lento)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="concurrentChats">Chats Simultâneos</Label>
                <Input
                  id="concurrentChats"
                  type="number"
                  min="1"
                  max="100"
                  defaultValue="10"
                  placeholder="10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confiança e Escalação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Confiança e Escalação
            </CardTitle>
            <CardDescription>
              Configure quando o agente deve escalar para um humano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="confidenceThreshold">Limite de Confiança</Label>
                <span className="text-sm text-muted-foreground">{(confidenceThreshold * 100).toFixed(0)}%</span>
              </div>
              <Slider
                id="confidenceThreshold"
                min={0.1}
                max={1}
                step={0.05}
                value={[confidenceThreshold]}
                onValueChange={(value) => updateAdvancedConfig("confidenceThreshold", value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nível mínimo de confiança para o agente responder automaticamente
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Escalar em Baixa Confiança</Label>
                  <p className="text-sm text-muted-foreground">
                    Transferir para humano quando confiança estiver baixa
                  </p>
                </div>
                <Switch
                  checked={data.advancedConfig?.escalateOnLowConfidence || false}
                  onCheckedChange={(checked) => updateAdvancedConfig("escalateOnLowConfidence", checked)}
                />
              </div>

              <div>
                <Label htmlFor="escalationMessage">Mensagem de Escalação</Label>
                <Input
                  id="escalationMessage"
                  placeholder="Vou conectar você com um especialista humano..."
                  defaultValue="Vou conectar você com um especialista humano que poderá ajudar melhor com sua solicitação."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aprendizado e Memória */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Aprendizado e Memória
            </CardTitle>
            <CardDescription>
              Configure como o agente aprende e armazena informações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo de Aprendizado</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que o agente aprenda com conversas passadas
                  </p>
                </div>
                <Switch
                  checked={data.advancedConfig?.learningMode || false}
                  onCheckedChange={(checked) => updateAdvancedConfig("learningMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Salvar Histórico de Conversas</Label>
                  <p className="text-sm text-muted-foreground">
                    Armazenar conversas para análise e melhoria
                  </p>
                </div>
                <Switch
                  checked={data.advancedConfig?.saveConversationHistory || false}
                  onCheckedChange={(checked) => updateAdvancedConfig("saveConversationHistory", checked)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="memoryDuration">Duração da Memória</Label>
                <Select defaultValue="30days">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Apenas sessão atual</SelectItem>
                    <SelectItem value="7days">7 dias</SelectItem>
                    <SelectItem value="30days">30 dias</SelectItem>
                    <SelectItem value="90days">90 dias</SelectItem>
                    <SelectItem value="forever">Permanente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="learningRate">Taxa de Aprendizado</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservadora</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="aggressive">Agressiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segurança e Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança e Privacidade
            </CardTitle>
            <CardDescription>
              Configure proteções e políticas de privacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Filtro de Conteúdo Sensível</Label>
                  <p className="text-sm text-muted-foreground">
                    Bloquear automaticamente conteúdo inadequado
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Anonimizar Dados Pessoais</Label>
                  <p className="text-sm text-muted-foreground">
                    Remover informações pessoais dos logs
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Criptografia de Conversas</Label>
                  <p className="text-sm text-muted-foreground">
                    Criptografar conversas armazenadas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataRetention">Retenção de Dados</Label>
                <Select defaultValue="1year">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">30 dias</SelectItem>
                    <SelectItem value="90days">90 dias</SelectItem>
                    <SelectItem value="6months">6 meses</SelectItem>
                    <SelectItem value="1year">1 ano</SelectItem>
                    <SelectItem value="2years">2 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accessLevel">Nível de Acesso</Label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restricted">Restrito</SelectItem>
                    <SelectItem value="standard">Padrão</SelectItem>
                    <SelectItem value="elevated">Elevado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitoramento e Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Monitoramento e Logs
            </CardTitle>
            <CardDescription>
              Configure coleta de dados e monitoramento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Logs Detalhados</Label>
                  <p className="text-sm text-muted-foreground">
                    Registrar informações detalhadas sobre conversas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Métricas de Performance</Label>
                  <p className="text-sm text-muted-foreground">
                    Coletar dados sobre tempo de resposta e eficiência
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de Erro</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar sobre erros e problemas técnicos
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logLevel">Nível de Log</Label>
                <Select defaultValue="info">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Apenas erros</SelectItem>
                    <SelectItem value="warn">Avisos e erros</SelectItem>
                    <SelectItem value="info">Informações gerais</SelectItem>
                    <SelectItem value="debug">Debug completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="alertEmail">Email para Alertas</Label>
                <Input
                  id="alertEmail"
                  type="email"
                  placeholder="admin@empresa.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações Experimentais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Configurações Experimentais
            </CardTitle>
            <CardDescription>
              Funcionalidades em teste - use com cuidado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Atenção:</strong> As configurações abaixo são experimentais e podem afetar 
                o comportamento do agente. Use apenas em ambiente de teste.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo Criativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite respostas mais criativas e menos previsíveis
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Treinamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Agente se treina automaticamente com feedback
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Integração com IA Externa</Label>
                  <p className="text-sm text-muted-foreground">
                    Conectar com outros modelos de IA para respostas híbridas
                  </p>
                </div>
                <Switch />
              </div>
            </div>

            <div>
              <Label htmlFor="experimentalFeatures">Recursos Experimentais</Label>
              <Select defaultValue="none">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  <SelectItem value="voice">Síntese de voz</SelectItem>
                  <SelectItem value="vision">Análise de imagens</SelectItem>
                  <SelectItem value="multimodal">Multimodal completo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Backup e Versionamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Backup e Versionamento
            </CardTitle>
            <CardDescription>
              Configure backup automático e controle de versões
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Criar backup das configurações automaticamente
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Versionamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Manter histórico de versões das configurações
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxVersions">Máximo de Versões</Label>
                <Input
                  id="maxVersions"
                  type="number"
                  min="1"
                  max="50"
                  defaultValue="10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Criar Backup Manual
              </Button>
              <Button variant="outline" size="sm">
                Ver Histórico de Versões
              </Button>
              <Button variant="outline" size="sm">
                Restaurar Versão
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Configurações Avançadas</Button>
      </div>
    </div>
  );
}