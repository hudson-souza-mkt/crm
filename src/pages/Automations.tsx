import { useState, useCallback } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AutomationNodeSidebar } from '@/components/automations/builder/AutomationNodeSidebar';
import { CustomActionNode } from '@/components/automations/builder/CustomActionNode';
import { CustomTriggerNode } from '@/components/automations/builder/CustomTriggerNode';

// Tipos de nós personalizados
const nodeTypes = {
  trigger: CustomTriggerNode,
  action: CustomActionNode,
};

// Nós iniciais para exibir um fluxo de exemplo
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Novo Lead Criado', icon: 'UserPlus' },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 250, y: 250 },
    data: { label: 'Enviar E-mail de Boas-vindas', icon: 'Mail' },
  },
  {
    id: '3',
    type: 'action',
    position: { x: 500, y: 250 },
    data: { label: 'Adicionar Tag "Novo"', icon: 'Tag' },
  },
];

// Conexões iniciais entre os nós
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { strokeWidth: 2 } },
];

export default function Automations() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))] w-full">
      <div className="w-64 border-r bg-card p-4">
        <AutomationNodeSidebar />
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}