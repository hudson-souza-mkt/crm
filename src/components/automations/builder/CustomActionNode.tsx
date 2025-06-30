import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Plus, Briefcase, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface ActionNodeData {
  label: string;
  actions?: Array<{ id: string; name: string; description: string }>;
  expanded?: boolean;
}

export function CustomActionNode({ data, selected }: NodeProps<ActionNodeData>) {
  const [expanded, setExpanded] = useState(data.expanded || false);
  
  const defaultActions = [
    { id: 'create_deal', name: 'Criar negócio', description: 'Cria um novo negócio para o lead' },
    { id: 'move_stage', name: 'Mover negócio de etapa', description: 'Move um negócio para outra etapa (da...)' },
  ];

  const actions = data.actions || defaultActions;

  return (
    <Card className={`w-80 shadow-lg transition-all ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-600">Ação</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Execute ações no sistema. Clique para adicionar ações:
        </p>
        
        {expanded && (
          <div className="space-y-2 mb-3">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.name}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar ação
        </Button>
        
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-yellow-500"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-yellow-500"
        />
      </CardContent>
    </Card>
  );
}