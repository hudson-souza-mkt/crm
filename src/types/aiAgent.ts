export type AgentType = 'atendimento' | 'qualificacao' | 'vendas' | 'followup' | 'suporte';
export type AgentStatus = 'ativo' | 'inativo' | 'treinamento' | 'manutencao';
export type FollowUpTrigger = 'tempo' | 'acao' | 'evento' | 'manual';
export type EscalationRule = 'sempre_humano' | 'condicional' | 'nunca';
export type TimeUnit = 'minutos' | 'horas' | 'dias';

// Novos tipos para integração com pipeline
export type StepCompletionCondition = 'manual' | 'automatic' | 'conditional';
export type PipelineAction = 'create_deal' | 'move_stage' | 'update_value' | 'add_note' | 'schedule_task';

export interface ConversationStep {
  id: string;
  name: string;
  description: string;
  order: number;
  
  // Integração com pipeline
  pipelineStage?: string; // ID ou nome da etapa do pipeline
  pipelineAction: PipelineAction;
  
  // Instruções específicas para esta etapa
  instructions: string;
  systemPrompt: string;
  
  // Condições de conclusão
  completionCondition: StepCompletionCondition;
  completionCriteria?: string; // Critérios específicos para conclusão automática
  
  // Ações automáticas
  autoActions?: {
    createDeal?: boolean;
    updateDealValue?: number;
    addTags?: string[];
    scheduleFollowUp?: boolean;
    notifyTeam?: boolean;
  };
  
  // Condições de branching
  branches?: ConversationBranch[];
}

export interface ConversationBranch {
  id: string;
  condition: string; // Ex: "se cliente interessado"
  nextStepId: string;
  instructions: string;
}

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
  conversationFlow: ConversationStep[]; // Atualizado para usar o novo tipo
  prohibitedTopics: string[];
  
  // Configurações de pipeline
  pipelineConfig?: {
    enabled: boolean;
    defaultPipeline: string; // ID do pipeline padrão
    autoCreateDeals: boolean;
    dealNamingPattern: string; // Ex: "{cliente} - {produto}"
    defaultDealValue: number;
  };
  
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

// Tipos para pipeline (mock - em um sistema real viriam do backend)
export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
}