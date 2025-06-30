import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Plus, FileText } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface MessageNodeData {
  label: string;
  messageType?: string;
  errorHandling?: string;
  expanded?: boolean;
}

export function CustomMessageNode({ data, selected }: NodeProps<MessageNodeData>) {
  const [expanded, setExpanded] = useState(data.expanded || false);
  const [errorHandling, setErrorHandling] = useState(data.errorHandling || 'next');

  return (
    <Card className={`w-80 shadow-lg transition-all ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-600">Mensagem</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Envie e receba mensagens. Clique para adicionar uma mensagem:
        </p>
        
        {expanded && (
          <div className="space-y-3 mb-3">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Mensagem de texto</span>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium">Caso ocorrer erro no envio da mensagem:</Label>
              <RadioGroup value={errorHandling} onValueChange={setErrorHandling}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="next" id="next" />
                  <Label htmlFor="next" className="text-xs">Próximo passo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stop" id="stop" />
                  <Label htmlFor="stop" className="text-xs">Parar automação</Label>
                </div>
              </RadioGroup>
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
          Adicionar mensagem
        </Button>
        
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-blue-500"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-500"
        />
      </CardContent>
    </Card>
  );
}