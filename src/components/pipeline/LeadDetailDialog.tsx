import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tag,
  Edit,
  Briefcase,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  X,
  User,
  Building,
  Instagram,
  FileText,
  Globe,
  ExternalLink,
  List,
  Check,
  Send,
  Smile,
  Clock,
  MessageSquare,
  PhoneCall,
  CalendarPlus,
  CheckSquare,
  DollarSign,
  Target,
  Activity,
  TrendingUp,
  Thermometer,
  AlertTriangle,
  ChevronRight,
  Save,
  BarChart,
  Zap,
  Flag,
  Timer,
  ArrowUp,
  ArrowDown,
  Percent,
  Award,
  AlertCircle,
  CheckCircle,
  Star
} from "lucide-react";
import type { Lead } from "./PipelineCard";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAgendaManager } from "@/hooks/useAgendaManager";
import { AgendaList } from "@/components/agenda/AgendaList";
import { AgendaModal } from "@/components/agenda/AgendaModal";
import { AgendaItem, AgendaItemType } from "@/types/agenda";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const historyMock = [
  {
    type: "tag_add",
    content: 'Tag "Morno" adicionada ao lead.',
    date: "27/06/2025 14:46",
  },
  {
    type: "tag_add",
    content: 'Tag "Quente" adicionada ao lead.',
    date: "26/06/2025 16:30",
  },
  {
    type: "tag_remove",
    content: 'Tag "Morno" removida do lead.',
    date: "26/06/2025 16:30",
  },
  {
    type: "tag_add",
    content: 'Tag "Morno" adicionada ao lead.',
    date: "25/06/2025 11:30",
  },
  {
    type: "lead_update",
    content: "Lead atualizado.",
    date: "25/06/2025 10:01",
  },
];

const chatMessagesMock = [
    { isOutgoing: false, message: "Olá! Gostaria de saber mais sobre seus produtos.", time: "10:25" },
    { isOutgoing: true, message: "Olá João! Claro, ficarei feliz em ajudar. Que tipo de produto você está procurando?", time: "10:26" },
    { isOutgoing: false, message: "Estou interessado em soluções para automação de vendas.", time: "10:28" },
];

// Lista de próximas ações sugeridas
const suggestedActionsMock = [
  {
    id: 1,
    title: "Enviar proposta comercial",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: "high",
    type: "email"
  },
  {
    id: 2,
    title: "Agendar demonstração do produto",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: "medium",
    type: "meeting"
  },
  {
    id: 3,
    title: "Follow-up após envio da proposta",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: "medium",
    type: "call"
  }
];

// Alerta para o lead
const alertsMock = [
  {
    id: 1,
    type: "danger",
    message: "Lead sem contato há 14 dias",
    action: "Agende um contato"
  },
  {
    id: 2,
    type: "warning",
    message: "Proposta enviada sem follow-up",
    action: "Agendar ligação"
  }
];

// Métricas de analytics
const analyticsMock = {
  tempoPipeline: 14, // dias
  mediaEtapa: 7, // dias na etapa atual
  probabilidade: 65, // % de chance de fechar
  valorMedio: 5000, // ticket médio
  tempoMedioFechar: 22, // dias para fechar
  leadsAtivos: 6, // leads ativos do mesmo vendedor
  scoreAtual: 78 // pontuação do lead de 0-100
};

// Componentes de score
const scoreComponents = [
  { name: "Engajamento", value: 85, color: "bg-green-500" },
  { name: "Fit do Produto", value: 70, color: "bg-blue-500" },
  { name: "Orçamento", value: 90, color: "bg-purple-500" },
  { name: "Timing", value: 60, color: "bg-amber-500" }
];

// Lista de etapas da pipeline
const pipelineStages = [
  "Novo Lead",
  "Qualificação",
  "Apresentação",
  "Proposta",
  "Negociação",
  "Ganho",
  "Perdido"
];

const TimelineItem = ({ icon, children, isLast = false }: { icon: React.ReactNode, children: React.ReactNode, isLast?: boolean }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="bg-green-100 rounded-full h-8 w-8 flex items-center justify-center text-green-600">
        {icon}
      </div>
      {!isLast && <div className="w-px h-full bg-gray-200" />}
    </div>
    <div className="pb-8 flex-1">
      <div className="p-4 rounded-lg bg-white border">
        {children}
      </div>
    </div>
  </div>
);

const getIconForHistory = (type: string) => {
  switch (type) {
    case "tag_add":
    case "tag_remove":
      return <Tag className="h-4 w-4" />;
    case "lead_update":
      return <Edit className="h-4 w-4" />;
    default:
      return <Briefcase className="h-4 w-4" />;
  }
};

const InfoField = ({ label, value, placeholder, link }: { label: string, value?: string, placeholder: string, link?: string }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    {value ? (
      <div className="flex items-center justify-between group">
        <p className="text-sm text-gray-800">{value}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary" />
          </a>
        )}
      </div>
    ) : (
      <p className="text-sm text-gray-400 italic">{placeholder}</p>
    )}
  </div>
);

// Componente para edição inline
interface EditableFieldProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: "text" | "number" | "textarea" | "select";
  label?: string;
  options?: {value: string, label: string}[];
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  formatValue?: (value: any) => string;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onSave, 
  type = "text", 
  label,
  options = [],
  icon,
  className,
  placeholder = "Editar...",
  formatValue = (v) => String(v)
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
    toast.success("Informação atualizada com sucesso!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      handleSave();
    } else if (e.key === "Escape") {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div className={cn("group relative", className)}>
      {label && <label className="text-sm font-medium text-muted-foreground mb-1 block">{label}</label>}
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          {type === "textarea" ? (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={currentValue as string}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
              placeholder={placeholder}
            />
          ) : type === "select" ? (
            <Select 
              value={String(currentValue)} 
              onValueChange={(value) => setCurrentValue(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              value={currentValue as string}
              onChange={(e) => setCurrentValue(type === "number" ? Number(e.target.value) : e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
              placeholder={placeholder}
            />
          )}
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <span className={cn(
            value ? "text-foreground" : "text-muted-foreground italic",
            "flex-1 truncate"
          )}>
            {value ? formatValue(value) : placeholder}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Componente de barra de progresso da pipeline
interface PipelineProgressProps {
  stages: string[];
  currentStage: string;
  onStageChange?: (stage: string) => void;
}

const PipelineProgress: React.FC<PipelineProgressProps> = ({ 
  stages, 
  currentStage,
  onStageChange
}) => {
  const currentIndex = stages.indexOf(currentStage);
  const stageCount = stages.length - 2; // Excluindo "Ganho" e "Perdido"
  const progress = currentIndex >= 0 && currentIndex < stageCount 
    ? Math.round((currentIndex / (stageCount - 1)) * 100) 
    : currentStage === "Ganho" ? 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Progresso na Pipeline</p>
        <Badge variant={currentStage === "Ganho" ? "success" : currentStage === "Perdido" ? "destructive" : "outline"}>
          {currentStage}
        </Badge>
      </div>
      
      <Progress value={progress} className="h-3" />
      
      <div className="flex justify-between mt-1">
        <TooltipProvider>
          {stages
            .filter(stage => stage !== "Perdido")
            .map((stage, index) => {
              const isActive = currentStage === stage;
              const isPassed = stages.indexOf(currentStage) > index || currentStage === "Ganho";
              const isEnd = index === stages.length - 2; // "Ganho" é o último
              
              return (
                <Tooltip key={stage}>
                  <TooltipTrigger asChild>
                    <button 
                      className={cn(
                        "rounded-full h-3 w-3 transition-all",
                        isActive ? "ring-2 ring-primary ring-offset-2" : "",
                        isPassed ? "bg-primary" : "bg-muted",
                        isEnd ? "ml-0" : ""
                      )}
                      onClick={() => onStageChange?.(stage)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stage}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
        </TooltipProvider>
      </div>
    </div>
  );
};

// Componente para o score do lead
interface LeadScoreProps {
  score: number;
  components: Array<{name: string; value: number; color: string}>;
}

const LeadScore: React.FC<LeadScoreProps> = ({ score, components }) => {
  // Determinar a cor do score baseada no valor
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  // Determinar o status do score
  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Alto potencial";
    if (score >= 60) return "Potencial médio";
    return "Baixo potencial";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Score do Lead
        </CardTitle>
        <CardDescription>
          Pontuação baseada em diversos fatores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className={cn("text-3xl font-bold", getScoreColor(score))}>
              {score}
            </div>
            <div className="text-sm text-muted-foreground">
              {getScoreStatus(score)}
            </div>
          </div>
          
          <div className="flex-1 ml-4">
            {components.map((component, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{component.name}</span>
                  <span className="font-medium">{component.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", component.color)} 
                    style={{ width: `${component.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para métricas e analytics
interface LeadAnalyticsProps {
  analytics: {
    tempoPipeline: number;
    mediaEtapa: number;
    probabilidade: number;
    valorMedio: number;
    tempoMedioFechar: number;
    leadsAtivos: number;
    scoreAtual: number;
  };
  formatCurrency: (value: number) => string;
}

const LeadAnalytics: React.FC<LeadAnalyticsProps> = ({ analytics, formatCurrency }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Analytics e Métricas
        </CardTitle>
        <CardDescription>
          Insights e métricas avançadas para este negócio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Tempo na pipeline</p>
              <div className="flex items-center gap-1 text-sm">
                <Timer className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{analytics.tempoPipeline} dias</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Tempo na etapa atual</p>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{analytics.mediaEtapa} dias</span>
                <Badge variant="outline" className="text-xs ml-1">
                  {analytics.mediaEtapa > 7 ? 
                    <ArrowUp className="h-3 w-3 text-red-500" /> : 
                    <ArrowDown className="h-3 w-3 text-green-500" />
                  }
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Probabilidade</p>
              <div className="flex items-center gap-1 text-sm">
                <Percent className="h-4 w-4 text-green-500" />
                <span className="font-medium">{analytics.probabilidade}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Valor médio</p>
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">{formatCurrency(analytics.valorMedio)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Tempo médio para fechar</p>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="font-medium">{analytics.tempoMedioFechar} dias</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Leads ativos do vendedor</p>
              <div className="flex items-center gap-1 text-sm">
                <User className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{analytics.leadsAtivos}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para alertas e próximas ações
interface AlertsAndActionsProps {
  alerts: Array<{
    id: number;
    type: string;
    message: string;
    action: string;
  }>;
  actions: Array<{
    id: number;
    title: string;
    dueDate: Date;
    priority: string;
    type: string;
  }>;
  onCreateAction: () => void;
}

const AlertsAndActions: React.FC<AlertsAndActionsProps> = ({ 
  alerts, 
  actions,
  onCreateAction
}) => {
  // Ícone baseado no tipo de ação
  const getActionIcon = (type: string) => {
    switch (type) {
      case "call": return <PhoneCall className="h-4 w-4 text-blue-500" />;
      case "email": return <Mail className="h-4 w-4 text-amber-500" />;
      case "meeting": return <CalendarIcon className="h-4 w-4 text-purple-500" />;
      default: return <CheckSquare className="h-4 w-4 text-green-500" />;
    }
  };

  // Cor baseada na prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-amber-500";
      default: return "text-blue-500";
    }
  };
  
  // Formatação de data
  const formatDueDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Amanhã";
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Alertas e Próximas Ações
        </CardTitle>
        <CardDescription>
          Alertas importantes e ações sugeridas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Alertas</h4>
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "p-3 rounded-md flex items-start gap-3",
                  alert.type === "danger" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                )}
              >
                <AlertTriangle className={cn(
                  "h-5 w-5 mt-0.5",
                  alert.type === "danger" ? "text-red-500" : "text-amber-500"
                )} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.message}</p>
                  <Button 
                    variant="link" 
                    className={cn(
                      "h-auto p-0 text-xs",
                      alert.type === "danger" ? "text-red-600" : "text-amber-600"
                    )}
                  >
                    {alert.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Próximas Ações */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Próximas Ações</h4>
            <Button variant="outline" size="sm" onClick={onCreateAction}>
              <Plus className="h-3 w-3 mr-1" />
              Nova Ação
            </Button>
          </div>
          
          {actions.length > 0 ? (
            <div className="space-y-2">
              {actions.map((action) => (
                <div key={action.id} className="p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-2">
                    {getActionIcon(action.type)}
                    <span className="font-medium text-sm flex-1">{action.title}</span>
                    <Flag className={cn("h-4 w-4", getPriorityColor(action.priority))} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDueDate(action.dueDate)}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p>Nenhuma ação sugerida.</p>
              <Button variant="link" className="h-auto p-0 mt-1">
                Criar nova ação
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function LeadDetailDialog({ lead, open, onOpenChange }: LeadDetailDialogProps) {
  const [currentStage, setCurrentStage] = useState("Perdido");
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [editingAgendaItem, setEditingAgendaItem] = useState<AgendaItem | null>(null);
  const [defaultAgendaType, setDefaultAgendaType] = useState<AgendaItemType>("task");
  
  // Valores editáveis do lead
  const [editableLead, setEditableLead] = useState<Partial<Lead> | null>(null);
  
  // Atualizar valores editáveis quando o lead mudar
  useEffect(() => {
    if (lead) {
      setEditableLead(lead);
      setCurrentStage(lead.stage || "Novo Lead");
    }
  }, [lead]);
  
  // Usar o hook de agenda
  const agendaManager = useAgendaManager({ 
    leadId: lead?.id,
    onItemUpdate: (item) => {
      console.log("Agenda item updated:", item);
    }
  });
  
  if (!lead) return null;

  const stages = ["Novo Lead", "Qualificação", "Conversando", "Proposta", "Ganho", "Perdido"];

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage);
    setEditableLead({...editableLead, stage: newStage});
    toast.success(`Negócio movido para: ${newStage}`);
  };

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case "Ganho":
        return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200/80";
      case "Perdido":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200/80";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200/80";
    }
  };

  const handleNewAgenda = (type: AgendaItemType) => {
    setDefaultAgendaType(type);
    setEditingAgendaItem(null);
    setAgendaModalOpen(true);
  };

  const handleEditAgenda = (item: AgendaItem) => {
    setEditingAgendaItem(item);
    setAgendaModalOpen(true);
  };

  const handleAgendaSubmit = (agendaData: Partial<AgendaItem>) => {
    if (editingAgendaItem) {
      agendaManager.updateAgendaItem(editingAgendaItem.id, agendaData);
    } else {
      agendaManager.createAgendaItem({
        ...agendaData,
        leadId: lead.id,
        leadName: lead.name,
        createdBy: lead.salesperson
      });
    }
  };

  const handleExecuteAgenda = (item: AgendaItem) => {
    switch (item.type) {
      case "message":
        if (item.messageChannel === "whatsapp") {
          const cleanPhone = lead.phone.replace(/\D/g, '');
          const message = encodeURIComponent(item.messageTemplate || "");
          window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
          toast.success("WhatsApp aberto com a mensagem");
        } else if (item.messageChannel === "email") {
          const subject = encodeURIComponent(`Assunto: ${item.title}`);
          const body = encodeURIComponent(item.messageTemplate || "");
          window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_self');
          toast.success("Email aberto com a mensagem");
        }
        agendaManager.completeAgendaItem(item.id);
        break;
      case "call":
        window.open(`tel:${lead.phone}`, '_self');
        toast.success("Ligação iniciada");
        agendaManager.updateAgendaItem(item.id, { status: "in-progress" });
        break;
      case "email":
        if (lead.email) {
          const subject = encodeURIComponent(item.title);
          const body = encodeURIComponent(item.description || "");
          window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_self');
          toast.success("Email aberto");
          agendaManager.completeAgendaItem(item.id);
        }
        break;
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Não informado";
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return "Data inválida";
    }
  };

  // Função para atualizar os campos do lead
  const handleLeadUpdate = (field: string, value: any) => {
    if (editableLead) {
      setEditableLead({
        ...editableLead,
        [field]: value
      });
      // Aqui você pode chamar uma API para atualizar o lead no banco de dados
      console.log(`Field "${field}" updated to "${value}"`);
    }
  };

  // Calcular o índice da etapa atual na pipeline
  const stageIndex = pipelineStages.indexOf(currentStage);
  const stageProgress = Math.max(0, Math.min(100, (stageIndex / (pipelineStages.length - 3)) * 100));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] lg:max-w-[85vw] xl:max-w-[1400px] p-0 h-[90vh] flex flex-col">
          <div className="flex h-full overflow-hidden">
            {/* Sidebar */}
            <div className="w-[350px] bg-gray-50 border-r flex-shrink-0 flex flex-col">
              <div className="p-6">
                <div className="relative w-24 h-24 mx-auto">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                      {lead.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold text-center mt-4">{lead.name}</h2>
                <p className="text-sm text-muted-foreground text-center">{lead.company || "Marketing Digital"}</p>
                
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                    <Check className="h-4 w-4 mr-2" />
                    Ganhar
                  </Button>
                  <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                    <X className="h-4 w-4 mr-2" />
                    Perder
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start text-muted-foreground">
                    <Tag className="h-4 w-4 mr-2" /> Adicionar tags
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-muted-foreground">
                    <List className="h-4 w-4 mr-2" /> Adicionar listas
                  </Button>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  <span>{lead.salesperson}</span>
                </div>
              </div>

              <Tabs defaultValue="perfil" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid w-full grid-cols-4 px-4 flex-shrink-0">
                  <TabsTrigger value="perfil">Perfil</TabsTrigger>
                  <TabsTrigger value="endereco">Endereço</TabsTrigger>
                  <TabsTrigger value="campos">Campos</TabsTrigger>
                  <TabsTrigger value="utms">UTMs</TabsTrigger>
                </TabsList>
                <div className="flex-1 overflow-y-auto p-6">
                  <TabsContent value="perfil" className="space-y-4 mt-0">
                    <InfoField label="Nome" value={`${lead.name} | Marketing Digital`} placeholder="Informe o nome" />
                    <InfoField label="Empresa" value={lead.company} placeholder="Informe a empresa do lead" />
                    <InfoField label="E-mail" value="exemplo@meulead.com" placeholder="Informe o e-mail" />
                    <InfoField label="Telefone" value={lead.phone} placeholder="Informe o telefone" />
                    <InfoField label="Instagram" value="hudson_souza_mkt" placeholder="Informe o Instagram" link="https://instagram.com/hudson_souza_mkt" />
                    <InfoField label="Documento (CPF/CNPJ)" value={lead.document} placeholder="Informe o CPF ou CPNJ" />
                    <InfoField label="Origem" value="Site" placeholder="Como o lead ficou sabendo?" />
                    <InfoField label="Site" value="www.meulead.com.br" placeholder="Informe o site" link="https://www.meulead.com.br" />
                  </TabsContent>
                  <TabsContent value="endereco" className="mt-0">
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhum endereço informado.</p>
                  </TabsContent>
                  <TabsContent value="campos" className="mt-0">
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhum campo adicional.</p>
                  </TabsContent>
                  <TabsContent value="utms" className="space-y-4 mt-0">
                    <InfoField label="utm_source" value={lead.utms?.utm_source} placeholder="Não informado" />
                    <InfoField label="utm_medium" value={lead.utms?.utm_medium} placeholder="Não informado" />
                    <InfoField label="utm_campaign" value={lead.utms?.utm_campaign} placeholder="Não informado" />
                    <InfoField label="utm_term" value={lead.utms?.utm_term} placeholder="Não informado" />
                    <InfoField label="utm_content" value={lead.utms?.utm_content} placeholder="Não informado" />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              <DialogHeader className="p-4 border-b flex-row justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Negócio #3</h3>
                  <Select value={currentStage} onValueChange={handleStageChange}>
                    <SelectTrigger className={cn(
                      "w-auto h-auto border-none px-2.5 py-0.5 rounded-md text-xs font-semibold focus:ring-0 focus:ring-offset-0",
                      getStageBadgeClass(currentStage)
                    )}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(stage =>  (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogHeader>
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                <Tabs defaultValue="info">
                  <TabsList className="mb-4">
                    <TabsTrigger value="historico">Histórico</TabsTrigger>
                    <TabsTrigger value="atividades">Atividades</TabsTrigger>
                    <TabsTrigger value="agenda">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Agenda
                    </TabsTrigger>
                    <TabsTrigger value="negocios">Negócios</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
                    <TabsTrigger value="info">
                      <Target className="h-4 w-4 mr-1" />
                      Informações do Negócio
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="historico" className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Histórico</h3>
                        <p className="text-sm text-muted-foreground">Veja o histórico do seu lead</p>
                      </div>
                      <div className="flex gap-2">
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Todos os Tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os Tipos</SelectItem>
                            <SelectItem value="tags">Tags</SelectItem>
                            <SelectItem value="updates">Atualizações</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Comentário
                        </Button>
                      </div>
                    </div>
                    <div>
                      {historyMock.map((item, index) => (
                        <TimelineItem key={index} icon={getIconForHistory(item.type)} isLast={index === historyMock.length - 1}>
                          <p className="font-medium">{item.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                        </TimelineItem>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="atividades">
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="mx-auto h-10 w-10 mb-2" />
                      <p>Nenhuma atividade encontrada.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="agenda" className="pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-semibold">Agenda</h3>
                        <p className="text-sm text-muted-foreground">Gerencie agendamentos e tarefas para este lead</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNewAgenda("task")}
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Nova tarefa
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNewAgenda("call")}
                        >
                          <PhoneCall className="h-4 w-4 mr-2" />
                          Agendar ligação
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNewAgenda("message")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mensagem automática
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleNewAgenda("meeting")}
                        >
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          Nova reunião
                        </Button>
                      </div>
                    </div>
                    
                    <AgendaList
                      items={agendaManager.agendaItems}
                      onEdit={handleEditAgenda}
                      onDelete={agendaManager.deleteAgendaItem}
                      onComplete={agendaManager.completeAgendaItem}
                      onCancel={agendaManager.cancelAgendaItem}
                      onExecute={handleExecuteAgenda}
                      getTypeLabel={agendaManager.getTypeLabel}
                      getStatusLabel={agendaManager.getStatusLabel}
                      getPriorityColor={agendaManager.getPriorityColor}
                      getStatusColor={agendaManager.getStatusColor}
                    />
                  </TabsContent>
                  <TabsContent value="negocios">
                    <div className="text-center py-12 text-muted-foreground">
                      <Briefcase className="mx-auto h-10 w-10 mb-2" />
                      <p>Nenhum negócio encontrado.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="chat" className="pt-6">
                    <div className="flex flex-col h-[calc(100vh-320px)] border rounded-lg bg-white">
                      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {chatMessagesMock.map((msg, index) => (
                            <ChatMessage key={index} isOutgoing={msg.isOutgoing} message={msg.message} time={msg.time} />
                        ))}
                      </div>
                      <div className="p-3 bg-white border-t">
                        <div className="flex items-center gap-2">
                
                            <div className="relative w-full">
                                <Input
                                    placeholder="Digite sua mensagem..."
                                    className="h-10 rounded-lg border bg-white pl-3 pr-10"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <Smile className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                            <Button size="icon" className="h-10 w-10 flex-shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="arquivos">
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="mx-auto h-10 w-10 mb-2" />
                      <p>Nenhum arquivo encontrado.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="info">
                    {/* NOVA ABA DE INFORMAÇÕES DO NEGÓCIO COM MELHORIAS */}
                    <div className="space-y-6">
                      
                      {/* Header e Progresso da Pipeline */}
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                              <Target className="h-5 w-5 text-primary" />
                              Informações do Negócio
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              Visão geral e detalhes deste negócio
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                              ID: {lead.id.substring(0, 8)}
                            </Badge>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/50">
                                    <Thermometer className="h-5 w-5 text-amber-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Temperatura: Morno</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <Button variant="outline" className="gap-1">
                              <Edit className="h-4 w-4" />
                              Editar
                            </Button>
                          </div>
                        </div>
                        
                        {/* Barra de Progresso da Pipeline */}
                        <PipelineProgress 
                          stages={pipelineStages}
                          currentStage={currentStage}
                          onStageChange={handleStageChange}
                        />
                      </div>
                      
                      {/* Layout principal: 2 colunas */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Coluna principal (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Métricas Principais */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="group hover:border-green-500 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Valor</p>
                                    <EditableField
                                      value={editableLead?.value || 0}
                                      onSave={(value) => handleLeadUpdate("value", value)}
                                      type="number"
                                      formatValue={(v) => formatCurrency(Number(v))}
                                    />
                                  </div>
                                  <DollarSign className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform" />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="group hover:border-blue-500 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Etapa</p>
                                    <EditableField
                                      value={editableLead?.stage || ""}
                                      onSave={(value) => handleLeadUpdate("stage", value)}
                                      type="select"
                                      options={stages.map(s => ({ value: s, label: s }))}
                                      formatValue={(v) => String(v)}
                                    />
                                  </div>
                                  <Target className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="group hover:border-purple-500 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Origem</p>
                                    <EditableField
                                      value={editableLead?.source || ""}
                                      onSave={(value) => handleLeadUpdate("source", value)}
                                      type="text"
                                      formatValue={(v) => String(v)}
                                    />
                                  </div>
                                  <Activity className="h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform" />
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="group hover:border-amber-500 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                                    <EditableField
                                      value={editableLead?.status || ""}
                                      onSave={(value) => handleLeadUpdate("status", value)}
                                      type="select"
                                      options={[
                                        {value: "new", label: "Novo"},
                                        {value: "qualified", label: "Qualificado"},
                                        {value: "negotiating", label: "Negociando"},
                                        {value: "won", label: "Ganho"},
                                        {value: "lost", label: "Perdido"}
                                      ]}
                                      formatValue={(v) => {
                                        const statusMap: Record<string, string> = {
                                          new: "Novo",
                                          qualified: "Qualificado",
                                          negotiating: "Negociando",
                                          won: "Ganho",
                                          lost: "Perdido"
                                        };
                                        return statusMap[String(v)] || String(v);
                                      }}
                                    />
                                  </div>
                                  <Clock className="h-8 w-8 text-amber-500 group-hover:scale-110 transition-transform" />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          {/* Analytics e Métricas */}
                          <LeadAnalytics 
                            analytics={analyticsMock}
                            formatCurrency={formatCurrency}
                          />
                          
                          {/* Alertas e Próximas Ações */}
                          <AlertsAndActions 
                            alerts={alertsMock}
                            actions={suggestedActionsMock}
                            onCreateAction={() => handleNewAgenda("task")}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Informações do Cliente */}
                            <Card className="hover:shadow-md transition-shadow">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  Informações do Cliente
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                                  <EditableField
                                    value={editableLead?.name || ""}
                                    onSave={(value) => handleLeadUpdate("name", value)}
                                    type="text"
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                                  <EditableField
                                    value={editableLead?.company || ""}
                                    onSave={(value) => handleLeadUpdate("company", value)}
                                    type="text"
                                    className="mt-1"
                                    icon={<Building className="h-4 w-4 text-muted-foreground" />}
                                    placeholder="Adicionar empresa"
                                  />
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                                  <EditableField
                                    value={editableLead?.phone || ""}
                                    onSave={(value) => handleLeadUpdate("phone", value)}
                                    type="text"
                                    className="mt-1"
                                    icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                                    placeholder="Adicionar telefone"
                                  />
                                </div>

                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                                  <EditableField
                                    value={editableLead?.email || ""}
                                    onSave={(value) => handleLeadUpdate("email", value)}
                                    type="text"
                                    className="mt-1"
                                    icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                                    placeholder="Adicionar email"
                                  />
                                </div>
                              </CardContent>
                            </Card>

                            {/* Datas Importantes */}
                            <Card className="hover:shadow-md transition-shadow">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <CalendarIcon className="h-5 w-5" />
                                  Datas Importantes
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                                    <p className="text-sm font-semibold mt-1 flex items-center">
                                      <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                                      {formatDate(lead.createdAt)}
                                    </p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                                    <p className="text-sm font-semibold mt-1 flex items-center">
                                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                                      {formatDate(lead.updatedAt)}
                                    </p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Último contato</label>
                                    <EditableField
                                      value={lead.lastContact ? formatDate(lead.lastContact) : "Não informado"}
                                      onSave={(value) => handleLeadUpdate("lastContact", new Date())}
                                      type="text"
                                      className="mt-1"
                                      icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
                                      placeholder="Registrar contato"
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          {/* Tags e Observações */}
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Observações
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <EditableField
                                value={editableLead?.notes || ""}
                                onSave={(value) => handleLeadUpdate("notes", value)}
                                type="textarea"
                                placeholder="Adicione observações sobre este negócio..."
                              />
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Coluna secundária (1/3) */}
                        <div className="space-y-6">
                          {/* Score do Lead */}
                          <LeadScore 
                            score={analyticsMock.scoreAtual}
                            components={scoreComponents}
                          />
                          
                          {/* Tags */}
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Tags
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {lead.tags && lead.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {lead.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="px-2 py-1 gap-1">
                                      {tag}
                                      <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-muted rounded-full">
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))}
                                  <Button variant="outline" size="sm" className="rounded-full h-7">
                                    <Plus className="h-3 w-3 mr-1" />
                                    Adicionar
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-sm text-muted-foreground mb-2">Nenhuma tag adicionada</p>
                                  <Button variant="outline" size="sm">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Adicionar Tags
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          
                          {/* Responsável */}
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Responsável
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {lead.salesperson ? lead.salesperson.charAt(0) : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <EditableField
                                    value={lead.salesperson || ""}
                                    onSave={(value) => handleLeadUpdate("salesperson", value)}
                                    type="text"
                                    placeholder="Atribuir responsável"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Ações Rápidas */}
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Ações Rápidas
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <Button variant="outline" className="w-full justify-start" onClick={() => handleNewAgenda("call")}>
                                <PhoneCall className="h-4 w-4 mr-2 text-blue-500" />
                                Agendar Ligação
                              </Button>
                              <Button variant="outline" className="w-full justify-start" onClick={() => handleNewAgenda("message")}>
                                <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                                Enviar Mensagem
                              </Button>
                              <Button variant="outline" className="w-full justify-start" onClick={() => handleNewAgenda("meeting")}>
                                <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
                                Agendar Reunião
                              </Button>
                              <Button className="w-full mt-4">
                                <Award className="h-4 w-4 mr-2" />
                                Converter em Cliente
                              </Button>
                            </CardContent>
                          </Card>
                          
                          {/* Atividade Recente */}
                          <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Atividade Recente
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {historyMock.slice(0, 3).map((item, index) => (
                                  <div key={index} className="flex items-start gap-3">
                                    <div className="bg-muted rounded-full p-1.5 mt-0.5">
                                      {getIconForHistory(item.type)}
                                    </div>
                                    <div>
                                      <p className="text-sm">{item.content}</p>
                                      <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <Button variant="link" className="mt-2 h-auto p-0">
                                Ver todo o histórico
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de agenda */}
      <AgendaModal
        open={agendaModalOpen}
        onOpenChange={setAgendaModalOpen}
        onSubmit={handleAgendaSubmit}
        leadId={lead?.id || ""}
        leadName={lead?.name || ""}
        editItem={editingAgendaItem}
        defaultType={defaultAgendaType}
      />
    </>
  );
}