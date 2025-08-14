import { useState } from "react";
import { toast } from "sonner";
import type { AIAgent, AgentType, AgentStatus } from "@/types/aiAgent";

// Mock data para demonstração
const mockAgents: AIAgent[] = [
  {
    id: "agent-1",
    name: "Sofia - Atendimento",
    description: "Agente especializada em atendimento inicial e direcionamento de clientes",
    type: "atendimento",
    status: "ativo",
    objective: "Fornecer atendimento inicial excepcional e direcionar clientes para os departamentos corretos",
    personality: "Amigável, prestativa e eficiente. Sempre busca resolver problemas rapidamente.",
    tone: "amigavel",
    language: "pt-BR",
    systemInstructions: "Você é Sofia, uma assistente virtual especializada em atendimento ao cliente. Seja sempre cordial, eficiente e busque resolver as dúvidas dos clientes de forma rápida e precisa.",
    conversationFlow: [
      "Cumprimentar o cliente",
      "Identificar a necessidade",
      "Fornecer informações ou direcionar",
      "Confirmar se a dúvida foi esclarecida",
      "Oferecer ajuda adicional"
    ],
    prohibitedTopics: ["Informações confidenciais", "Dados pessoais de outros clientes"],
    companyInfo: {
      name: "Space Sales",
      description: "Plataforma completa de CRM e automação de vendas",
      mission: "Revolucionar a forma como empresas gerenciam relacionamentos com clientes",
      values: ["Inovação", "Transparência", "Resultados", "Relacionamento"],
      differentials: ["IA avançada", "Interface intuitiva", "Suporte 24/7", "Integrações nativas"],
      targetAudience: "Empresas de todos os tamanhos que buscam otimizar vendas"
    },
    products: [
      {
        id: "crm-pro",
        name: "CRM Pro",
        description: "Sistema completo de gestão de relacionamento com clientes",
        features: ["Pipeline visual", "Automações", "Relatórios avançados", "Integrações"],
        benefits: ["Aumento de 40% nas vendas", "Redução de 60% no tempo de gestão", "Visibilidade completa do funil"],
        pricing: {
          plans: [
            { name: "Starter", price: 97, period: "mensal", features: ["Até 1000 leads", "Pipeline básico", "Suporte email"] },
            { name: "Professional", price: 197, period: "mensal", features: ["Leads ilimitados", "Automações", "Suporte prioritário"], popular: true },
            { name: "Enterprise", price: 397, period: "mensal", features: ["Recursos avançados", "API", "Suporte dedicado"] }
          ],
          currency: "BRL"
        },
        targetAudience: "Equipes de vendas e marketing",
        useCases: ["Gestão de leads", "Automação de follow-up", "Análise de performance"]
      }
    ],
    services: [
      {
        id: "implementacao",
        name: "Implementação Personalizada",
        description: "Configuração completa do sistema para sua empresa",
        deliverables: ["Configuração inicial", "Treinamento da equipe", "Migração de dados"],
        duration: "2-4 semanas",
        pricing: "A partir de R$ 2.500",
        requirements: ["Acesso aos dados atuais", "Disponibilidade da equipe"]
      }
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Qual o tempo de implementação?",
        answer: "A implementação padrão leva de 2 a 4 semanas, dependendo da complexidade e tamanho da empresa.",
        category: "Implementação",
        keywords: ["tempo", "implementação", "prazo"],
        priority: "alta"
      },
      {
        id: "faq-2",
        question: "Vocês oferecem suporte?",
        answer: "Sim! Oferecemos suporte 24/7 via chat, email e telefone para todos os planos.",
        category: "Suporte",
        keywords: ["suporte", "ajuda", "atendimento"],
        priority: "alta"
      }
    ],
    knowledgeBase: [
      {
        id: "kb-1",
        title: "Como configurar automações",
        content: "Guia completo para configurar automações de follow-up...",
        category: "Tutoriais",
        tags: ["automação", "configuração"],
        lastUpdated: new Date()
      }
    ],
    followUpConfig: {
      enabled: true,
      useConversationContext: true,
      triggers: ["tempo", "acao"],
      intervals: [
        { 
          delay: 24, 
          timeUnit: 'horas',
          message: "Olá! Como posso ajudar com mais alguma coisa?",
          useContext: false
        },
        { 
          delay: 72, 
          timeUnit: 'horas',
          message: "Gostaria de agendar uma demonstração?",
          useContext: false
        },
        {
          delay: 30,
          timeUnit: 'minutos',
          message: "Notei que você tinha dúvidas sobre nossa funcionalidade. Posso esclarecer mais alguma coisa?",
          useContext: true,
          contextPrompt: "Mencione especificamente a funcionalidade que o cliente estava perguntando na conversa anterior"
        }
      ],
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
    metrics: {
      totalConversations: 1247,
      successfulQualifications: 0,
      conversionRate: 0,
      averageResponseTime: 2.3,
      satisfactionScore: 4.7,
      lastTrainingDate: new Date()
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
    createdBy: "Admin",
    version: "1.2.0",
    tags: ["atendimento", "suporte", "principal"]
  },
  {
    id: "agent-2",
    name: "Carlos - Qualificação",
    description: "Especialista em qualificar leads e identificar oportunidades de venda",
    type: "qualificacao",
    status: "ativo",
    objective: "Qualificar leads de forma eficiente identificando necessidades, budget e timing de compra",
    personality: "Consultivo, investigativo e focado em resultados. Faz as perguntas certas para entender o cliente.",
    tone: "consultivo",
    language: "pt-BR",
    systemInstructions: "Você é Carlos, especialista em qualificação de leads. Sua missão é identificar se o lead tem fit com nossa solução através de perguntas estratégicas sobre necessidades, budget e timing.",
    conversationFlow: [
      "Apresentar-se e explicar o objetivo",
      "Identificar dores e necessidades",
      "Qualificar budget disponível",
      "Entender timing de decisão",
      "Classificar o lead e próximos passos"
    ],
    prohibitedTopics: ["Informações de concorrentes", "Dados confidenciais"],
    companyInfo: {
      name: "Space Sales",
      description: "Plataforma completa de CRM e automação de vendas",
      mission: "Revolucionar a forma como empresas gerenciam relacionamentos com clientes",
      values: ["Inovação", "Transparência", "Resultados", "Relacionamento"],
      differentials: ["IA avançada", "Interface intuitiva", "Suporte 24/7", "Integrações nativas"],
      targetAudience: "Empresas de todos os tamanhos que buscam otimizar vendas"
    },
    products: [],
    services: [],
    faqs: [],
    knowledgeBase: [],
    followUpConfig: {
      enabled: true,
      useConversationContext: true,
      triggers: ["tempo", "acao"],
      intervals: [
        { 
          delay: 48, 
          timeUnit: 'horas',
          message: "Olá! Conseguiu analisar as informações que compartilhei?",
          useContext: false
        },
        { 
          delay: 7, 
          timeUnit: 'dias',
          message: "Gostaria de agendar uma demonstração personalizada?",
          useContext: false
        },
        {
          delay: 15,
          timeUnit: 'minutos',
          message: "Notei que você estava interessado em nossa solução para seu problema específico. Posso detalhar melhor como podemos ajudar?",
          useContext: true,
          contextPrompt: "Mencione o problema específico que o cliente descreveu e sugira soluções relevantes"
        }
      ],
      maxAttempts: 2,
      escalationRules: "condicional"
    },
    integrations: {
      whatsapp: true,
      email: true,
      webchat: true,
      telegram: true,
      instagram: false
    },
    advancedConfig: {
      maxResponseTime: 3,
      confidenceThreshold: 0.85,
      escalateOnLowConfidence: true,
      saveConversationHistory: true,
      learningMode: true
    },
    metrics: {
      totalConversations: 892,
      successfulQualifications: 634,
      conversionRate: 71.1,
      averageResponseTime: 1.8,
      satisfactionScore: 4.5,
      lastTrainingDate: new Date()
    },
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date(),
    createdBy: "Admin",
    version: "1.1.0",
    tags: ["qualificação", "leads", "vendas"]
  },
  {
    id: "agent-3",
    name: "Ana - Vendas",
    description: "Agente focada em apresentar soluções e fechar negócios",
    type: "vendas",
    status: "treinamento",
    objective: "Apresentar soluções de forma persuasiva e conduzir o processo de fechamento de vendas",
    personality: "Persuasiva, confiante e orientada a resultados. Sabe quando pressionar e quando dar espaço.",
    tone: "profissional",
    language: "pt-BR",
    systemInstructions: "Você é Ana, especialista em vendas. Sua missão é apresentar nossas soluções de forma convincente, superar objeções e conduzir o cliente ao fechamento.",
    conversationFlow: [
      "Revisar necessidades identificadas",
      "Apresentar solução adequada",
      "Demonstrar valor e ROI",
      "Superar objeções",
      "Conduzir ao fechamento"
    ],
    prohibitedTopics: ["Descontos não autorizados", "Promessas irreais"],
    companyInfo: {
      name: "Space Sales",
      description: "Plataforma completa de CRM e automação de vendas",
      mission: "Revolucionar a forma como empresas gerenciam relacionamentos com clientes",
      values: ["Inovação", "Transparência", "Resultados", "Relacionamento"],
      differentials: ["IA avançada", "Interface intuitiva", "Suporte 24/7", "Integrações nativas"],
      targetAudience: "Empresas de todos os tamanhos que buscam otimizar vendas"
    },
    products: [],
    services: [],
    faqs: [],
    knowledgeBase: [],
    followUpConfig: {
      enabled: true,
      useConversationContext: true,
      triggers: ["tempo", "acao"],
      intervals: [
        { 
          delay: 24, 
          timeUnit: 'horas',
          message: "Olá! Teve tempo de analisar nossa proposta?",
          useContext: false
        },
        { 
          delay: 72, 
          timeUnit: 'horas',
          message: "Posso esclarecer alguma dúvida sobre a proposta?",
          useContext: false
        },
        {
          delay: 5,
          timeUnit: 'dias',
          message: "Vi que você demonstrou interesse no nosso plano Premium. Gostaria de conversar sobre os benefícios específicos para sua empresa?",
          useContext: true,
          contextPrompt: "Mencione o plano ou produto específico que o cliente demonstrou mais interesse e ofereça detalhes personalizados"
        }
      ],
      maxAttempts: 3,
      escalationRules: "condicional"
    },
    integrations: {
      whatsapp: true,
      email: true,
      webchat: false,
      telegram: false,
      instagram: false
    },
    advancedConfig: {
      maxResponseTime: 4,
      confidenceThreshold: 0.9,
      escalateOnLowConfidence: true,
      saveConversationHistory: true,
      learningMode: false
    },
    metrics: {
      totalConversations: 456,
      successfulQualifications: 0,
      conversionRate: 23.5,
      averageResponseTime: 3.1,
      satisfactionScore: 4.3,
      lastTrainingDate: new Date()
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
    createdBy: "Admin",
    version: "1.0.0",
    tags: ["vendas", "fechamento", "beta"]
  }
];

export function useAIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>(mockAgents);

  const createAgent = (agentData: Partial<AIAgent>) => {
    const newAgent: AIAgent = {
      id: `agent-${Date.now()}`,
      name: agentData.name || "Novo Agente",
      description: agentData.description || "",
      type: agentData.type || "atendimento",
      status: "inativo",
      objective: agentData.objective || "",
      personality: agentData.personality || "",
      tone: agentData.tone || "profissional",
      language: "pt-BR",
      systemInstructions: agentData.systemInstructions || "",
      conversationFlow: agentData.conversationFlow || [],
      prohibitedTopics: agentData.prohibitedTopics || [],
      companyInfo: agentData.companyInfo || {
        name: "",
        description: "",
        mission: "",
        values: [],
        differentials: [],
        targetAudience: ""
      },
      products: agentData.products || [],
      services: agentData.services || [],
      faqs: agentData.faqs || [],
      knowledgeBase: agentData.knowledgeBase || [],
      followUpConfig: agentData.followUpConfig || {
        enabled: false,
        useConversationContext: false,
        triggers: [],
        intervals: [],
        maxAttempts: 3,
        escalationRules: "condicional"
      },
      integrations: agentData.integrations || {
        whatsapp: false,
        email: false,
        webchat: false,
        telegram: false,
        instagram: false
      },
      advancedConfig: agentData.advancedConfig || {
        maxResponseTime: 5,
        confidenceThreshold: 0.8,
        escalateOnLowConfidence: true,
        saveConversationHistory: true,
        learningMode: true
      },
      metrics: {
        totalConversations: 0,
        successfulQualifications: 0,
        conversionRate: 0,
        averageResponseTime: 0,
        satisfactionScore: 0,
        lastTrainingDate: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "Usuário Atual",
      version: "1.0.0",
      tags: agentData.tags || []
    };

    setAgents(prev => [...prev, newAgent]);
    toast.success(`Agente "${newAgent.name}" criado com sucesso!`);
    return newAgent;
  };

  const updateAgent = (id: string, updates: Partial<AIAgent>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === id 
        ? { ...agent, ...updates, updatedAt: new Date() }
        : agent
    ));
    toast.success("Agente atualizado com sucesso!");
  };

  const deleteAgent = (id: string) => {
    const agent = agents.find(a => a.id === id);
    setAgents(prev => prev.filter(agent => agent.id !== id));
    toast.success(`Agente "${agent?.name}" removido com sucesso!`);
  };

  const duplicateAgent = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent) {
      const duplicatedAgent = {
        ...agent,
        id: `agent-${Date.now()}`,
        name: `${agent.name} (Cópia)`,
        status: "inativo" as AgentStatus,
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
      };
      setAgents(prev => [...prev, duplicatedAgent]);
      toast.success(`Agente duplicado como "${duplicatedAgent.name}"`);
    }
  };

  const toggleAgentStatus = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent) {
      const newStatus = agent.status === "ativo" ? "inativo" : "ativo";
      updateAgent(id, { status: newStatus });
      toast.success(`Agente ${newStatus === "ativo" ? "ativado" : "desativado"} com sucesso!`);
    }
  };

  return {
    agents,
    createAgent,
    updateAgent,
    deleteAgent,
    duplicateAgent,
    toggleAgentStatus
  };
}