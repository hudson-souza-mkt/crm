import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Node } from "reactflow";
import { TriggerNodeConfig } from "./TriggerNodeConfig";
import { ActionNodeConfig } from "./ActionNodeConfig";
import { MessageNodeConfig } from "./MessageNodeConfig";
import { ConditionNodeConfig } from "./ConditionNodeConfig";
import { WaitNodeConfig } from "./WaitNodeConfig";

interface NodeConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: Node | null;
  onSave: (nodeId: string, data: any) => void;
}

export function NodeConfigDialog({ open, onOpenChange, node, onSave }: NodeConfigDialogProps) {
  const [localNodeData, setLocalNodeData] = useState<any>(node?.data || {});
  
  const handleSave = () => {
    if (node) {
      onSave(node.id, localNodeData);
      onOpenChange(false);
    }
  };
  
  if (!node) return null;
  
  // Títulos e descrições baseados no tipo de nó
  const getTitleAndDescription = () => {
    switch (node.type) {
      case 'trigger':
        return {
          title: "Configurar Gatilho",
          description: "Defina quando esta automação deve ser iniciada."
        };
      case 'action':
        return {
          title: "Configurar Ação",
          description: "Configure as ações que serão executadas nesta etapa."
        };
      case 'message':
        return {
          title: "Configurar Mensagem",
          description: "Personalize a mensagem que será enviada."
        };
      case 'condition':
        return {
          title: "Configurar Condição",
          description: "Defina a condição para ramificar o fluxo."
        };
      case 'wait':
        return {
          title: "Configurar Espera",
          description: "Configure o tempo de espera antes de prosseguir."
        };
      default:
        return {
          title: "Configurar Nó",
          description: "Configure as propriedades deste nó."
        };
    }
  };
  
  const { title, description } = getTitleAndDescription();
  
  // Renderizar o componente de configuração apropriado com base no tipo de nó
  const renderConfigComponent = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <TriggerNodeConfig 
            data={localNodeData} 
            onChange={setLocalNodeData} 
          />
        );
      case 'action':
        return (
          <ActionNodeConfig 
            data={localNodeData} 
            onChange={setLocalNodeData} 
          />
        );
      case 'message':
        return (
          <MessageNodeConfig 
            data={localNodeData} 
            onChange={setLocalNodeData} 
          />
        );
      case 'condition':
        return (
          <ConditionNodeConfig 
            data={localNodeData} 
            onChange={setLocalNodeData} 
          />
        );
      case 'wait':
        return (
          <WaitNodeConfig 
            data={localNodeData} 
            onChange={setLocalNodeData} 
          />
        );
      default:
        return <div>Tipo de nó não suportado.</div>;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderConfigComponent()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}