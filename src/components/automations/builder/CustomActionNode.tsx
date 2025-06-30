import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Tag, LucideProps } from 'lucide-react';
import * as Icons from 'lucide-react';

// Mapeamento de ícones para evitar importações dinâmicas inseguras
const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Mail: Icons.Mail,
  Tag: Icons.Tag,
  // Adicione outros ícones conforme necessário
};

export function CustomActionNode({ data }: NodeProps<{ label: string; icon: string }>) {
  const IconComponent = iconMap[data.icon] || Mail;

  return (
    <Card className="w-64 border-border shadow-md">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <IconComponent className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-semibold">{data.label}</p>
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-slate-400"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-slate-400"
        />
      </CardContent>
    </Card>
  );
}