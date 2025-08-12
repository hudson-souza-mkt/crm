import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Mail, 
  Globe, 
  Send, 
  Instagram, 
  Plug,
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";
import type { AIAgent } from "@/types/aiAgent";

interface AgentIntegrationsConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentIntegrationsConfig({ data, onChange, onSave }: AgentIntegrationsConfigProps) {
  const updateIntegration = (channel: string, enabled: boolean) => {
    onChange({
      integrations: {
        ...data.integrations,
        [channel]: enabled
      }
    });
  };

  const integrationChannels = [
    {
      key: "whatsapp",
      name: "WhatsApp",
      icon: MessageSquare,
      description: "Integração com WhatsApp Business API",
      color: "text-green-600",
      bgColor: "bg-green-50",
      status: "available",
      features: ["Mensagens automáticas", "Mídia", "Botões interativos", "Listas"]
    },
    {
      key: "email",
      name: "Email",
      icon: Mail,
      description: "Integração com provedores de email",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "available",
      features: ["Templates HTML", "Anexos", "Tracking", "Automações"]
    },
    {
      key: "webchat",
      name: "Web Chat",
      icon: Globe,
      description: "Widget de chat para seu website",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "available",
      features: ["Embed fácil", "Customização", "Offline", "Histórico"]
    },
    {
      key: "telegram",
      name: "Telegram",
      icon: Send,
      description: "Bot do Telegram para atendimento",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      status: "beta",
      features: ["Bot API", "Grupos", "Canais", "Inline keyboards"]
    },
    {
      key: "instagram",
      name: "Instagram",
      icon: Instagram,
      description: "Direct Messages do Instagram",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      status: "coming_soon",
      features: ["DM automático", "Stories", "Comentários", "Menções"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disponível
          </Badge>
        );
      case "beta":
        return (
          <Badge variant="outline" className="text-orange-600 bg-orange-50">
            <AlertCircle className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        );
      case "coming_soon":
        return (
          <Badge variant="outline" className="text-gray-600 bg-gray-50">
            Em breve
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Integrações e Canais</h3>
        <p className="text-sm text-muted-foreground">
          Configure os canais de comunicação onde o agente estará ativo
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {integrationChannels.map((channel) => {
          const Icon = channel.icon;
          const isEnabled = data.integrations?.[channel.key as keyof typeof data.integrations] || false;
          const isAvailable = channel.status === "available" || channel.status === "beta";

          return (
            <Card key={channel.key} className={`transition-all ${isEnabled ? 'ring-2 ring-primary/20' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${channel.bgColor}`}>
                      <Icon className={`h-5 w-5 ${channel.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {channel.name}
                        {getStatusBadge(channel.status)}
                      </CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => updateIntegration(channel.key, checked)}
                    disabled={!isAvailable}
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Features */}
                  <div>
                    <Label className="text-sm font-medium">Funcionalidades:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {channel.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Configurações específicas quando ativo */}
                  {isEnabled && isAvailable && (
                    <div className="p-3 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="h-4 w-4" />
                        <Label className="font-medium">Configurações do {channel.name}</Label>
                      </div>
                      
                      {channel.key === "whatsapp" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="whatsapp-token">Token da API</Label>
                            <Input
                              id="whatsapp-token"
                              placeholder="Seu token do WhatsApp Business"
                              type="password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                            <Input
                              id="whatsapp-number"
                              placeholder="+55 11 99999-9999"
                            />
                          </div>
                        </div>
                      )}

                      {channel.key === "email" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="email-provider">Provedor</Label>
                            <select className="w-full p-2 border rounded-md">
                              <option>Gmail</option>
                              <option>Outlook</option>
                              <option>SendGrid</option>
                              <option>Mailgun</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="email-from">Email Remetente</Label>
                            <Input
                              id="email-from"
                              placeholder="agente@suaempresa.com"
                              type="email"
                            />
                          </div>
                        </div>
                      )}

                      {channel.key === "webchat" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="webchat-domain">Domínio Autorizado</Label>
                            <Input
                              id="webchat-domain"
                              placeholder="www.suaempresa.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="webchat-position">Posição do Widget</Label>
                            <select className="w-full p-2 border rounded-md">
                              <option>Canto inferior direito</option>
                              <option>Canto inferior esquerdo</option>
                              <option>Centro da tela</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {channel.key === "telegram" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="telegram-token">Bot Token</Label>
                            <Input
                              id="telegram-token"
                              placeholder="Seu bot token do Telegram"
                              type="password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="telegram-username">Username do Bot</Label>
                            <Input
                              id="telegram-username"
                              placeholder="@seubot"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          Testar Conexão
                        </Button>
                        <Button variant="outline" size="sm">
                          Ver Documentação
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Mensagem para canais não disponíveis */}
                  {!isAvailable && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {channel.status === "coming_soon" 
                          ? "Esta integração estará disponível em breve. Cadastre-se para ser notificado."
                          : "Esta integração está em desenvolvimento."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo das Integrações Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Resumo das Integrações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Object.values(data.integrations || {}).filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Canais Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {integrationChannels.filter(c => c.status === "available").length}
              </div>
              <div className="text-sm text-muted-foreground">Disponíveis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {integrationChannels.filter(c => c.status === "beta").length}
              </div>
              <div className="text-sm text-muted-foreground">Em Beta</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Integrações</Button>
      </div>
    </div>
  );
}