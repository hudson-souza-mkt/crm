import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, Mail, Tag, ListChecks, Clock, GitBranch, AlertTriangle, LucideIcon 
} from "lucide-react";

interface NodeOption {
  type: 'trigger' | 'action' | 'logic';
  label: string;
  icon: LucideIcon;
}

const triggerOptions: NodeOption[] = [
  { type: 'trigger', label: 'Novo Lead', icon: Zap },
  { type: 'trigger', label: 'Etapa do Funil Alterada', icon: Zap },
  { type: 'trigger', label: 'Tag Adicionada', icon: Zap },
];

const actionOptions: NodeOption[] = [
  { type: 'action', label: 'Enviar E-mail', icon: Mail },
  { type: 'action', label: 'Adicionar Tag', icon: Tag },
  { type: 'action', label: 'Criar Tarefa', icon: ListChecks },
  { type: 'action', label: 'Notificar Usuário', icon: AlertTriangle },
];

const logicOptions: NodeOption[] = [
  { type: 'logic', label: 'Aguardar', icon: Clock },
  { type: 'logic', label: 'Condição (Se/Então)', icon: GitBranch },
];

const NodeOptionButton = ({ label, icon: Icon }: { label: string, icon: LucideIcon }) => (
  <Button variant="outline" className="w-full justify-start gap-2 cursor-grab">
    <Icon className="h-4 w-4 text-muted-foreground" />
    {label}
  </Button>
);

export function AutomationNodeSidebar() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Blocos</h2>
      
      <div className="space-y-3">
        <h3 className="font-semibold text-muted-foreground">Gatilhos</h3>
        {triggerOptions.map(opt => <NodeOptionButton key={opt.label} {...opt} />)}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-muted-foreground">Ações</h3>
        {actionOptions.map(opt => <NodeOptionButton key={opt.label} {...opt} />)}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-muted-foreground">Lógica</h3>
        {logicOptions.map(opt => <NodeOptionButton key={opt.label} {...opt} />)}
      </div>
    </div>
  );
}