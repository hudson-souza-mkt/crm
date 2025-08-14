import { useState, useEffect } from "react";
import type { AIAgent } from "@/types/aiAgent";

// Dados fictícios para simulação
const MOCK_AGENTS: AIAgent[] = [
  {
    id: "agent-1",
    name: "Atendente Virtual",
    description: "Agente de atendimento inicial para qualificação e direcionamento",
    type: "atendimento",
    status: "ativo",
    objective: "Realizar atendimento inicial, identificar necessidades e direcionar para o setor correto",
    personality: "Cordial, atencioso e eficiente",
    tone: "profissional",
    language: "pt-BR",
    avatar: "https://ui-avatars.com/api/?name=Atendente&background=6366f1&color=fff",
    systemInstructions: "Atenda os clientes de forma cordial e identifique suas necessidades principais",
    conversationFlow: [],
    prohibitedTopics: ["política", "religião"],
    companyInfo: {
      name: "Space Sales",
      description: "Plataforma de CRM e vendas",
      mission: "Ajudar empresas a venderem mais e melhor",
      values: ["Inovação", "Excelência", "Foco no cliente"],
      differentials: ["Inteligência artificial", "Facilidade de uso", "Suporte 24/7"],
      targetAudience: "Empresas de pequeno e médio porte"
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
      whatsapp: true,
      email: true,
      webchat: true,
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
    dataExtractionConfig: {
      enabled: true,
      autoUpdate: true,
      confirmBeforeUpdate: true,
      requestMissingFields: true,
      fields: [
        {
          id: "field-1",
          name: "Nome",
          key: "nome",
          description: "Nome completo do lead",
          required: true,
          extractionPatterns: [
            "Meu nome é {valor}",
            "Me chamo {valor}",
            "Sou {valor}"
          ],
          destination: {
            field: "name",
            entityType: "lead"
          }
        },
        {
          id: "field-2",
          name: "Email",
          key: "email",
          description: "Email do lead",
          required: true,
          extractionPatterns: [
            "Meu email é {valor}",
            "Você pode me contatar em {valor}"
          ],
          destination: {
            field: "email",
            entityType: "lead"
          }
        },
        {
          id: "field-3",
          name: "Empresa",
          key: "empresa",
          description: "Empresa do lead",
          required: false,
          extractionPatterns: [
            "Trabalho na {valor}",
            "Sou da empresa {valor}",
            "Represento a {valor}"
          ],
          destination: {
            field: "company",
            entityType: "lead"
          }
        }
      ]
    },
    metrics: {
      totalConversations: 245,
      successfulQualifications: 189,
      conversionRate: 0.72,
      averageResponseTime: 3.5,
      satisfactionScore: 4.7,
      lastTrainingDate: new Date("2023-10-15")
    },
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-11-10"),
    createdBy: "admin",
    version: "1.2",
    tags: ["atendimento", "qualificação"]
  },
  {
    id: "agent-2",
    name: "Vendedor Virtual",
    description: "Agente especializado em vendas e negociações",
    type: "vendas",
    status: "ativo",
    objective: "Converter leads qualificados em clientes, apresentar propostas e fechar negócios",
    personality: "Persuasivo, confiante e objetivo",
    tone: "consultivo",
    language: "pt-BR",
    avatar: "https://ui-avatars.com/api/?name=Vendedor&background=22c55e&color=fff",
    systemInstructions: "Apresente propostas comerciais, destaque benefícios e feche negócios",
    conversationFlow: [],
    prohibitedTopics: ["descontos não autorizados", "garantias irreais"],
    companyInfo: {
      name: "Space Sales",
      description: "Plataforma de CRM e vendas",
      mission: "Ajudar empresas a venderem mais e melhor",
      values: ["Inovação", "Excelência", "Foco no cliente"],
      differentials: ["Inteligência artificial", "Facilidade de uso", "Suporte 24/7"],
      targetAudience: "Empresas de pequeno e médio porte"
    },
    products: [],
    services: [],
    faqs: [],
    knowledgeBase: [],
    followUpConfig: {
      enabled: true,
      triggers: ["tempo"],
      intervals: [],
      maxAttempts: 5,
      escalationRules: "condicional"
    },
    integrations: {
      whatsapp: true,
      email: true,
      webchat: true,
      telegram: false,
      instagram: false
    },
    advancedConfig: {
      maxResponseTime: 5,
      confidenceThreshold: 0.85,
      escalateOnLowConfidence: true,
      saveConversationHistory: true,
      learningMode: true
    },
    metrics: {
      totalConversations: 187,
      successfulQualifications: 135,
      conversionRate: 0.68,
      averageResponseTime: 4.2,
      satisfactionScore: 4.5,
      lastTrainingDate: new Date("2023-10-20")
    },
    createdAt: new Date("2023-09-15"),
    updatedAt: new Date("2023-11-05"),
    createdBy: "admin",
    version: "1.1",
    tags: ["vendas", "negociação"]
  },
  {
    id: "agent-3",
    name: "Qualificador de Leads",
    description: "Agente especializado em qualificar leads e identificar oportunidades",
    type: "qualificacao",
    status: "ativo",
    objective: "Avaliar o potencial de cada lead, coletar informações relevantes e priorizar oportunidades",
    personality: "Analítico, investigativo e estratégico",
    tone: "profissional",
    language: "pt-BR",
    avatar: "https://ui-avatars.com/api/?name=Qualificador&background=f59e0b&color=fff",
    systemInstructions: "Identifique os critérios BANT, colete informações do lead e avalie o potencial de negócio",
    conversationFlow: [],
    prohibitedTopics: [],
    companyInfo: {
      name: "Space Sales",
      description: "Plataforma de CRM e vendas",
      mission: "Ajudar empresas a venderem mais e melhor",
      values: ["Inovação", "Excelência", "Foco no cliente"],
      differentials: ["Inteligência artificial", "Facilidade de uso", "Suporte 24/7"],
      targetAudience: "Empresas de pequeno e médio porte"
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
      whatsapp: true,
      email: true,
      webchat: true,
      telegram: false,
      instagram: false
    },
    advancedConfig: {
      maxResponseTime: 5,
      confidenceThreshold: 0.75,
      escalateOnLowConfidence: true,
      saveConversationHistory: true,
      learningMode: true
    },
    dataExtractionConfig: {
      enabled: true,
      autoUpdate: true,
      confirmBeforeUpdate: true,
      requestMissingFields: true,
      fields: [
        {
          id: "field-1",
          name: "Orçamento",
          key: "orcamento",
          description: "Orçamento disponível do lead",
          required: true,
          extractionPatterns: [
            "Temos um orçamento de {valor}",
            "Podemos investir {valor}",
            "Nosso budget é de {valor}"
          ],
          destination: {
            field: "value",
            entityType: "lead"
          }
        },
        {
          id: "field-2",
          name: "Tamanho da Equipe",
          key: "tamanho_equipe",
          description: "Número de pessoas na equipe",
          required: false,
          extractionPatterns: [
            "Somos {valor} pessoas",
            "Nossa equipe tem {valor} colaboradores",
            "Temos {valor} funcionários"
          ],
          destination: {
            field: "companySize",
            entityType: "lead"
          }
        }
      ]
    },
    metrics: {
      totalConversations: 312,
      successfulQualifications: 278,
      conversionRate: 0.56,
      averageResponseTime: 2.8,
      satisfactionScore: 4.3,
      lastTrainingDate: new Date("2023-11-01")
    },
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-11-12"),
    createdBy: "admin",
    version: "1.3",
    tags: ["qualificação", "leads"]
  },
  {
    id: "agent-4",
    name: "Suporte Técnico",
    description: "Agente especializado em suporte técnico e resolução de problemas",
    type: "suporte",
    status: "ativo",
    objective: "Resolver problemas técnicos, auxiliar na configuração e esclarecer dúvidas dos clientes",
    personality: "Paciente, didático e detalhista",
    tone: "amigavel",
    language: "pt-BR",
    avatar: "https://ui-avatars.com/api/?name=Suporte&background=0ea5e9&color=fff",
    systemInstructions: "Resolva problemas técnicos, forneça orientações passo a passo e auxilie na configuração do sistema",
    conversationFlow: [],
    prohibitedTopics: [],
    companyInfo: {
      name: "Space Sales",
      description: "Plataforma de CRM e vendas",
      mission: "Ajudar empresas a venderem mais e melhor",
      values: ["Inovação", "Excelência", "Foco no cliente"],
      differentials: ["Inteligência artificial", "Facilidade de uso", "Suporte 24/7"],
      targetAudience: "Empresas de pequeno e médio porte"
    },
    products: [],
    services: [],
    faqs: [],
    knowledgeBase: [],
    followUpConfig: {
      enabled: true,
      triggers: ["evento"],
      intervals: [],
      maxAttempts: 2,
      escalationRules: "condicional"
    },
    integrations: {
      whatsapp: true,
      email: true,
      webchat: true,
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
    metrics: {
      totalConversations: 523,
      successfulQualifications: 489,
      conversionRate: 0.83,
      averageResponseTime: 2.3,
      satisfactionScore: 4.8,
      lastTrainingDate: new Date("2023-11-10")
    },
    createdAt: new Date("2023-07-01"),
    updatedAt: new Date("2023-11-15"),
    createdBy: "admin",
    version: "2.0",
    tags: ["suporte", "técnico"]
  }
];

export function useAIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar agentes
  useEffect(() => {
    // Simulação de chamada à API
    const fetchAgents = async () => {
      try {
        // Em um sistema real, buscaríamos do backend
        // const response = await fetch('/api/ai-agents');
        // const data = await response.json();
        
        // Simulando um pequeno atraso de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAgents(MOCK_AGENTS);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar agentes:", err);
        setError("Não foi possível carregar os agentes. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Adicionar um novo agente
  const addAgent = async (agent: Omit<AIAgent, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Em um sistema real, enviaríamos para o backend
      // const response = await fetch('/api/ai-agents', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(agent)
      // });
      // const newAgent = await response.json();
      
      // Simulação
      const newAgent: AIAgent = {
        ...agent,
        id: `agent-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        metrics: {
          totalConversations: 0,
          successfulQualifications: 0,
          conversionRate: 0,
          averageResponseTime: 0,
          satisfactionScore: 0,
          lastTrainingDate: new Date()
        }
      } as AIAgent;
      
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err) {
      console.error("Erro ao adicionar agente:", err);
      throw new Error("Não foi possível adicionar o agente.");
    }
  };

  // Atualizar um agente existente
  const updateAgent = async (id: string, updates: Partial<AIAgent>) => {
    try {
      // Em um sistema real, enviaríamos para o backend
      // const response = await fetch(`/api/ai-agents/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      // const updatedAgent = await response.json();
      
      // Simulação
      const updatedAgents = agents.map(agent => 
        agent.id === id 
          ? { ...agent, ...updates, updatedAt: new Date() } 
          : agent
      );
      
      setAgents(updatedAgents);
      return updatedAgents.find(agent => agent.id === id);
    } catch (err) {
      console.error("Erro ao atualizar agente:", err);
      throw new Error("Não foi possível atualizar o agente.");
    }
  };

  // Excluir um agente
  const deleteAgent = async (id: string) => {
    try {
      // Em um sistema real, enviaríamos para o backend
      // await fetch(`/api/ai-agents/${id}`, {
      //   method: 'DELETE'
      // });
      
      // Simulação
      setAgents(prev => prev.filter(agent => agent.id !== id));
      return true;
    } catch (err) {
      console.error("Erro ao excluir agente:", err);
      throw new Error("Não foi possível excluir o agente.");
    }
  };

  return {
    agents,
    loading,
    error,
    addAgent,
    updateAgent,
    deleteAgent
  };
}