import { useState } from "react";
import { toast } from "sonner";
import type { 
  PlaybookFolder, 
  QuickResponse, 
  PlaybookUsage, 
  PlaybookStats,
  MessageContent,
  Variable
} from "@/types/playbook";

// Mock data para demonstração
const mockFolders: PlaybookFolder[] = [
  {
    id: 'abordagem',
    name: 'Abordagem',
    description: 'Mensagens para primeiro contato',
    icon: '👋',
    color: '#3b82f6',
    position: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    createdBy: 'Admin',
    isShared: true,
    permissions: []
  },
  {
    id: 'qualificacao',
    name: 'Qualificação',
    description: 'Perguntas para qualificar leads',
    icon: '🎯',
    color: '#10b981',
    position: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    createdBy: 'Admin',
    isShared: true,
    permissions: []
  },
  {
    id: 'objecoes',
    name: 'Objeções',
    description: 'Respostas para objeções comuns',
    icon: '🛡️',
    color: '#f59e0b',
    position: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    createdBy: 'Admin',
    isShared: true,
    permissions: []
  },
  {
    id: 'fechamento',
    name: 'Fechamento',
    description: 'Mensagens para fechar vendas',
    icon: '🎉',
    color: '#ef4444',
    position: 4,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    createdBy: 'Admin',
    isShared: true,
    permissions: []
  },
  {
    id: 'followup',
    name: 'Follow-up',
    description: 'Mensagens de acompanhamento',
    icon: '📞',
    color: '#8b5cf6',
    position: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    createdBy: 'Admin',
    isShared: true,
    permissions: []
  }
];

const mockResponses: QuickResponse[] = [
  {
    id: 'resp-1',
    folderId: 'abordagem',
    name: 'Saudação Personalizada',
    description: 'Primeira mensagem com nome personalizado',
    content: [
      {
        id: 'msg-1',
        type: 'text',
        order: 1,
        content: 'Olá, {nome}! Tudo bem? 😊\n\nSou {vendedor} da {empresa}. Vi que você demonstrou interesse em nossos produtos e gostaria de conversar com você!'
      }
    ],
    variables: [
      { id: 'var-1', name: 'Nome do Lead', key: 'nome', description: 'Nome da pessoa', type: 'text', required: true },
      { id: 'var-2', name: 'Vendedor', key: 'vendedor', description: 'Nome do vendedor', type: 'text', required: true, defaultValue: 'João Silva' },
      { id: 'var-3', name: 'Empresa', key: 'empresa', description: 'Nome da empresa', type: 'text', required: true, defaultValue: 'Space Sales' }
    ],
    tags: ['saudacao', 'personalizada', 'primeiro-contato'],
    isSequence: false,
    usageCount: 156,
    lastUsed: new Date(),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
    createdBy: 'João Silva',
    isActive: true,
    isFavorite: true
  },
  {
    id: 'resp-2',
    folderId: 'abordagem',
    name: 'Apresentação com Vídeo',
    description: 'Abordagem com vídeo de apresentação',
    content: [
      {
        id: 'msg-1',
        type: 'text',
        order: 1,
        content: 'Oi {nome}! 👋\n\nPreprei um vídeo especial para você conhecer nossa solução:'
      },
      {
        id: 'msg-2',
        type: 'video',
        order: 2,
        content: 'Vídeo de apresentação',
        mediaUrl: '/videos/apresentacao.mp4',
        mediaType: 'video/mp4',
        duration: 120,
        delay: 2
      },
      {
        id: 'msg-3',
        type: 'text',
        order: 3,
        content: 'O que achou? Gostaria de agendar uma conversa para falarmos mais sobre como podemos ajudar a {empresa}?',
        delay: 5
      }
    ],
    variables: [
      { id: 'var-1', name: 'Nome', key: 'nome', description: 'Nome do lead', type: 'text', required: true },
      { id: 'var-2', name: 'Empresa', key: 'empresa', description: 'Nome da empresa', type: 'text', required: true }
    ],
    tags: ['video', 'apresentacao', 'sequencia'],
    isSequence: true,
    sequenceDelay: 3,
    usageCount: 89,
    lastUsed: new Date(),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date(),
    createdBy: 'Maria Santos',
    isActive: true,
    isFavorite: false
  },
  {
    id: 'resp-3',
    folderId: 'qualificacao',
    name: 'Descoberta de Necessidades',
    description: 'Perguntas para entender as dores do cliente',
    content: [
      {
        id: 'msg-1',
        type: 'text',
        order: 1,
        content: 'Perfeito, {nome}! Para eu entender melhor como podemos ajudar, me conta:\n\n1️⃣ Qual o principal desafio que vocês enfrentam hoje com {area}?\n2️⃣ Como vocês fazem isso atualmente?\n3️⃣ Qual seria o resultado ideal para vocês?'
      }
    ],
    variables: [
      { id: 'var-1', name: 'Nome', key: 'nome', description: 'Nome do lead', type: 'text', required: true },
      { id: 'var-2', name: 'Área', key: 'area', description: 'Área de interesse', type: 'select', options: ['vendas', 'marketing', 'atendimento', 'gestão'], required: true }
    ],
    tags: ['qualificacao', 'descoberta', 'perguntas'],
    isSequence: false,
    usageCount: 234,
    lastUsed: new Date(),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date(),
    createdBy: 'Carlos Oliveira',
    isActive: true,
    isFavorite: true
  },
  {
    id: 'resp-4',
    folderId: 'objecoes',
    name: 'Preço Alto',
    description: 'Resposta para objeção de preço',
    content: [
      {
        id: 'msg-1',
        type: 'text',
        order: 1,
        content: 'Entendo sua preocupação com o investimento, {nome}. 💰\n\nVamos pensar assim: qual o custo de NÃO resolver esse problema? \n\nNossos clientes geralmente economizam {economia} por mês só com a otimização que nossa solução proporciona.'
      },
      {
        id: 'msg-2',
        type: 'image',
        order: 2,
        content: 'ROI Calculator',
        mediaUrl: '/images/roi-calculator.png',
        mediaType: 'image/png',
        delay: 3
      }
    ],
    variables: [
      { id: 'var-1', name: 'Nome', key: 'nome', description: 'Nome do lead', type: 'text', required: true },
      { id: 'var-2', name: 'Economia', key: 'economia', description: 'Valor de economia estimado', type: 'text', required: true, defaultValue: 'R$ 5.000' }
    ],
    tags: ['objecao', 'preco', 'roi'],
    isSequence: true,
    sequenceDelay: 2,
    usageCount: 67,
    lastUsed: new Date(),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    createdBy: 'Ana Costa',
    isActive: true,
    isFavorite: false
  }
];

const mockStats: PlaybookStats = {
  totalResponses: 24,
  totalUsage: 1456,
  topResponses: [
    { id: 'resp-3', name: 'Descoberta de Necessidades', usageCount: 234, successRate: 78.5 },
    { id: 'resp-1', name: 'Saudação Personalizada', usageCount: 156, successRate: 85.2 },
    { id: 'resp-2', name: 'Apresentação com Vídeo', usageCount: 89, successRate: 72.1 }
  ],
  usageByFolder: [
    { folderId: 'qualificacao', folderName: 'Qualificação', count: 456, percentage: 31.3 },
    { folderId: 'abordagem', folderName: 'Abordagem', count: 389, percentage: 26.7 },
    { folderId: 'followup', folderName: 'Follow-up', count: 298, percentage: 20.5 },
    { folderId: 'objecoes', folderName: 'Objeções', count: 198, percentage: 13.6 },
    { folderId: 'fechamento', folderName: 'Fechamento', count: 115, percentage: 7.9 }
  ],
  usageByChannel: [
    { channel: 'whatsapp', count: 789, percentage: 54.2 },
    { channel: 'email', count: 345, percentage: 23.7 },
    { channel: 'webchat', count: 234, percentage: 16.1 },
    { channel: 'telegram', count: 88, percentage: 6.0 }
  ],
  usageTrend: [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), count: 45 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), count: 67 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), count: 89 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), count: 123 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), count: 156 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), count: 134 },
    { date: new Date(), count: 98 }
  ]
};

export function usePlaybook() {
  const [folders, setFolders] = useState<PlaybookFolder[]>(mockFolders);
  const [responses, setResponses] = useState<QuickResponse[]>(mockResponses);
  const [usage, setUsage] = useState<PlaybookUsage[]>([]);
  const [stats] = useState<PlaybookStats>(mockStats);

  const createFolder = (folderData: Partial<PlaybookFolder>) => {
    const newFolder: PlaybookFolder = {
      id: `folder-${Date.now()}`,
      name: folderData.name || "Nova Pasta",
      description: folderData.description,
      icon: folderData.icon || "📁",
      color: folderData.color || "#3b82f6",
      parentId: folderData.parentId,
      position: folders.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "Usuário Atual",
      isShared: false,
      permissions: []
    };

    setFolders(prev => [...prev, newFolder]);
    toast.success(`Pasta "${newFolder.name}" criada com sucesso!`);
    return newFolder;
  };

  const updateFolder = (id: string, updates: Partial<PlaybookFolder>) => {
    setFolders(prev => prev.map(folder => 
      folder.id === id 
        ? { ...folder, ...updates, updatedAt: new Date() }
        : folder
    ));
    toast.success("Pasta atualizada com sucesso!");
  };

  const deleteFolder = (id: string) => {
    const folder = folders.find(f => f.id === id);
    const folderResponses = responses.filter(r => r.folderId === id);
    
    if (folderResponses.length > 0) {
      toast.error(`Não é possível excluir a pasta "${folder?.name}". Ela contém ${folderResponses.length} resposta(s).`);
      return;
    }

    setFolders(prev => prev.filter(folder => folder.id !== id));
    toast.success(`Pasta "${folder?.name}" removida com sucesso!`);
  };

  const createResponse = (responseData: Partial<QuickResponse>) => {
    const newResponse: QuickResponse = {
      id: `response-${Date.now()}`,
      folderId: responseData.folderId || 'root',
      name: responseData.name || "Nova Resposta",
      description: responseData.description,
      content: responseData.content || [],
      variables: responseData.variables || [],
      tags: responseData.tags || [],
      isSequence: responseData.isSequence || false,
      sequenceDelay: responseData.sequenceDelay,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "Usuário Atual",
      isActive: true,
      isFavorite: false
    };

    setResponses(prev => [...prev, newResponse]);
    toast.success(`Resposta "${newResponse.name}" criada com sucesso!`);
    return newResponse;
  };

  const updateResponse = (id: string, updates: Partial<QuickResponse>) => {
    setResponses(prev => prev.map(response => 
      response.id === id 
        ? { ...response, ...updates, updatedAt: new Date() }
        : response
    ));
    toast.success("Resposta atualizada com sucesso!");
  };

  const deleteResponse = (id: string) => {
    const response = responses.find(r => r.id === id);
    setResponses(prev => prev.filter(response => response.id !== id));
    toast.success(`Resposta "${response?.name}" removida com sucesso!`);
  };

  const duplicateResponse = (id: string) => {
    const response = responses.find(r => r.id === id);
    if (response) {
      const duplicatedResponse = {
        ...response,
        id: `response-${Date.now()}`,
        name: `${response.name} (Cópia)`,
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false
      };
      setResponses(prev => [...prev, duplicatedResponse]);
      toast.success(`Resposta duplicada como "${duplicatedResponse.name}"`);
    }
  };

  const toggleFavorite = (id: string) => {
    setResponses(prev => prev.map(response => 
      response.id === id 
        ? { ...response, isFavorite: !response.isFavorite }
        : response
    ));
  };

  const recordUsage = (usageData: Omit<PlaybookUsage, 'id'>) => {
    const newUsage: PlaybookUsage = {
      ...usageData,
      id: `usage-${Date.now()}`
    };

    setUsage(prev => [...prev, newUsage]);
    
    // Atualizar contador de uso da resposta
    setResponses(prev => prev.map(response => 
      response.id === usageData.responseId 
        ? { 
            ...response, 
            usageCount: response.usageCount + 1,
            lastUsed: new Date()
          }
        : response
    ));
  };

  const getResponsesByFolder = (folderId: string) => {
    return responses.filter(r => r.folderId === folderId);
  };

  const searchResponses = (query: string) => {
    return responses.filter(r => 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.description?.toLowerCase().includes(query.toLowerCase()) ||
      r.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  return {
    folders,
    responses,
    usage,
    stats,
    createFolder,
    updateFolder,
    deleteFolder,
    createResponse,
    updateResponse,
    deleteResponse,
    duplicateResponse,
    toggleFavorite,
    recordUsage,
    getResponsesByFolder,
    searchResponses
  };
}