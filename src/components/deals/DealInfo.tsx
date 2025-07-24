import { useState, useEffect } from "react";
import { DealDetails } from "./DealDetails";
import { DealForm } from "./DealForm";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";
import type { Lead } from "@/components/pipeline/PipelineCard";

// A interface Deal agora é um alias para Lead para consistência
export type Deal = Lead;

interface DealInfoProps {
  deal: Deal;
}

export function DealInfo({ deal }: DealInfoProps) {
  const [currentDeal, setCurrentDeal] = useState<Deal>(deal);
  const [isEditing, setIsEditing] = useState(false);

  // Atualiza o estado interno se o negócio selecionado mudar
  useEffect(() => {
    setCurrentDeal(deal);
    setIsEditing(false); // Sai do modo de edição ao selecionar um novo negócio
  }, [deal]);

  const handleSave = (updatedDeal: Deal) => {
    setCurrentDeal(updatedDeal);
    setIsEditing(false);
    // Aqui você adicionaria a lógica para salvar no backend
    // Ex: updateDealInDatabase(updatedDeal);
  };

  return (
    <div className="p-4 bg-muted/30 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {isEditing ? "Editando Negócio" : "Detalhes do Negócio"}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
          className="gap-1.5"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              Cancelar
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Editar
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <DealForm 
          deal={currentDeal} 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <DealDetails deal={currentDeal} />
      )}
    </div>
  );
}