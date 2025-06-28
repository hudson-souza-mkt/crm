import { KanbanBoard } from "@/components/pipeline/KanbanBoard";

export default function Pipelines() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl font-bold tracking-tight">Pipelines</h1>
      <KanbanBoard />
    </div>
  );
}