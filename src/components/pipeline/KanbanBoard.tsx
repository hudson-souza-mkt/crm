import { KanbanColumn } from "./KanbanColumn";
import type { Lead } from "./PipelineCard";

const mockLeads: Record<string, Lead[]> = {
  "Novo Lead": [
    { id: "1", name: "Alice Johnson", phone: "(11) 98765-4321", salesperson: "Carlos", tags: ["VIP", "Follow-up"] },
    { id: "2", name: "Bob Williams", avatarUrl: "https://github.com/shadcn.png", phone: "(21) 91234-5678", salesperson: "Ana", tags: ["Hot"] },
  ],
  "Em Contato": [
    { id: "3", name: "Charlie Brown", phone: "(31) 99999-8888", salesperson: "Carlos", tags: [] },
  ],
  "Proposta Enviada": [
    { id: "4", name: "Diana Prince", avatarUrl: "https://github.com/vercel.png", phone: "(41) 98888-7777", salesperson: "Ana", tags: ["Urgente"] },
  ],
  "Negociação": [],
};

export function KanbanBoard() {
  const stages = ["Novo Lead", "Em Contato", "Proposta Enviada", "Negociação", "Fechado"];
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {stages.map((stage) => (
        <KanbanColumn key={stage} title={stage} leads={mockLeads[stage] || []} />
      ))}
    </div>
  );
}