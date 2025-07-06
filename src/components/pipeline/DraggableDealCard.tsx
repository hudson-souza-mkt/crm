import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PipelineCard } from "./PipelineCard";
import type { Deal } from "@/types/deal";

interface DraggableDealCardProps {
  deal: Deal;
  onCardClick: (deal: Deal) => void;
}

export function DraggableDealCard({ deal, onCardClick }: DraggableDealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: 'deal',
      deal,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <PipelineCard 
        deal={deal} 
        onCardClick={onCardClick} 
        isDragging={isDragging}
      />
    </div>
  );
}