import { DraggableDealCard } from "./DraggableDealCard";
import { type Deal } from "@/types/deal";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import type { StageColor } from "./KanbanBoard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  title: string;
  deals: Deal[];
  totalValue: number;
  count: number;
  color: StageColor;
  onColorChange: (id: string, color: string) => void;
  onCardClick: (deal: Deal) => void;
  onAddClick?: () => void;
}

export function KanbanColumn({ 
  id,
  title, 
  deals, 
  totalValue, 
  count, 
  color, 
  onColorChange, 
  onCardClick,
  onAddClick
}: KanbanColumnProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const getColumnStyle = () => {
    return {
      bg: `bg-${color}-50`,
      indicator: `bg-${color}-500`,
      borderTop: `border-t-4 border-t-${color}-500`
    };
  };

  const columnStyle = getColumnStyle();

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      accepts: ['deal'],
      stageId: id
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        `flex-shrink-0 w-80 rounded-lg ${columnStyle.bg} overflow-hidden shadow-sm ${columnStyle.borderTop}`,
        isOver && "ring-2 ring-primary/50"
      )}
    >
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${columnStyle.indicator}`}></span>
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground ml-1 font-medium">
            {formatCurrency(totalValue)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {count > 0 && (
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full font-medium">
              {count === 1 ? '1 Negócio' : `${count} Negócios`}
            </span>
          )}
          {count === 0 && (
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full font-medium">
              Vazio
            </span>
          )}
          <ColorPicker
            selectedColor={color}
            onColorChange={(newColor) => onColorChange(id, newColor)}
          />
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-2 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
        <SortableContext items={deals.map(deal => deal.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DraggableDealCard
              key={deal.id}
              deal={deal}
              onCardClick={onCardClick}
            />
          ))}
        </SortableContext>
      </div>
      <div className="p-2 border-t bg-white/50">
        <Button 
          variant="outline" 
          className="w-full justify-center text-xs font-normal hover:bg-white/80" 
          size="sm"
          onClick={onAddClick}
        >
          <Plus className="h-3 w-3 mr-1" />
          Novo negócio
        </Button>
      </div>
    </div>
  );
}