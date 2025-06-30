import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Plus } from 'lucide-react';

export function CustomTriggerNode({ data, selected }: NodeProps<{ label: string; description?: string }>) {
  return (
    <Card className={`w-80 shadow-lg transition-all ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <Play className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-green-600">Início</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {data.description || "O gatilho é responsável por acionar a automação. Clique para adicionar um gatilho."}
        </p>
        
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar gatilho
        </Button>
        
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-green-500"
        />
      </CardContent>
    </Card>
  );
}