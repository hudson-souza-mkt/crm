export interface CreditPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  period: 'mensal' | 'anual' | 'unico';
  tokens: number;
  maxAgents: number;
  features: PlanFeature[];
  popular?: boolean;
  enterprise?: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
}

export interface TokenUsage {
  id: string;
  agentId: string;
  agentName: string;
  operation: OperationType;
  tokensUsed: number;
  timestamp: Date;
  details: {
    messageCount?: number;
    duration?: number; // em segundos
    channel?: string;
    confidence?: number;
  };
  cost: number;
}

export interface CreditBalance {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  currentPlan: string;
  renewalDate: Date;
  autoRecharge: boolean;
  lowBalanceAlert: boolean;
  alertThreshold: number; // porcentagem
}

export interface UsageStats {
  period: 'today' | 'week' | 'month' | 'year';
  totalTokens: number;
  totalCost: number;
  byAgent: AgentUsage[];
  byOperation: OperationUsage[];
  byChannel: ChannelUsage[];
  trend: UsageTrend[];
}

export interface AgentUsage {
  agentId: string;
  agentName: string;
  tokens: number;
  cost: number;
  percentage: number;
  conversations: number;
}

export interface OperationUsage {
  operation: OperationType;
  tokens: number;
  cost: number;
  count: number;
  percentage: number;
}

export interface ChannelUsage {
  channel: string;
  tokens: number;
  cost: number;
  messages: number;
  percentage: number;
}

export interface UsageTrend {
  date: Date;
  tokens: number;
  cost: number;
  conversations: number;
}

export type OperationType = 
  | 'message_sent'
  | 'message_received'
  | 'conversation_time'
  | 'knowledge_query'
  | 'integration_sync'
  | 'advanced_analysis'
  | 'file_processing'
  | 'voice_synthesis'
  | 'image_analysis';

export interface TokenCost {
  operation: OperationType;
  baseTokens: number;
  description: string;
  multipliers?: {
    channel?: Record<string, number>;
    agentType?: Record<string, number>;
    complexity?: Record<string, number>;
  };
}

export interface BillingAlert {
  id: string;
  type: 'low_balance' | 'usage_spike' | 'plan_limit' | 'renewal_due';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  actionUrl?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'pix' | 'boleto' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isValid: boolean;
}

export interface Invoice {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  downloadUrl?: string;
}