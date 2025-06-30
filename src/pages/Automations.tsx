import { useState, useCallback, useRef } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AutomationNodeSidebar } from '@/components/automations/builder/AutomationNodeSidebar';
import { CustomActionNode } from '@/components/automations/builder/CustomActionNode';
import { CustomTriggerNode } from '@/components/automations/builder/CustomTriggerNode';
import { CustomMessageNode } from '@/components/automations/builder/CustomMessageNode';
import { CustomConditionNode } from '@/components/automations/builder/CustomConditionNode';
import { CustomWaitNode } from '@/components/automations/builder/CustomWaitNode';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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

let id = 4;
const getId = () => `${id++}`;

function AutomationFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { strokeWidth: 2, stroke: '#94a3b8' },
      type: 'smoothstep'
    }, eds)),
    [setEdges]
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

      const newNode: Node = {
        id: getId(),
        type: getNodeType(type),
        position,
        data: { label: type },
      };

      setNodes((nds) => nds.concat(newNode));
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
    return typeMap[type] || 'action';
  };

  const handleSave = () => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    
    // Aqui você salvaria no banco de dados
    console.log('Salvando automação:', flowData);
    toast.success('Automação salva com sucesso!');
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Vendas</h1>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
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
          fitView
          className="bg-gray-50"
        >
          <Controls className="bg-white border shadow-lg" />
          <Background color="#e2e8f0" gap={20} />
        </ReactFlow>
      </div>
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