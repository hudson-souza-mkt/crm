import { Button } from "@/components/ui/button";
import { 
  MessageCircle, Zap, Filter, Clock, Shuffle, 
  Braces, Settings, Brain, LucideIcon 
} from "lucide-react";

interface NodeOption {
  type: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

const nodeOptions: NodeOption[] = [
  { type: 'message', label: 'Mensagem', icon: MessageCircle, color: 'text-blue-500' },
  { type: 'action', label: 'Ações', icon: Zap, color: 'text-yellow-500' },
  { type: 'condition', label: 'Condições', icon: Filter, color: 'text-cyan-500' },
  { type: 'wait', label: 'Espera', icon: Clock, color: 'text-purple-500' },
  { type: 'randomizer', label: 'Randomizador', icon: Shuffle, color: 'text-orange-500' },
  { type: 'api', label: 'API', icon: Braces, color: 'text-green-500' },
  { type: 'field_operations', label: 'Operações de campos', icon: Settings, color: 'text-gray-500' },
  { type: 'ai', label: 'IA', icon: Brain, color: 'text-purple-600' },
];

const NodeOptionButton = ({ label, icon: Icon, color }: { label: string, icon: LucideIcon, color: string }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Button 
      variant="outline" 
      className="w-full justify-start gap-3 cursor-grab active:cursor-grabbing h-12"
      draggable
      onDragStart={(event) => onDragStart(event, label.toLowerCase())}
    >
      <Icon className={`h-5 w-5 ${color}`} />
      <span className="font-medium">{label}</span>
    </Button>
  );
};

export function AutomationNodeSidebar() {
  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold">Blocos básicos</h2>
      </div>
      
      <div className="space-y-2">
        {nodeOptions.map(option => (
          <NodeOptionButton 
            key={option.type}
            label={option.label}
            icon={option.icon}
            color={option.color}
          />
        ))}
      </div>
    </div>
  );
}