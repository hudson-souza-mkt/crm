import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, UserPlus, LucideProps } from 'lucide-react';
import * as Icons from 'lucide-react';

// Mapeamento de ícones para evitar importações dinâmicas inseguras
const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  UserPlus: Icons.UserPlus,
  Zap: Icons.Zap,
  // Adicione outros ícones conforme necessário
};

export function CustomTriggerNode({ data }: NodeProps<{ label: string; icon: string }>) {
  const IconComponent = iconMap[data.icon] || Zap;

  return (
    <Card className="w-64 border-2 border-primary shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IconComponent className="h-6 w-6" />
          </div>
          <p className="font-semibold text-primary">{data.label}</p>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-primary"
        />
      </CardContent>
    </Card>
  );
}