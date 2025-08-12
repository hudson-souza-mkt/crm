import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Zap } from "lucide-react";
import type { AgentTemplate } from "@/types/aiAgent";

interface AgentTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: AgentTemplate) => void;
}

const templates: AgentTemplate[] = [
  {
    id: "template-1",
    name: "Atendimento E-commerce",
    description: "Agente especializado em atendimento para lojas online",
    type: "atendimento",
    industry: "E-commerce",
    popular: true,
    config: {
      objective: "Fornecer suporte excepcional para clientes de e-commerce",
      personality: "Amigável, prestativo e focado em resolver problemas rapidamente",
      tone: "amigavel"
    }
  },
  {
    id: "template-2",
    name: "Qualificador SaaS",
    description: "Especialista em qualificar leads para empresas de software",
    type: "qualificacao",
    industry: "SaaS",
    popular: true,
    config: {
      objective: "Qualificar leads B2B identificando necessidades e budget",
      personality: "Consultivo, investigativo e focado em entender necessidades",
      tone: "consultivo"
    }
  },
  {
    id: "template-3",
    name: "Vendedor Imobiliário",
    description: "Agente de vendas para mercado imobiliário",
    type: "vendas",
    industry: "Imobiliário",
    popular: false,
    config: {
      objective: "Apresentar imóveis e conduzir negociações",
      personality: "Persuasivo, conhecedor do mercado e orientado a resultados",
      tone: "profissional"
    }
  },
  {
    id: "template-4",
    name: "Suporte Técnico",
    description: "Agente para suporte técnico e troubleshooting",
    type: "suporte",
    industry: "Tecnologia",
    popular: false,
    config: {
      objective: "Resolver problemas técnicos de forma eficiente",
      personality: "Paciente, técnico e didático",
      tone: "profissional"
    }
  }
];

export function AgentTemplatesDialog({
  open,
  onOpenChange,
  onSelectTemplate
}: AgentTemplatesDialogProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "atendimento": return "🎧";
      case "qualificacao": return "🎯";
      case "vendas": return "💰";
      case "followup": return "📞";
      case "suporte": return "🛠️";
      default: return "🤖";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "atendimento": return "bg-blue-100 text-blue-700";
      case "qualificacao": return "bg-purple-100 text-purple-700";
      case "vendas": return "bg-green-100 text-green-700";
      case "followup": return "bg-orange-100 text-orange-700";
      case "suporte": return "bg-cyan-100 text-cyan-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Templates de Agentes
          </DialogTitle>
          <DialogDescription>
            Escolha um template pré-configurado para acelerar a criação do seu agente
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getTypeIcon(template.type)}</div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {template.name}
                        {template.popular && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${getTypeColor(template.type)}`}>
                          {template.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.industry}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Objetivo:</p>
                    <p className="text-sm">{template.config.objective}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Personalidade:</p>
                    <p className="text-sm">{template.config.personality}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={() => {
                    onSelectTemplate(template);
                    onOpenChange(false);
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Os templates são pontos de partida. Você pode personalizar 
            completamente todas as configurações após selecionar um template.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}