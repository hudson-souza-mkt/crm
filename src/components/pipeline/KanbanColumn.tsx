import { PipelineCard, type Lead } from "./PipelineCard";

interface KanbanColumnProps {
  title: string;
  leads: Lead[];
}

export function KanbanColumn({ title, leads }: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 bg-muted/50 rounded-lg p-4">
      <h3 className="font-semibold mb-4 px-1">{title} ({leads.length})</h3>
      <div className="flex flex-col">
        {leads.map((lead) => (
          <PipelineCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}