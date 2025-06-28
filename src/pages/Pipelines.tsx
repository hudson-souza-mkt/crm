import { KanbanBoard } from "@/components/pipeline/KanbanBoard";

export default function Pipelines() {
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <KanbanBoard />
    </div>
  );
}