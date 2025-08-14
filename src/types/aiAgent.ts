export type AgentType = 'atendimento' | 'qualificacao' | 'vendas' | 'followup' | 'suporte';
export type AgentStatus = 'ativo' | 'inativo' | 'treinamento' | 'manutencao';
export type FollowUpTrigger = 'tempo' | 'acao' | 'evento' | 'manual';
export type EscalationRule = 'sempre_humano' | 'condicional' | 'nunca';
export type TimeUnit = 'minutos' | 'horas' | 'dias';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  avatar?: string;
  
  // Configurações básicas
  objective: string;
  personality: string;
  tone: 'formal' | 'casual' | 'amigavel' | 'profissional' | 'consultivo';
  language: string;
  
  // Instruções e treinamento
  systemInstructions: string;
  conversationFlow: string[];
  prohibitedTopics: string[];
  
  // Informações da empresa
  companyInfo: {
    name: string;
    description: string;
    mission: string;
    values: string[];
    differentials: string[];
    targetAudience: string;
  };
  
  // Produtos e serviços
  products: ProductInfo[];
  services: ServiceInfo[];
  
  // FAQ e conhecimento
  faqs: FAQ[];
  knowledgeBase: KnowledgeItem[];
  
  // Configurações de follow-up
  followUpConfig: {
    enabled: boolean;
    triggers: FollowUpTrigger[];
    intervals: FollowUpInterval[];
    maxAttempts: number;
    escalationRules: EscalationRule;
    useConversationContext?: boolean;
  };
  
  // Integrações
  integrations: {
    whatsapp: boolean;
    email: boolean;
    webchat: boolean;
    telegram: boolean;
    instagram: boolean;
  };
  
  // Configurações avançadas
  advancedConfig: {
    maxResponseTime: number; // segundos
    confidenceThreshold: number; // 0-1
    escalateOnLowConfidence: boolean;
    saveConversationHistory: boolean;
    learningMode: boolean;
  };
  
  // Métricas
  metrics: {
    totalConversations: number;
    successfulQualifications: number;
    conversionRate: number;
    averageResponseTime: number;
    satisfactionScore: number;
    lastTrainingDate: Date;
  };
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  version: string;
  tags: string[];
}

export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  features: string[];
  benefits: string[];
  pricing: {
    plans: PricingPlan[];
    currency: string;
  };
  targetAudience: string;
  useCases: string[];
}

export interface ServiceInfo {
  id: string;
  name: string;
  description: string;
  deliverables: string[];
  duration: string;
  pricing: string;
  requirements: string[];
}

export interface PricingPlan {
  name: string;
  price: number;
  period: 'mensal' | 'anual' | 'unico';
  features: string[];
  popular?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  priority: 'alta' | 'media' | 'baixa';
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
}

export interface FollowUpInterval {
  delay: number;
  timeUnit: TimeUnit;
  message: string;
  condition?: string;
  useContext?: boolean;
  contextPrompt?: string;
}

export interface ConversationTest {
  id: string;
  agentId: string;
  messages: TestMessage[];
  startedAt: Date;
  endedAt?: Date;
  feedback?: string;
  rating?: number;
}

export interface TestMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  confidence?: number;
  responseTime?: number;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  industry: string;
  config: Partial<AIAgent>;
  popular: boolean;
}