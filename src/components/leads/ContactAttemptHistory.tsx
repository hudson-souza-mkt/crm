import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Linkedin,
  MessageCircle,
  Clock,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  TrendingUp,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useContactAttempts } from "@/hooks/useContactAttempts";
import { ContactAttemptModal } from "./ContactAttemptModal";
import type { ContactAttemptType, ContactAttemptStatus, ContactAttempt } from "@/types/contact-attempt";
import type { Lead } from "@/types/lead";

interface ContactAttemptHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export function ContactAttemptHistory({
  open,
  onOpenChange,
  lead
}: ContactAttemptHistoryProps) {
  const { 
    contactAttempts, 
    deleteContactAttempt, 
    getContactAttemptSummary,
    getTypeLabel,
    getStatusLabel,
    getStatusColor
  } = useContactAttempts(lead.id);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAttempt, setEditingAttempt] = useState<ContactAttempt | null>(null);

  const summary = getContactAttemptSummary(lead.id);

  const getTypeIcon = (type: ContactAttemptType) => {
    const icons = {
      call: Phone,
      whatsapp: MessageSquare,
      email: Mail,
      sms: MessageCircle,
      linkedin: Linkedin,
      meeting: Users,
      visit: MapPin,
      other: MessageCircle
    };
    return icons[type] || MessageCircle;
  };

  const getStatusIcon = (status: ContactAttemptStatus) => {
    const icons = {
      success: CheckCircle,
      interested: TrendingUp,
      scheduled: Calendar,
      callback_requested: Phone,
      no_answer: XCircle,
      busy: Clock,
      not_interested: XCircle,
      refused: XCircle,
      invalid: AlertTriangle,
      failed: XCircle
    };
    return icons[status] || Clock;
  };

  const filteredAttempts = contactAttempts.filter(attempt => {
    const matchesSearch = attempt.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.outcome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || attempt.type === typeFilter;
    const matchesStatus = statusFilter === "all" || attempt.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedAttempts = filteredAttempts.sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  const handleEditAttempt = (attempt: ContactAttempt) => {
    setEditingAttempt(attempt);
    setEditModalOpen(true);
  };

  const handleDeleteAttempt = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tentativa?")) {
      await deleteContactAttempt(id);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getSuccessRate = () => {
    if (summary.totalAttempts === 0) return 0;
    return Math.round((summary.successfulAttempts / summary.totalAttempts) * 100);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Histórico de Tentativas - {lead.name}
            </DialogTitle>
            <DialogDescription>
              Visualize todas as tentativas de contato realizadas com este lead
            </DialogDescription>
          </DialogHeader>

          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{summary.totalAttempts}</div>
              <div className="text-sm text-muted-foreground">Total de Tentativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.successfulAttempts}</div>
              <div className="text-sm text-muted-foreground">Sucessos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{getSuccessRate()}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summary.averageTimeBetweenAttempts > 0 
                  ? `${Math.round(summary.averageTimeBetweenAttempts)}h`
                  : "—"
                }
              </div>
              <div className="text-sm text-muted-foreground">Intervalo Médio</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar nas observações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="call">Ligação</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="meeting">Reunião</SelectItem>
                <SelectItem value="visit">Visita</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="interested">Interessado</SelectItem>
                <SelectItem value="no_answer">Não Atendeu</SelectItem>
                <SelectItem value="busy">Ocupado</SelectItem>
                <SelectItem value="not_interested">Não Interessado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Lista de Tentativas */}
          <ScrollArea className="flex-1 p-4">
            {sortedAttempts.length === 0 ? (
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma tentativa encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Ainda não há tentativas de contato registradas para este lead"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAttempts.map((attempt, index) => {
                  const TypeIcon = getTypeIcon(attempt.type);
                  const StatusIcon = getStatusIcon(attempt.status);
                  const isRecent = index === 0;
                  
                  return (
                    <div
                      key={attempt.id}
                      className={`p-4 border rounded-lg hover:shadow-sm transition-all ${
                        isRecent ? 'border-primary/20 bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Ícone do tipo */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <TypeIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>

                        {/* Conteúdo principal */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{getTypeLabel(attempt.type)}</h4>
                                <Badge variant="outline" className={getStatusColor(attempt.status)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {getStatusLabel(attempt.status)}
                                </Badge>
                                {isRecent && (
                                  <Badge variant="default" className="text-xs">
                                    Mais recente
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{attempt.channel}</span>
                                {attempt.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(attempt.duration)}
                                  </span>
                                )}
                                {attempt.cost && (
                                  <span>R$ {attempt.cost.toFixed(2)}</span>
                                )}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditAttempt(attempt)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteAttempt(attempt.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Resultado/Outcome */}
                          {attempt.outcome && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-green-700">
                                📋 {attempt.outcome}
                              </span>
                            </div>
                          )}

                          {/* Observações */}
                          {attempt.notes && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                {attempt.notes}
                              </p>
                            </div>
                          )}

                          {/* Tags */}
                          {attempt.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {attempt.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(attempt.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {attempt.createdByName}
                              </span>
                            </div>
                            <span>
                              {formatDistanceToNow(attempt.createdAt, { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </span>
                          </div>

                          {/* Follow-up agendado */}
                          {attempt.nextFollowUp && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                              <span className="flex items-center gap-1 text-blue-700">
                                <Calendar className="h-3 w-3" />
                                Follow-up agendado para {format(attempt.nextFollowUp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Estatísticas por Tipo */}
          {summary.totalAttempts > 0 && (
            <div className="p-4 border-t bg-muted/30">
              <h4 className="font-medium mb-3">Distribuição por Tipo</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(summary.attemptsByType).map(([type, count]) => {
                  const TypeIcon = getTypeIcon(type as ContactAttemptType);
                  return (
                    <div key={type} className="flex items-center gap-2 text-sm">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{getTypeLabel(type as ContactAttemptType)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <ContactAttemptModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        lead={lead}
        editAttempt={editingAttempt}
      />
    </>
  );
}