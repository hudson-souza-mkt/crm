import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  ReactFlowProvider,
  ReactFlowInstance,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AutomationNodeSidebar } from '@/components/automations/builder/AutomationNodeSidebar';
import { CustomActionNode } from '@/components/automations/builder/CustomActionNode';
import { CustomTriggerNode } from '@/components/automations/builder/CustomTriggerNode';
import { CustomMessageNode } from '@/components/automations/builder/CustomMessageNode';
import { CustomConditionNode } from '@/components/automations/builder/CustomConditionNode';
import { CustomWaitNode } from '@/components/automations/builder/CustomWaitNode';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  ArrowLeft, 
  Play, 
  List,
  ChevronDown,
  MoreHorizontal,
  Copy,
  FileEdit,
  Trash2,
  Calendar,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { NodeConfigDialog } from '@/components/automations/dialogs/NodeConfigDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Tipos de nós personalizados
const nodeTypes = {
  trigger: CustomTriggerNode,
  action: CustomActionNode,
  message: CustomMessageNode,
  condition: CustomConditionNode,
  wait: CustomWaitNode,
};

// Nós iniciais para exibir um fluxo de exemplo
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Início',
      description: 'O gatilho é responsável por acionar a automação. Clique para adicionar um gatilho.'
    },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 250, y: 250 },
    data: { 
      label: 'Ação',
      expanded: true,
      actions: [
        { id: 'create_deal', name: 'Criar negócio', description: 'Cria um novo negócio para o lead' },
        { id: 'move_stage', name: 'Mover negócio de etapa', description: 'Move um negócio para outra etapa (da...)' },
      ]
    },
  },
  {
    id: '3',
    type: 'message',
    position: { x: 600, y: 250 },
    data: { 
      label: 'Mensagem',
      expanded: true,
      messageType: 'text',
      errorHandling: 'next'
    },
  },
];

// Conexões iniciais entre os nós
const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true, 
    style: { strokeWidth: 2, stroke: '#94a3b8' },
    type: 'smoothstep'
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    animated: true, 
    style: { strokeWidth: 2, stroke: '#94a3b8' },
    type: 'smoothstep'
  },
];

// Automações disponíveis para exemplo
const sampleAutomations = [
  { 
    id: 'auto1',
    name: 'Qualificação de leads',
    description: 'Qualifica leads com base em ações e envia emails de follow-up',
    lastUpdated: '2025-06-10T10:30:00Z',
    status: 'active',
    triggers: ['lead_created'],
    statistics: { runs: 2457, completions: 2312, errors: 145 }
  },
  { 
    id: 'auto2',
    name: 'Acompanhamento de negócios',
    description: 'Envia lembretes e cria tarefas para negócios sem atividades recentes',
    lastUpdated: '2025-06-08T15:45:00Z',
    status: 'active',
    triggers: ['scheduled'],
    statistics: { runs: 1205, completions: 1183, errors: 22 }
  },
  { 
    id: 'auto3',
    name: 'Processo de onboarding',
    description: 'Sequência de emails para novos clientes',
    lastUpdated: '2025-06-05T09:15:00Z',
    status: 'active',
    triggers: ['deal_won'],
    statistics: { runs: 358, completions: 352, errors: 6 }
  },
  { 
    id: 'auto4',
    name: 'Recuperação de negócios perdidos',
    description: 'Tenta recuperar negócios marcados como perdidos após 30 dias',
    lastUpdated: '2025-05-20T11:00:00Z',
    status: 'inactive',
    triggers: ['deal_lost'],
    statistics: { runs: 45, completions: 42, errors: 3 }
  },
];

let id = 4;
const getId = () => `${id++}`;

function AutomationFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  // Estado para o nó selecionado e o diálogo de configuração
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Estados para a automação
  const [automationName, setAutomationName] = useState('Nova automação');
  const [automationDescription, setAutomationDescription] = useState('');
  const [isAutomationActive, setIsAutomationActive] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [showSimulationPanel, setShowSimulationPanel] = useState(false);
  
  // Simulação
  const [simulationLogs, setSimulationLogs] = useState<Array<{ time: string, message: string, type: 'info' | 'success' | 'error' | 'warning' }>>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      // Validar conexão
      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);
      
      // Não permitir conexões para o nó trigger
      if (targetNode?.type === 'trigger') {
        toast.error('Não é possível conectar a um nó de gatilho');
        return;
      }
      
      // Para nós de condição, verificar qual saída está sendo usada
      if (sourceNode?.type === 'condition' && params.sourceHandle === 'false') {
        // Se for a saída "false", adicionar label na conexão
        setEdges((eds) => addEdge({ 
          ...params, 
          animated: true, 
          style: { strokeWidth: 2, stroke: '#f43f5e' },
          type: 'smoothstep',
          label: 'Falso'
        }, eds));
      } else {
        // Conexão normal
        setEdges((eds) => addEdge({ 
          ...params, 
          animated: true, 
          style: { strokeWidth: 2, stroke: '#94a3b8' },
          type: 'smoothstep'
        }, eds));
      }
    },
    [nodes, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Inicializar dados específicos para cada tipo de nó
      let initialData: any = { label: getDefaultLabel(type) };
      
      // Adicionar dados específicos para cada tipo de nó
      switch(getNodeType(type)) {
        case 'trigger':
          initialData = {
            ...initialData,
            description: 'Defina quando esta automação será iniciada'
          };
          break;
        case 'action':
          initialData = {
            ...initialData,
            actionCategory: 'lead',
            expanded: true
          };
          break;
        case 'message':
          initialData = {
            ...initialData,
            messageType: 'email',
            errorHandling: 'stop'
          };
          break;
        case 'condition':
          initialData = {
            ...initialData,
            conditions: [],
            logicType: 'and'
          };
          break;
        case 'wait':
          initialData = {
            ...initialData,
            waitType: 'duration',
            waitConfig: {
              duration: '1',
              unit: 'days'
            }
          };
          break;
      }

      const newNode: Node = {
        id: getId(),
        type: getNodeType(type),
        position,
        data: initialData,
      };

      setNodes((nds) => nds.concat(newNode));
      
      // Selecionar o novo nó para configuração
      setTimeout(() => {
        setSelectedNode(newNode);
        setIsConfigOpen(true);
      }, 100);
    },
    [reactFlowInstance]
  );

  const getNodeType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'mensagem': 'message',
      'ações': 'action',
      'condições': 'condition',
      'espera': 'wait',
      'randomizador': 'action',
      'api': 'action',
      'operações de campos': 'action',
      'ia': 'action',
    };
    return typeMap[type.toLowerCase()] || 'action';
  };
  
  const getDefaultLabel = (type: string): string => {
    const labelMap: { [key: string]: string } = {
      'mensagem': 'Nova mensagem',
      'ações': 'Nova ação',
      'condições': 'Nova condição',
      'espera': 'Espera',
      'randomizador': 'Randomizador',
      'api': 'Chamada de API',
      'operações de campos': 'Operação de campo',
      'ia': 'Processamento de IA',
    };
    return labelMap[type.toLowerCase()] || 'Novo nó';
  };
  
  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    // Abrir o diálogo de configuração quando um nó for clicado
    setSelectedNode(node);
    setIsConfigOpen(true);
  };
  
  const handleUpdateNodeConfig = (nodeId: string, data: any) => {
    // Atualizar os dados do nó quando as configurações forem salvas
    setNodes((nds) => 
      nds.map((node) => 
        node.id === nodeId ? { ...node, data } : node
      )
    );
  };

  const handleSave = () => {
    const flowData = {
      id: `flow-${Date.now()}`,
      name: automationName,
      description: automationDescription,
      isActive: isAutomationActive,
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    
    // Aqui você salvaria no banco de dados
    console.log('Salvando automação:', flowData);
    toast.success('Automação salva com sucesso!');
  };
  
  const handleStartSimulation = () => {
    setShowSimulationPanel(true);
    setIsSimulationRunning(true);
    setSimulationLogs([
      { time: new Date().toLocaleTimeString(), message: 'Iniciando simulação...', type: 'info' }
    ]);
    
    // Encontrar o nó trigger
    const triggerNode = nodes.find(node => node.type === 'trigger');
    if (!triggerNode) {
      setSimulationLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), message: 'Erro: Nenhum gatilho encontrado na automação', type: 'error' }
      ]);
      setIsSimulationRunning(false);
      return;
    }
    
    // Simular execução
    simulateExecution(triggerNode);
  };
  
  const simulateExecution = (currentNode: Node) => {
    // Adicionar log para o nó atual
    const nodeTypeMap: Record<string, string> = {
      'trigger': 'Gatilho',
      'action': 'Ação',
      'message': 'Mensagem',
      'condition': 'Condição',
      'wait': 'Espera'
    };
    
    const nodeType = nodeTypeMap[currentNode.type || ''] || 'Nó';
    
    setSimulationLogs(prev => [
      ...prev,
      { 
        time: new Date().toLocaleTimeString(), 
        message: `Executando ${nodeType}: ${currentNode.data.label || 'Sem nome'}`, 
        type: 'info' 
      }
    ]);
    
    // Esperar um tempo antes de processar o próximo nó
    setTimeout(() => {
      // Determinar o resultado da execução
      let success = Math.random() > 0.2; // 80% de chance de sucesso
      
      if (success) {
        setSimulationLogs(prev => [
          ...prev,
          { 
            time: new Date().toLocaleTimeString(), 
            message: `${nodeType} executado com sucesso`, 
            type: 'success' 
          }
        ]);
        
        // Encontrar conexões saindo deste nó
        let outgoingEdges = edges.filter(edge => edge.source === currentNode.id);
        
        // Para nós de condição, decidir qual caminho seguir
        if (currentNode.type === 'condition') {
          const conditionResult = Math.random() > 0.5; // 50% de chance de verdadeiro/falso
          
          setSimulationLogs(prev => [
            ...prev,
            { 
              time: new Date().toLocaleTimeString(), 
              message: `Condição avaliada como: ${conditionResult ? 'Verdadeiro' : 'Falso'}`, 
              type: 'info' 
            }
          ]);
          
          // Filtrar as conexões com base no resultado da condição
          if (!conditionResult) {
            outgoingEdges = outgoingEdges.filter(edge => edge.sourceHandle === 'false');
          } else {
            outgoingEdges = outgoingEdges.filter(edge => edge.sourceHandle !== 'false');
          }
        }
        
        // Se houver conexões, seguir para o próximo nó
        if (outgoingEdges.length > 0) {
          const nextEdge = outgoingEdges[0];
          const nextNode = nodes.find(node => node.id === nextEdge.target);
          
          if (nextNode) {
            // Se for um nó de espera, adicionar um delay maior
            if (nextNode.type === 'wait') {
              setSimulationLogs(prev => [
                ...prev,
                { 
                  time: new Date().toLocaleTimeString(), 
                  message: `Aguardando ${nextNode.data.waitConfig?.duration || '1'} ${nextNode.data.waitConfig?.unit || 'dias'}...`, 
                  type: 'info' 
                }
              ]);
              
              setTimeout(() => {
                simulateExecution(nextNode);
              }, 1500);
            } else {
              // Próximo nó normal
              setTimeout(() => {
                simulateExecution(nextNode);
              }, 800);
            }
          } else {
            // Fim da simulação - nenhum nó encontrado
            finishSimulation();
          }
        } else {
          // Fim da simulação - sem mais conexões
          setSimulationLogs(prev => [
            ...prev,
            { 
              time: new Date().toLocaleTimeString(), 
              message: 'Fim do fluxo atingido', 
              type: 'info' 
            }
          ]);
          finishSimulation();
        }
      } else {
        // Falha na execução
        setSimulationLogs(prev => [
          ...prev,
          { 
            time: new Date().toLocaleTimeString(), 
            message: `Erro ao executar ${nodeType.toLowerCase()}`, 
            type: 'error' 
          }
        ]);
        
        // Verificar se deve continuar mesmo com erro (para mensagens e ações)
        if ((currentNode.type === 'message' && currentNode.data.errorHandling === 'next') ||
            (currentNode.type === 'action' && currentNode.data.continueOnError)) {
          
          setSimulationLogs(prev => [
            ...prev,
            { 
              time: new Date().toLocaleTimeString(), 
              message: 'Continuando automação apesar do erro', 
              type: 'warning' 
            }
          ]);
          
          // Encontrar conexões saindo deste nó
          const outgoingEdges = edges.filter(edge => edge.source === currentNode.id);
          
          if (outgoingEdges.length > 0) {
            const nextEdge = outgoingEdges[0];
            const nextNode = nodes.find(node => node.id === nextEdge.target);
            
            if (nextNode) {
              setTimeout(() => {
                simulateExecution(nextNode);
              }, 800);
            } else {
              finishSimulation();
            }
          } else {
            finishSimulation();
          }
        } else {
          // Parar simulação por causa do erro
          setSimulationLogs(prev => [
            ...prev,
            { 
              time: new Date().toLocaleTimeString(), 
              message: 'Automação interrompida devido a erro', 
              type: 'error' 
            }
          ]);
          finishSimulation();
        }
      }
    }, 1000);
  };
  
  const finishSimulation = () => {
    setSimulationLogs(prev => [
      ...prev,
      { 
        time: new Date().toLocaleTimeString(), 
        message: 'Simulação concluída', 
        type: 'info' 
      }
    ]);
    setIsSimulationRunning(false);
  };
  
  // Formatador de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsListOpen(true)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">{automationName}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={isAutomationActive ? "success" : "secondary"} className="text-xs">
                {isAutomationActive ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Última edição: {formatDate(new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsSettingsOpen(true)}
          >
            Configurações
          </Button>
          <Button 
            variant="outline" 
            onClick={handleStartSimulation}
            disabled={isSimulationRunning}
          >
            <Play className="h-4 w-4 mr-2" />
            Testar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-r bg-card p-4 mt-16">
        <AutomationNodeSidebar />
      </div>

      {/* Main Flow Area */}
      <div className="flex-1 mt-16" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          className="bg-gray-50"
        >
          <Controls className="bg-white border shadow-lg" />
          <Background color="#e2e8f0" gap={20} />
        </ReactFlow>
      </div>
      
      {/* Simulação Panel */}
      {showSimulationPanel && (
        <div className="absolute bottom-4 right-4 w-96 bg-white border rounded-lg shadow-lg">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-medium">Simulação da Automação</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSimulationPanel(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3 h-64 overflow-y-auto">
            {simulationLogs.map((log, index) => (
              <div key={index} className="mb-2 text-sm">
                <span className="text-xs text-muted-foreground">{log.time}</span>
                <p className={`ml-1 ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : log.type === 'warning' ? 'text-amber-500' : ''}`}>
                  {log.message}
                </p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSimulationPanel(false)}
            >
              Fechar
            </Button>
            <Button 
              size="sm" 
              onClick={handleStartSimulation}
              disabled={isSimulationRunning}
            >
              {isSimulationRunning ? 'Simulando...' : 'Reiniciar simulação'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Configuração de Nó */}
      <NodeConfigDialog
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        node={selectedNode}
        onSave={handleUpdateNodeConfig}
      />
      
      {/* Configurações da Automação */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configurações da automação</DialogTitle>
            <DialogDescription>
              Configure os detalhes básicos da sua automação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da automação</Label>
              <Input 
                id="name" 
                value={automationName} 
                onChange={(e) => setAutomationName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                value={automationDescription} 
                onChange={(e) => setAutomationDescription(e.target.value)} 
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isAutomationActive}
                  onCheckedChange={setIsAutomationActive}
                />
                <Label htmlFor="isActive">Automação ativa</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-6">
                Quando desativada, a automação não será executada, mesmo que seus gatilhos sejam acionados.
              </p>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-muted-foreground">Opções avançadas</Label>
              
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="allowManualTrigger" defaultChecked />
                <Label htmlFor="allowManualTrigger">Permitir acionamento manual</Label>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="logExecution" defaultChecked />
                <Label htmlFor="logExecution">Registrar execuções</Label>
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="notifyErrors" defaultChecked />
                <Label htmlFor="notifyErrors">Notificar erros</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Salvar configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Lista de Automações */}
      <Sheet open={isListOpen} onOpenChange={setIsListOpen}>
        <SheetContent side="left" className="sm:max-w-[540px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Automações</SheetTitle>
            <SheetDescription>
              Gerencie suas automações de vendas, marketing e atendimento.
            </SheetDescription>
          </SheetHeader>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Tabs defaultValue="active">
                <TabsList>
                  <TabsTrigger value="active">Ativas</TabsTrigger>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova automação
              </Button>
            </div>
            
            <div className="space-y-4">
              {sampleAutomations.map((automation) => (
                <div 
                  key={automation.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsListOpen(false)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{automation.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {automation.description}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <FileEdit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div>
                      <Badge variant={automation.status === 'active' ? "success" : "secondary"} className="text-xs">
                        {automation.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(automation.lastUpdated)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="bg-gray-50 rounded-md p-2">
                      <div className="text-lg font-medium">{automation.statistics.runs}</div>
                      <div className="text-xs text-muted-foreground">Execuções</div>
                    </div>
                    <div className="bg-gray-50 rounded-md p-2">
                      <div className="text-lg font-medium text-green-600">{automation.statistics.completions}</div>
                      <div className="text-xs text-muted-foreground">Concluídas</div>
                    </div>
                    <div className="bg-gray-50 rounded-md p-2">
                      <div className="text-lg font-medium text-red-600">{automation.statistics.errors}</div>
                      <div className="text-xs text-muted-foreground">Erros</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function Automations() {
  return (
    <ReactFlowProvider>
      <AutomationFlow />
    </ReactFlowProvider>
  );
}