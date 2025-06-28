import { PipelineCard, type Lead } from "./PipelineCard";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";

interface KanbanColumnProps {
  title: string;
  leads: Lead[];
  totalValue: number;
  count: number;
}

export function KanbanColumn({ title, leads, totalValue, count }: KanbanColumnProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getColumnColor = () => {
    switch (title) {
      case "Novo Lead":
        return "bg-gray-100";
      case "Qualificação":
        return "bg-gray-100";
      case "Conversando":
        return "bg-gray-100";
      case "Proposta":
        return "bg-gray-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className={`flex-shrink-0 w-80 rounded-lg ${getColumnColor()} overflow-hidden`}>
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground ml-1">
            {formatCurrency(totalValue)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {count > 0 && (
            <span className="text-xs text-muted-foreground">
              {count === 1 ? '1 Negócio' : `${count} Negócios`}
            </span>
          )}
          {count === 0 && (
            <span className="text-xs text-muted-foreground">
              Nenhum negócio
            </span>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-2 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
        {leads.map((lead) => (
          <PipelineCard key={lead.id} lead={lead} />
        ))}
      </div>
      <div className="p-2 border-t">
        <Button variant="ghost" className="w-full justify-center text-xs font-normal" size="sm">
          <Plus className="h-3 w-3 mr-1" />
          Novo negócio
        </Button>
      </div>
    </div>
  );
}