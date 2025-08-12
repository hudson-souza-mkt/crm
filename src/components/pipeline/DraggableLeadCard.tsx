import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PipelineCard, type Lead } from "./PipelineCard";

interface DraggableLeadCardProps {
  lead: Lead;
  onCardClick: (lead: Lead) => void;
  onQuickAction?: (action: string, lead: Lead) => void;
}

export function DraggableLeadCard({ lead, onCardClick, onQuickAction }: DraggableLeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
    data: {
      type: 'lead',
      lead,
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
        lead={lead} 
        onCardClick={onCardClick} 
        isDragging={isDragging}
      />
    </div>
  );
}