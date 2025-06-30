import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, Plus, GitBranch } from 'lucide-react';
import { useState } from 'react';

interface ConditionNodeData {
  label: string;
  conditions?: Array<{ id: string; field: string; operator: string; value: string }>;
  expanded?: boolean;
}

export function CustomConditionNode({ data, selected }: NodeProps<ConditionNodeData>) {
  const [expanded, setExpanded] = useState(data.expanded || false);

  return (
    <Card className={`w-80 shadow-lg transition-all ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-cyan-600">Condição</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Adicione condições para controlar o fluxo da automação.
        </p>
        
        {expanded && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Se lead.origem = "Site"</span>
            </div>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar condição
        </Button>
        
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-cyan-500"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-cyan-500"
          id="true"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-red-500"
          id="false"
        />
      </CardContent>
    </Card>
  );
}