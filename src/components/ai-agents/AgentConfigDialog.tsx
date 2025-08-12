import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentBasicConfig } from "./config/AgentBasicConfig";
import { AgentInstructionsConfig } from "./config/AgentInstructionsConfig";
import { AgentCompanyConfig } from "./config/AgentCompanyConfig";
import { AgentProductsConfig } from "./config/AgentProductsConfig";
import { AgentFAQConfig } from "./config/AgentFAQConfig";
import { AgentFollowUpConfig } from "./config/AgentFollowUpConfig";
import { AgentIntegrationsConfig } from "./config/AgentIntegrationsConfig";
import { AgentTestChat } from "./config/AgentTestChat";
import { AgentAdvancedConfig } from "./config/AgentAdvancedConfig";
import {
  Bot,
  FileText,
  Building,
  Package,
  HelpCircle,
  Repeat,
  Plug,
  MessageSquare,
  Settings
} from "lucide-react";
import type { AIAgent } from "@/types/aiAgent";

interface AgentConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AIAgent | null;
  onSave: (agentData: Partial<AIAgent>) => void;
}

export function AgentConfigDialog({
  open,
  onOpenChange,
  agent,
  onSave
}: AgentConfigDialogProps) {
  const [formData, setFormData] = useState<Partial<AIAgent>>({});
  const [activeTab, setActiveTab] = useState("basico");

  useEffect(() => {
    if (agent) {
      setFormData(agent);
    } else {
      setFormData({
        type: "atendimento",
        status: "inativo",
        tone: "profissional",
        language: "pt-BR",
        companyInfo: {
          name: "",
          description: "",
          mission: "",
          values: [],
          differentials: [],
          targetAudience: ""
        },
        products: [],
        services: [],
        faqs: [],
        knowledgeBase: [],
        followUpConfig: {
          enabled: false,
          triggers: [],
          intervals: [],
          maxAttempts: 3,
          escalationRules: "condicional"
        },
        integrations: {
          whatsapp: false,
          email: false,
          webchat: false,
          telegram: false,
          instagram: false
        },
        advancedConfig: {
          maxResponseTime: 5,
          confidenceThreshold: 0.8,
          escalateOnLowConfidence: true,
          saveConversationHistory: true,
          learningMode: true
        },
        tags: []
      });
    }
  }, [agent]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const updateFormData = (updates: Partial<AIAgent>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1200px] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {agent ? `Editar ${agent.name}` : "Novo Agente de IA"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-9 px-6 py-2">
              <TabsTrigger value="basico" className="flex items-center gap-1 text-xs">
                <Bot className="h-3 w-3" />
                <span className="hidden sm:inline">Básico</span>
              </TabsTrigger>
              <TabsTrigger value="instrucoes" className="flex items-center gap-1 text-xs">
                <FileText className="h-3 w-3" />
                <span className="hidden sm:inline">Instruções</span>
              </TabsTrigger>
              <TabsTrigger value="empresa" className="flex items-center gap-1 text-xs">
                <Building className="h-3 w-3" />
                <span className="hidden sm:inline">Empresa</span>
              </TabsTrigger>
              <TabsTrigger value="produtos" className="flex items-center gap-1 text-xs">
                <Package className="h-3 w-3" />
                <span className="hidden sm:inline">Produtos</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-1 text-xs">
                <HelpCircle className="h-3 w-3" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="followup" className="flex items-center gap-1 text-xs">
                <Repeat className="h-3 w-3" />
                <span className="hidden sm:inline">Follow-up</span>
              </TabsTrigger>
              <TabsTrigger value="integracoes" className="flex items-center gap-1 text-xs">
                <Plug className="h-3 w-3" />
                <span className="hidden sm:inline">Canais</span>
              </TabsTrigger>
              <TabsTrigger value="teste" className="flex items-center gap-1 text-xs">
                <MessageSquare className="h-3 w-3" />
                <span className="hidden sm:inline">Teste</span>
              </TabsTrigger>
              <TabsTrigger value="avancado" className="flex items-center gap-1 text-xs">
                <Settings className="h-3 w-3" />
                <span className="hidden sm:inline">Avançado</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="basico" className="p-6 mt-0">
                <AgentBasicConfig
                  data={formData}
                  onChange={updateFormData}
                  onSave={handleSave}
                />
              </TabsContent>
              
              <TabsContent value="instrucoes" className="p-6 mt-0">
                <AgentInstructionsConfig
                  data={formData}
                  onChange={updateFormData}
                  onSave={handleSave}
                />
              </TabsContent>
              
              <TabsContent value="empresa" className="p-6 mt-0">
                <AgentCompanyConfig
                  data={formData}
                  onChange={updateFormData}
                  onSave={handleSave}
                />
              </TabsContent>
              
              <TabsContent value="produtos" className="p-6 mt-0">
                <AgentProductsConfig
                  data={formData}
                  onChange={updateFormData}
                  onSave={handleSave}
                />
              </TabsContent>
              
              <TabsContent value="faq" className="p-6 mt-0">
                <AgentFAQConfig
                  data={formData}
                  onChange={updateFormData}
                  onSave={handleSave}
                />
              </TabsContent>
              
              <TabsContent value="followup" className="p-6 mt-0">
                <AgentFollowUpConfig
                  data={formData}
                  onChange={updateFormData}
                  onSave={handleSave}
                />
              </TabsContent>
              
              <TabsContent value="integracoes" className="p-6 mt-0">
                <AgentIntegrationsConfig
                  data={formData}
                  onChange={updateFormData}
                  onSave={handleSave}
                />
              </TabsContent>
              
              <TabsContent value="teste" className="p-6 mt-0">
                <AgentTestChat
                  agent={formData as AIAgent}
                />
              </TabsContent>
              
              <TabsContent value="avancado" className="p-6 mt-0">
                <AgentAdvancedConfig
                  data={formData}
                  onChange={updateFormData}
                  onSave={handleSave}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}