import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { 
  CreditPlan, 
  CreditBalance, 
  TokenUsage, 
  UsageStats, 
  BillingAlert,
  TokenCost,
  OperationType 
} from "@/types/billing";

// Configuração de custos por operação
const TOKEN_COSTS: TokenCost[] = [
  {
    operation: 'message_sent',
    baseTokens: 2,
    description: 'Mensagem enviada pelo agente',
    multipliers: {
      channel: { whatsapp: 1.2, email: 1.0, webchat: 0.8, telegram: 1.1 },
      agentType: { vendas: 1.5, qualificacao: 1.3, atendimento: 1.0, suporte: 1.1 }
    }
  },
  {
    operation: 'message_received',
    baseTokens: 1,
    description: 'Mensagem processada do usuário'
  },
  {
    operation: 'conversation_time',
    baseTokens: 0.5,
    description: 'Por minuto de conversa ativa'
  },
  {
    operation: 'knowledge_query',
    baseTokens: 3,
    description: 'Consulta à base de conhecimento'
  },
  {
    operation: 'integration_sync',
    baseTokens: 5,
    description: 'Sincronização com integrações'
  },
  {
    operation: 'advanced_analysis',
    baseTokens: 10,
    description: 'Análise avançada de sentimento/intenção'
  },
  {
    operation: 'file_processing',
    baseTokens: 15,
    description: 'Processamento de arquivos/documentos'
  },
  {
    operation: 'voice_synthesis',
    baseTokens: 8,
    description: 'Síntese de voz'
  },
  {
    operation: 'image_analysis',
    baseTokens: 12,
    description: 'Análise de imagens'
  }
];

// Planos disponíveis
const CREDIT_PLANS: CreditPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Ideal para pequenos negócios começando com IA',
    price: 97,
    currency: 'BRL',
    period: 'mensal',
    tokens: 1000,
    maxAgents: 1,
    features: [
      { id: 'agents', name: '1 Agente de IA', description: 'Um agente configurável', included: true, limit: 1 },
      { id: 'channels', name: 'Canais Básicos', description: 'WhatsApp e Email', included: true },
      { id: 'conversations', name: 'Conversas', description: 'Até 500 conversas/mês', included: true, limit: 500 },
      { id: 'support', name: 'Suporte', description: 'Email e chat', included: true },
      { id: 'analytics', name: 'Analytics Básico', description: 'Relatórios simples', included: true },
      { id: 'integrations', name: 'Integrações Avançadas', description: 'CRM, Zapier, etc.', included: false },
      { id: 'voice', name: 'Síntese de Voz', description: 'Respostas em áudio', included: false },
      { id: 'priority', name: 'Suporte Prioritário', description: '24/7 com SLA', included: false }
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para empresas que querem escalar com IA',
    price: 297,
    currency: 'BRL',
    period: 'mensal',
    tokens: 5000,
    maxAgents: 5,
    popular: true,
    features: [
      { id: 'agents', name: '5 Agentes de IA', description: 'Cinco agentes especializados', included: true, limit: 5 },
      { id: 'channels', name: 'Todos os Canais', description: 'WhatsApp, Email, Web, Telegram', included: true },
      { id: 'conversations', name: 'Conversas', description: 'Até 2.500 conversas/mês', included: true, limit: 2500 },
      { id: 'support', name: 'Suporte Prioritário', description: 'Chat, email e telefone', included: true },
      { id: 'analytics', name: 'Analytics Avançado', description: 'Dashboards e insights', included: true },
      { id: 'integrations', name: 'Integrações Avançadas', description: 'CRM, Zapier, APIs', included: true },
      { id: 'voice', name: 'Síntese de Voz', description: 'Respostas em áudio', included: true },
      { id: 'priority', name: 'SLA Garantido', description: 'Resposta em 4h', included: true }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Para empresas com alto volume de atendimento',
    price: 697,
    currency: 'BRL',
    period: 'mensal',
    tokens: 15000,
    maxAgents: -1, // ilimitado
    features: [
      { id: 'agents', name: 'Agentes Ilimitados', description: 'Quantos agentes precisar', included: true },
      { id: 'channels', name: 'Todos os Canais + API', description: 'Incluindo API personalizada', included: true },
      { id: 'conversations', name: 'Conversas Ilimitadas', description: 'Sem limite de conversas', included: true },
      { id: 'support', name: 'Suporte Dedicado', description: 'Gerente de conta dedicado', included: true },
      { id: 'analytics', name: 'Analytics Premium', description: 'BI e relatórios customizados', included: true },
      { id: 'integrations', name: 'Integrações Customizadas', description: 'Desenvolvimento sob medida', included: true },
      { id: 'voice', name: 'Recursos Avançados', description: 'Voz, imagem, multimodal', included: true },
      { id: 'priority', name: 'SLA Premium', description: 'Resposta em 1h', included: true }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solução completa para grandes corporações',
    price: 0, // Preço sob consulta
    currency: 'BRL',
    period: 'mensal',
    tokens: -1, // ilimitado
    maxAgents: -1,
    enterprise: true,
    features: [
      { id: 'everything', name: 'Tudo Incluído', description: 'Todos os recursos disponíveis', included: true },
      { id: 'custom', name: 'Desenvolvimento Customizado', description: 'Features sob medida', included: true },
      { id: 'onpremise', name: 'Deploy On-Premise', description: 'Instalação na sua infraestrutura', included: true },
      { id: 'sla', name: 'SLA Personalizado', description: 'Acordo de nível de serviço customizado', included: true },
      { id: 'training', name: 'Treinamento Especializado', description: 'Capacitação da equipe', included: true },
      { id: 'support', name: 'Suporte 24/7', description: 'Equipe dedicada disponível sempre', included: true }
    ]
  }
];

// Mock data para demonstração
const mockBalance: CreditBalance = {
  totalCredits: 5000,
  usedCredits: 2340,
  remainingCredits: 2660,
  currentPlan: 'professional',
  renewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
  autoRecharge: true,
  lowBalanceAlert: true,
  alertThreshold: 20 // 20%
};

const mockUsageStats: UsageStats = {
  period: 'month',
  totalTokens: 2340,
  totalCost: 234.00,
  byAgent: [
    { agentId: 'agent-1', agentName: 'Sofia - Atendimento', tokens: 1200, cost: 120, percentage: 51.3, conversations: 145 },
    { agentId: 'agent-2', agentName: 'Carlos - Qualificação', tokens: 890, cost: 89, percentage: 38.0, conversations: 98 },
    { agentId: 'agent-3', agentName: 'Ana - Vendas', tokens: 250, cost: 25, percentage: 10.7, conversations: 23 }
  ],
  byOperation: [
    { operation: 'message_sent', tokens: 1560, cost: 156, count: 780, percentage: 66.7 },
    { operation: 'message_received', tokens: 390, cost: 39, count: 390, percentage: 16.7 },
    { operation: 'knowledge_query', tokens: 240, cost: 24, count: 80, percentage: 10.3 },
    { operation: 'conversation_time', tokens: 150, cost: 15, count: 300, percentage: 6.4 }
  ],
  byChannel: [
    { channel: 'whatsapp', tokens: 1404, cost: 140.4, messages: 520, percentage: 60.0 },
    { channel: 'email', tokens: 468, cost: 46.8, messages: 234, percentage: 20.0 },
    { channel: 'webchat', tokens: 374.4, cost: 37.44, messages: 187, percentage: 16.0 },
    { channel: 'telegram', tokens: 93.6, cost: 9.36, messages: 39, percentage: 4.0 }
  ],
  trend: [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), tokens: 45, cost: 4.5, conversations: 12 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), tokens: 67, cost: 6.7, conversations: 18 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), tokens: 89, cost: 8.9, conversations: 24 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), tokens: 123, cost: 12.3, conversations: 31 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), tokens: 156, cost: 15.6, conversations: 42 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), tokens: 134, cost: 13.4, conversations: 38 },
    { date: new Date(), tokens: 98, cost: 9.8, conversations: 28 }
  ]
};

export function useBilling() {
  const [balance, setBalance] = useState<CreditBalance>(mockBalance);
  const [usageStats, setUsageStats] = useState<UsageStats>(mockUsageStats);
  const [alerts, setAlerts] = useState<BillingAlert[]>([]);
  const [loading, setLoading] = useState(false);

  // Calcular custo de uma operação
  const calculateTokenCost = (
    operation: OperationType,
    options?: {
      channel?: string;
      agentType?: string;
      complexity?: string;
      quantity?: number;
    }
  ): number => {
    const tokenCost = TOKEN_COSTS.find(tc => tc.operation === operation);
    if (!tokenCost) return 1;

    let cost = tokenCost.baseTokens;
    const quantity = options?.quantity || 1;

    // Aplicar multiplicadores
    if (tokenCost.multipliers) {
      if (options?.channel && tokenCost.multipliers.channel) {
        cost *= tokenCost.multipliers.channel[options.channel] || 1;
      }
      if (options?.agentType && tokenCost.multipliers.agentType) {
        cost *= tokenCost.multipliers.agentType[options.agentType] || 1;
      }
      if (options?.complexity && tokenCost.multipliers.complexity) {
        cost *= tokenCost.multipliers.complexity[options.complexity] || 1;
      }
    }

    return Math.ceil(cost * quantity);
  };

  // Registrar uso de tokens
  const recordUsage = (usage: Omit<TokenUsage, 'id' | 'timestamp' | 'cost'>) => {
    const cost = calculateTokenCost(usage.operation, {
      channel: usage.details.channel,
      quantity: usage.details.messageCount || 1
    });

    const newUsage: TokenUsage = {
      ...usage,
      id: `usage-${Date.now()}`,
      timestamp: new Date(),
      cost: cost * 0.1 // R$ 0.10 por token
    };

    // Atualizar saldo
    setBalance(prev => ({
      ...prev,
      usedCredits: prev.usedCredits + cost,
      remainingCredits: prev.remainingCredits - cost
    }));

    // Verificar alertas
    checkAlerts();

    return newUsage;
  };

  // Verificar alertas de saldo baixo
  const checkAlerts = () => {
    const usagePercentage = (balance.usedCredits / balance.totalCredits) * 100;
    
    if (usagePercentage >= balance.alertThreshold && balance.lowBalanceAlert) {
      const alert: BillingAlert = {
        id: `alert-${Date.now()}`,
        type: 'low_balance',
        title: 'Saldo Baixo',
        message: `Você usou ${usagePercentage.toFixed(1)}% dos seus créditos. Considere fazer uma recarga.`,
        severity: usagePercentage >= 90 ? 'error' : 'warning',
        timestamp: new Date(),
        read: false,
        actionRequired: true,
        actionUrl: '/billing/recharge'
      };

      setAlerts(prev => [alert, ...prev]);
      toast.warning(alert.message);
    }
  };

  // Upgrade de plano
  const upgradePlan = async (planId: string) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPlan = CREDIT_PLANS.find(p => p.id === planId);
      if (newPlan) {
        setBalance(prev => ({
          ...prev,
          currentPlan: planId,
          totalCredits: newPlan.tokens,
          remainingCredits: newPlan.tokens,
          usedCredits: 0
        }));
        
        toast.success(`Plano atualizado para ${newPlan.name}!`);
      }
    } catch (error) {
      toast.error('Erro ao atualizar plano');
    } finally {
      setLoading(false);
    }
  };

  // Recarregar créditos
  const rechargeCredits = async (amount: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBalance(prev => ({
        ...prev,
        totalCredits: prev.totalCredits + amount,
        remainingCredits: prev.remainingCredits + amount
      }));
      
      toast.success(`${amount} créditos adicionados com sucesso!`);
    } catch (error) {
      toast.error('Erro ao recarregar créditos');
    } finally {
      setLoading(false);
    }
  };

  // Obter estatísticas de uso
  const getUsageStats = (period: 'today' | 'week' | 'month' | 'year') => {
    // Simular diferentes períodos
    return {
      ...usageStats,
      period
    };
  };

  return {
    balance,
    usageStats,
    alerts,
    loading,
    plans: CREDIT_PLANS,
    tokenCosts: TOKEN_COSTS,
    calculateTokenCost,
    recordUsage,
    upgradePlan,
    rechargeCredits,
    getUsageStats,
    checkAlerts
  };
}