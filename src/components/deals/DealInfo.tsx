import { useState } from "react";
import { DealDetails } from "./DealDetails";
import { DealForm } from "./DealForm";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  expectedCloseDate: Date;
  description?: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  contact: Contact;
  company: Company;
}

// Dados de exemplo para um negócio específico
const initialDeal: Deal = {
  id: "deal-001",
  title: "Desenvolvimento de E-commerce para TechCorp",
  value: 75000,
  stage: "proposal",
  expectedCloseDate: new Date("2025-07-30"),
  description: "Projeto completo de desenvolvimento de uma nova plataforma de e-commerce para a TechCorp, incluindo integração com sistemas de pagamento e logística.",
  priority: "high",
  tags: ["e-commerce", "react", "pagamentos"],
  contact: {
    id: "contact-123",
    name: "Ana Silva",
    email: "ana.silva@techcorp.com",
    phone: "(11) 98765-4321",
  },
  company: {
    id: "company-456",
    name: "TechCorp",
    industry: "Tecnologia",
    website: "www.techcorp.com",
  },
};

export function DealInfo() {
  const [deal, setDeal] = useState<Deal>(initialDeal);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedDeal: Deal) => {
    setDeal(updatedDeal);
    setIsEditing(false);
    // Aqui você adicionaria a lógica para salvar no backend
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
          deal={deal} 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <DealDetails deal={deal} />
      )}
    </div>
  );
}