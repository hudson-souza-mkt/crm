import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Flag, MoreHorizontal, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UTMs } from "@/types/lead";
import { cn } from "@/lib/utils";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  avatarUrl?: string;
  phone: string;
  salesperson: string;
  tags: string[];
  value: number;
  date: string;
  priority?: "red" | "green";
  activities: boolean;
  document?: string;
  utms?: UTMs;
  // Novos campos para melhor gestão do pipeline
  stage?: string;
  stageUpdatedAt?: string; // Para calcular tempo em etapa
  atRisk?: boolean; // Para identificar negócios em risco
  lastActivity?: string; // Data da última atividade
}

interface PipelineCardProps {
  lead: Lead;
  onCardClick: (lead: Lead) => void;
  isDragging?: boolean;
}

export function PipelineCard({ lead, onCardClick, isDragging }: PipelineCardProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // Calcula quantos dias o lead está na etapa atual
  const getDaysInStage = () => {
    if (!lead.stageUpdatedAt) return null;
    
    const updatedDate = new Date(lead.stageUpdatedAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - updatedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysInStage = getDaysInStage();
  const isStagnated = daysInStage && daysInStage > 7; // Considera estagnado após 7 dias

  return (
    <Card 
      className={cn(
        "shadow-sm hover:shadow-md transition-shadow border-border bg-white pipeline-card cursor-pointer",
        lead.atRisk && "border-l-4 border-l-red-500",
        isDragging && "ring-2 ring-primary shadow-lg"
      )}
      onClick={() => onCardClick(lead)}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={lead.avatarUrl} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {lead.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">{lead.name}</span>
                {lead.priority && (
                  <span className="ml-1">
                    {lead.priority === 'red' ? (
                      <Flag className="h-3 w-3 text-red-500 fill-red-500" />
                    ) : (
                      <Flag className="h-3 w-3 text-green-500 fill-green-500" />
                    )}
                  </span>
                )}
                {isStagnated && (
                  <span className="ml-1" title={`${daysInStage} dias na etapa atual`}>
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{lead.company || "Sem empresa"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 space-y-2 border-t pt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="w-5 h-5 flex items-center justify-center mr-1 bg-gray-100 rounded-full text-gray-500">H</span>
            <span>{lead.salesperson}</span>
          </div>
          <div className="flex items-center text-xs font-medium">
            <span className="w-5 h-5 flex items-center justify-center mr-1 bg-green-50 rounded-full text-green-600">R$</span>
            <span className={lead.value > 0 ? "text-green-700" : "text-gray-500"}>
              {formatCurrency(lead.value)}
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
            <span>{lead.date}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            {daysInStage ? (
              <span className={cn(isStagnated && "text-amber-600")}>
                {daysInStage} {daysInStage === 1 ? "dia" : "dias"} na etapa
              </span>
            ) : (
              <span>Sem atividades</span>
            )}
            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}