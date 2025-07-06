import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Flag, MoreHorizontal, Plus, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Deal } from "@/types/deal";

interface PipelineCardProps {
  deal: Deal;
  onCardClick: (deal: Deal) => void;
  isDragging?: boolean;
}

export function PipelineCard({ deal, onCardClick, isDragging }: PipelineCardProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getDaysInStage = () => {
    if (!deal.updated_at) return null;
    
    const updatedDate = new Date(deal.updated_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - updatedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysInStage = getDaysInStage();
  const isStagnated = daysInStage && daysInStage > 7;

  return (
    <Card 
      className={cn(
        "shadow-sm hover:shadow-md transition-shadow border-border bg-white pipeline-card cursor-pointer",
        isStagnated && "border-l-4 border-l-amber-500",
        isDragging && "ring-2 ring-primary shadow-lg"
      )}
      onClick={() => onCardClick(deal)}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={deal.leads?.avatarUrl} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {deal.leads?.name?.charAt(0) || 'L'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">{deal.name}</span>
                {isStagnated && (
                  <span className="ml-1" title={`${daysInStage} dias na etapa atual`}>
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{deal.leads?.company || "Sem empresa"}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 space-y-2 border-t pt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="w-4 h-4 mr-1 text-gray-400" />
            <span>{deal.leads?.name || 'Lead não informado'}</span>
          </div>
          <div className="flex items-center text-xs font-medium">
            <span className="w-5 h-5 flex items-center justify-center mr-1 bg-green-50 rounded-full text-green-600">R$</span>
            <span className={deal.value > 0 ? "text-green-700" : "text-gray-500"}>
              {formatCurrency(deal.value)}
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
            <span>{new Date(deal.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            {daysInStage ? (
              <span className={cn(isStagnated && "text-amber-600")}>
                {daysInStage} {daysInStage === 1 ? "dia" : "dias"} na etapa
              </span>
            ) : (
              <span>Recém-movido</span>
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