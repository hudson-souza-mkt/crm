import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  MessageSquare,
  Mail,
  Users,
  MapPin,
  Plus,
  History,
  TrendingUp
} from "lucide-react";
import { ContactAttemptModal } from "./ContactAttemptModal";
import { ContactAttemptHistory } from "./ContactAttemptHistory";
import { useContactAttempts } from "@/hooks/useContactAttempts";
import type { ContactAttemptType } from "@/types/contact-attempt";
import type { Lead } from "@/types/lead";

interface ContactAttemptButtonProps {
  lead: Lead;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showCount?: boolean;
}

export function ContactAttemptButton({ 
  lead, 
  variant = "outline", 
  size = "sm",
  showCount = true 
}: ContactAttemptButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [defaultType, setDefaultType] = useState<ContactAttemptType>('call');
  
  const { getContactAttemptSummary } = useContactAttempts();
  const summary = getContactAttemptSummary(lead.id);

  const quickActions = [
    { type: 'call' as ContactAttemptType, label: 'Ligação', icon: Phone, color: 'text-blue-600' },
    { type: 'whatsapp' as ContactAttemptType, label: 'WhatsApp', icon: MessageSquare, color: 'text-green-600' },
    { type: 'email' as ContactAttemptType, label: 'Email', icon: Mail, color: 'text-orange-600' },
    { type: 'meeting' as ContactAttemptType, label: 'Reunião', icon: Users, color: 'text-purple-600' },
    { type: 'visit' as ContactAttemptType, label: 'Visita', icon: MapPin, color: 'text-red-600' }
  ];

  const handleQuickAction = (type: ContactAttemptType) => {
    setDefaultType(type);
    setModalOpen(true);
  };

  const getSuccessRate = () => {
    if (summary.totalAttempts === 0) return 0;
    return Math.round((summary.successfulAttempts / summary.totalAttempts) * 100);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className="gap-2">
            <Phone className="h-4 w-4" />
            {showCount && summary.totalAttempts > 0 && (
              <Badge variant="secondary" className="text-xs">
                {summary.totalAttempts}
              </Badge>
            )}
            Contato
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Ações Rápidas */}
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Registrar Tentativa
          </div>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={action.type}
                onClick={() => handleQuickAction(action.type)}
                className="gap-2"
              >
                <Icon className={`h-4 w-4 ${action.color}`} />
                {action.label}
              </DropdownMenuItem>
            );
          })}
          
          <DropdownMenuItem onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Outro Tipo
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Estatísticas Rápidas */}
          {summary.totalAttempts > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Estatísticas
              </div>
              <div className="px-2 py-1.5 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Total de tentativas:</span>
                  <span className="font-medium">{summary.totalAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de sucesso:</span>
                  <span className="font-medium text-green-600">{getSuccessRate()}%</span>
                </div>
                {summary.lastAttempt && (
                  <div className="flex justify-between">
                    <span>Último contato:</span>
                    <span className="font-medium">
                      {summary.lastAttempt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          
          {/* Ações Secundárias */}
          <DropdownMenuItem onClick={() => setHistoryOpen(true)} className="gap-2">
            <History className="h-4 w-4" />
            Ver Histórico
          </DropdownMenuItem>
          
          <DropdownMenuItem className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de Registro */}
      <ContactAttemptModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        lead={lead}
        defaultType={defaultType}
      />

      {/* Modal de Histórico */}
      <ContactAttemptHistory
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        lead={lead}
      />
    </>
  );
}