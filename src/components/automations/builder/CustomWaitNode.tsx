import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface WaitNodeData {
  label: string;
  duration?: number;
  unit?: string;
  expanded?: boolean;
}

export function CustomWaitNode({ data, selected }: NodeProps<WaitNodeData>) {
  const [expanded, setExpanded] = useState(data.expanded || false);
  const [duration, setDuration] = useState(data.duration || 1);
  const [unit, setUnit] = useState(data.unit || 'hours');

  return (
    <Card className={`w-80 shadow-lg transition-all ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-600">Espera</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Adicione um delay antes de continuar a automação.
        </p>
        
        {expanded && (
          <div className="space-y-3 mb-3">
            <div className="flex gap-2">
              <Input 
                type="number" 
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="flex-1"
                min="1"
              />
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">min</SelectItem>
                  <SelectItem value="hours">hrs</SelectItem>
                  <SelectItem value="days">dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardar {duration} {unit === 'minutes' ? 'minuto(s)' : unit === 'hours' ? 'hora(s)' : 'dia(s)'}
            </p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Configurar espera
        </Button>
        
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-purple-500"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-purple-500"
        />
      </CardContent>
    </Card>
  );
}