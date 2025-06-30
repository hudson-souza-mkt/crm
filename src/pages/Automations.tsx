import { useState } from "react";
import { AutomationCard } from "@/components/automations/AutomationCard";
import { toast } from "sonner";
import {
  Mail,
  UserPlus,
  Clock,
  Sparkles,
  Move,
  Bell,
  ListChecks,
  Smile,
  RefreshCw,
  AlertTriangle,
  LucideIcon
} from "lucide-react";

type AutomationCategory = "Leads e Contatos" | "Negócios e Pipeline" | "Pós-venda e Clientes" | "Tarefas e Alertas";

interface Automation {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: AutomationCategory;
}

const automationsData: Automation[] = [
  {
    id: "welcome-lead",
    title: "Boas-vindas ao Novo Lead",
    description: "Envie um e-mail ou mensagem de boas-vindas automaticamente quando um novo lead for criado no sistema.",
    icon: Mail,
    category: "Leads e Contatos",
  },
  {
    id: "assign-lead",
    title: "Atribuir Lead a Vendedor",
    description: "Distribua novos leads para a equipe de vendas de forma equilibrada (round-robin) ou com base em regras.",
    icon: UserPlus,
    category: "Leads e Contatos",
  },
  {
    id: "inactive-lead-alert",
    title: "Notificar sobre Lead Inativo",
    description: "Alerte um vendedor se um lead não tiver nenhuma interação registrada por um determinado número de dias.",
    icon: Clock,
    category: "Leads e Contatos",
  },
  {
    id: "enrich-lead",
    title: "Enriquecimento de Lead",
    description: "Use uma API externa para buscar e adicionar informações valiosas (empresa, cargo, etc.) aos seus leads.",
    icon: Sparkles,
    category: "Leads e Contatos",
  },
  {
    id: "stale-deal-alert",
    title: "Notificar sobre Negócio Parado",
    description: "Envie uma notificação quando um negócio permanecer na mesma etapa do funil por tempo demais.",
    icon: Bell,
    category: "Negócios e Pipeline",
  },
  {
    id: "create-task-on-stage-move",
    title: "Criar Tarefa ao Mover Etapa",
    description: "Quando um negócio avançar para uma etapa específica (ex: Proposta), crie uma tarefa para o vendedor.",
    icon: ListChecks,
    category: "Negócios e Pipeline",
  },
  {
    id: "nps-survey",
    title: "Pesquisa de Satisfação (NPS)",
    description: "Após um negócio ser marcado como 'Ganho', envie um e-mail com uma pesquisa de satisfação para o cliente.",
    icon: Smile,
    category: "Pós-venda e Clientes",
  },
  {
    id: "renewal-reminder",
    title: "Lembrete de Renovação",
    description: "Para negócios baseados em assinatura, envie um lembrete ao cliente e ao vendedor antes do vencimento.",
    icon: RefreshCw,
    category: "Pós-venda e Clientes",
  },
  {
    id: "overdue-task-alert",
    title: "Notificação de Tarefa Atrasada",
    description: "Notifique o responsável quando uma tarefa associada a um lead ou negócio estiver atrasada.",
    icon: AlertTriangle,
    category: "Tarefas e Alertas",
  },
  {
    id: "move-inactive-deal",
    title: "Mover Negócio por Inatividade",
    description: "Mova um negócio para uma coluna de 'Follow-up' se ele ficar parado em uma etapa por mais de X dias.",
    icon: Move,
    category: "Negócios e Pipeline",
  },
];

export default function Automations() {
  const [activeAutomations, setActiveAutomations] = useState<Record<string, boolean>>({});

  const handleToggleAutomation = (id: string, active: boolean) => {
    setActiveAutomations(prev => ({ ...prev, [id]: active }));
    const automation = automationsData.find(a => a.id === id);
    if (automation) {
      toast.success(`Automação "${automation.title}" foi ${active ? 'ativada' : 'desativada'}.`);
    }
  };

  const groupedAutomations = automationsData.reduce((acc, automation) => {
    if (!acc[automation.category]) {
      acc[automation.category] = [];
    }
    acc[automation.category].push(automation);
    return acc;
  }, {} as Record<AutomationCategory, Automation[]>);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
        <p className="text-muted-foreground mt-2">
          Automatize tarefas repetitivas e foque no que realmente importa para o seu negócio.
        </p>
      </div>

      {Object.entries(groupedAutomations).map(([category, automations]) => (
        <div key={category}>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automations.map((automation) => (
              <AutomationCard
                key={automation.id}
                id={automation.id}
                icon={automation.icon}
                title={automation.title}
                description={automation.description}
                isActive={!!activeAutomations[automation.id]}
                onToggle={handleToggleAutomation}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}