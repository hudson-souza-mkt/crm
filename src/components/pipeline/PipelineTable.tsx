import { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "./PipelineCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Phone,
  Mail,
  Building,
  Calendar as CalendarIcon,
  DollarSign,
  UserCheck,
  Tag,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Check,
  X,
  Clock,
  CircleDollarSign,
  Truck,
  CalendarRange,
  ArrowDownUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PipelineCardModal } from "./PipelineCardModal";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface PipelineTableProps {
  leads: Lead[];
  stages: string[];
  onStageChange: (leadId: string, newStage: string) => void;
  onLeadUpdate: (leadId: string, updates: Partial<Lead>) => void;
  onDeleteLead?: (leadId: string) => void;
}

// Configuração da tabela
type ColumnKey = 
  | "name" 
  | "company" 
  | "phone" 
  | "email" 
  | "stage" 
  | "value" 
  | "assignedTo" 
  | "expectedCloseDate"
  | "tags"
  | "discount"
  | "shippingCost"
  | "createdAt"
  | "lastContact";

interface Column {
  key: ColumnKey;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Definição das colunas da tabela
const columns: Column[] = [
  { key: "name", title: "Lead", sortable: true, filterable: true, width: "250px" },
  { key: "company", title: "Empresa", sortable: true, filterable: true, icon: Building },
  { key: "phone", title: "Telefone", icon: Phone },
  { key: "email", title: "Email", filterable: true, icon: Mail },
  { key: "stage", title: "Etapa", sortable: true, filterable: true, icon: Clock },
  { key: "value", title: "Valor", sortable: true, icon: DollarSign },
  { key: "assignedTo", title: "Responsável", sortable: true, filterable: true, icon: UserCheck },
  { key: "expectedCloseDate", title: "Previsão", sortable: true, icon: CalendarRange },
  { key: "discount", title: "Desconto", icon: CircleDollarSign },
  { key: "shippingCost", title: "Frete", icon: Truck },
  { key: "tags", title: "Tags", filterable: true, icon: Tag },
  { key: "createdAt", title: "Data de criação", sortable: true, icon: Calendar },
  { key: "lastContact", title: "Último contato", sortable: true, icon: Clock },
];

type SortDirection = "asc" | "desc";

interface SortConfig {
  key: ColumnKey | null;
  direction: SortDirection;
}

export function PipelineTable({
  leads,
  stages,
  onStageChange,
  onLeadUpdate,
  onDeleteLead,
}: PipelineTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>([
    "name", "company", "stage", "value", "assignedTo", "expectedCloseDate", "tags"
  ]);
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "asc",
  });
  
  const [editingCell, setEditingCell] = useState<{
    leadId: string;
    column: ColumnKey;
  } | null>(null);
  
  const [editValue, setEditValue] = useState<string>("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  
  const editInputRef = useRef<HTMLInputElement>(null);
  
  // Efeito para focar no input quando começar a editar
  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCell]);
  
  // Ordenação dos leads
  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue: any = a[sortConfig.key as keyof Lead];
    let bValue: any = b[sortConfig.key as keyof Lead];
    
    // Tratar valores específicos
    if (sortConfig.key === "expectedCloseDate" || sortConfig.key === "createdAt" || sortConfig.key === "lastContact") {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }
    
    if (sortConfig.key === "value" || sortConfig.key === "discount" || sortConfig.key === "shippingCost") {
      aValue = aValue || 0;
      bValue = bValue || 0;
    }
    
    if (sortConfig.key === "tags") {
      aValue = aValue ? aValue.join(", ") : "";
      bValue = bValue ? bValue.join(", ") : "";
    }
    
    if (aValue === bValue) return 0;
    
    const result = aValue > bValue ? 1 : -1;
    return sortConfig.direction === "asc" ? result : -result;
  });
  
  // Aplicar filtros
  const filteredLeads = sortedLeads.filter(lead => {
    if (stageFilter && lead.stage !== stageFilter) return false;
    if (tagFilter && (!lead.tags || !lead.tags.includes(tagFilter))) return false;
    if (assigneeFilter && lead.assignedTo !== assigneeFilter) return false;
    return true;
  });
  
  // Manipuladores de edição
  const startEditing = (leadId: string, column: ColumnKey, currentValue: any) => {
    setEditingCell({ leadId, column });
    
    // Converter o valor para string para edição
    if (column === "expectedCloseDate" || column === "createdAt" || column === "lastContact") {
      const date = currentValue ? new Date(currentValue) : null;
      setEditValue(date ? format(date, "yyyy-MM-dd") : "");
    } else if (column === "value" || column === "discount" || column === "shippingCost") {
      setEditValue(currentValue?.toString() || "");
    } else if (column === "tags") {
      setEditValue(currentValue ? currentValue.join(", ") : "");
    } else {
      setEditValue(currentValue?.toString() || "");
    }
  };
  
  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue("");
  };
  
  const saveEditing = () => {
    if (!editingCell) return;
    
    const { leadId, column } = editingCell;
    let updatedValue: any = editValue;
    
    // Converter o valor para o tipo apropriado
    if (column === "expectedCloseDate" || column === "createdAt" || column === "lastContact") {
      updatedValue = editValue ? new Date(editValue) : null;
    } else if (column === "value" || column === "discount" || column === "shippingCost") {
      updatedValue = editValue ? parseFloat(editValue) : null;
    } else if (column === "tags") {
      updatedValue = editValue ? editValue.split(",").map(t => t.trim()).filter(t => t) : [];
    }
    
    // Atualizar o lead
    onLeadUpdate(leadId, { [column]: updatedValue });
    
    // Se estiver alterando o estágio, chamar a função específica
    if (column === "stage") {
      onStageChange(leadId, updatedValue);
    }
    
    // Limpar o estado de edição
    setEditingCell(null);
    setEditValue("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEditing();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };
  
  // Manipuladores de ordenação
  const handleSort = (key: ColumnKey) => {
    let direction: SortDirection = "asc";
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    
    setSortConfig({ key, direction });
  };
  
  // Manipulador de seleção de leads
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId) 
        : [...prev, leadId]
    );
  };
  
  const toggleAllLeads = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };
  
  // Funções para formatação de dados
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "—";
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date || !isValid(date)) return "—";
    try {
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "—";
    }
  };
  
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) return "—";
    return `${value}%`;
  };
  
  // Obter todas as tags e responsáveis para filtros
  const allTags = [...new Set(leads.flatMap(lead => lead.tags || []))].sort();
  const allAssignees = [...new Set(leads.map(lead => lead.assignedTo).filter(Boolean))].sort();
  
  // Iniciar edição quando clicar duas vezes em uma célula
  const handleCellDoubleClick = (leadId: string, column: ColumnKey, currentValue: any) => {
    if (column === "stage" || column === "assignedTo" || column === "expectedCloseDate") {
      // Esses campos têm interfaces especiais de edição, então não usamos o método padrão
      return;
    }
    startEditing(leadId, column, currentValue);
  };
  
  // Manipuladores de ações em massa
  const handleBulkDelete = () => {
    if (!selectedLeads.length) return;
    
    if (confirm(`Tem certeza que deseja excluir ${selectedLeads.length} leads?`)) {
      selectedLeads.forEach(leadId => {
        if (onDeleteLead) onDeleteLead(leadId);
      });
      setSelectedLeads([]);
      toast.success(`${selectedLeads.length} leads excluídos com sucesso!`);
    }
  };
  
  const handleBulkStageChange = (newStage: string) => {
    if (!selectedLeads.length) return;
    
    selectedLeads.forEach(leadId => {
      onStageChange(leadId, newStage);
    });
    
    toast.success(`${selectedLeads.length} leads movidos para ${newStage}`);
  };
  
  const handleBulkAssign = (assignee: string) => {
    if (!selectedLeads.length) return;
    
    selectedLeads.forEach(leadId => {
      onLeadUpdate(leadId, { assignedTo: assignee });
    });
    
    toast.success(`${selectedLeads.length} leads atribuídos para ${assignee}`);
  };
  
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailModalOpen(true);
  };
  
  // Renderizadores de células específicas
  const renderCell = (lead: Lead, column: ColumnKey) => {
    const isEditing = editingCell?.leadId === lead.id && editingCell?.column === column;
    
    // Verificar se estamos editando esta célula
    if (isEditing) {
      // Campos específicos com interfaces de edição especiais
      if (column === "stage") {
        return (
          <Select
            value={editValue}
            onValueChange={(value) => {
              setEditValue(value);
              setTimeout(() => saveEditing(), 100);
            }}
            open={true}
            onOpenChange={() => false}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      
      if (column === "expectedCloseDate") {
        return (
          <Input
            type="date"
            ref={editInputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEditing}
            className="w-full h-8"
          />
        );
      }
      
      // Células com edição de texto padrão
      return (
        <div className="flex items-center gap-1">
          <Input
            ref={editInputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-green-600" 
            onClick={saveEditing}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-red-600" 
            onClick={cancelEditing}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }
    
    // Renderização normal das células (sem edição)
    switch (column) {
      case "name":
        return (
          <div className="flex items-center gap-2 max-w-[250px]">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {lead.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <div className="font-medium truncate">{lead.name}</div>
              {lead.email && (
                <div className="text-xs text-muted-foreground truncate">{lead.email}</div>
              )}
            </div>
          </div>
        );
      case "stage":
        return (
          <div onClick={() => startEditing(lead.id, "stage", lead.stage)}>
            <Badge variant="outline" className="cursor-pointer bg-muted/50">
              {lead.stage}
            </Badge>
          </div>
        );
      case "value":
        return (
          <div>
            <div className="font-medium">{formatCurrency(lead.value)}</div>
            {(lead.discount || lead.shippingCost) && (
              <div className="text-xs text-muted-foreground">
                {lead.discount && `Desc: ${formatPercentage(lead.discount)}`}
                {lead.discount && lead.shippingCost && " · "}
                {lead.shippingCost && `Frete: ${formatCurrency(lead.shippingCost)}`}
              </div>
            )}
          </div>
        );
      case "tags":
        return (
          <div className="flex flex-wrap gap-1">
            {lead.tags && lead.tags.length > 0 ? (
              lead.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
            {lead.tags && lead.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{lead.tags.length - 2}
              </Badge>
            )}
          </div>
        );
      case "expectedCloseDate":
        return (
          <div 
            className="cursor-pointer flex items-center gap-1 hover:bg-muted rounded p-1"
            onClick={() => {
              // Abrir um popover para seleção de data
              startEditing(lead.id, "expectedCloseDate", lead.expectedCloseDate);
            }}
          >
            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
            {formatDate(lead.expectedCloseDate)}
          </div>
        );
      case "assignedTo":
        return (
          <div
            className="cursor-pointer flex items-center gap-1 hover:bg-muted rounded p-1"
            onClick={() => {
              startEditing(lead.id, "assignedTo", lead.assignedTo);
            }}
          >
            {lead.assignedTo || (
              <span className="text-muted-foreground text-sm">Não atribuído</span>
            )}
          </div>
        );
      case "discount":
        return formatPercentage(lead.discount);
      case "shippingCost":
        return formatCurrency(lead.shippingCost);
      case "createdAt":
        return formatDate(lead.createdAt);
      case "lastContact":
        return formatDate(lead.lastContact);
      default:
        // Para outros campos, apenas mostrar o valor ou '—' se for null/undefined
        const value = lead[column as keyof Lead];
        return value || <span className="text-muted-foreground text-sm">—</span>;
    }
  };
  
  // Barra de ações para leads selecionados
  const renderBulkActionBar = () => {
    if (selectedLeads.length === 0) return null;
    
    return (
      <div className="bg-muted rounded-lg p-2 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{selectedLeads.length} selecionados</Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Mover para etapa
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {stages.map((stage) => (
                <DropdownMenuItem 
                  key={stage}
                  onClick={() => handleBulkStageChange(stage)}
                >
                  {stage}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Atribuir para
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {allAssignees.length > 0 ? (
                allAssignees.map((assignee) => (
                  <DropdownMenuItem 
                    key={assignee}
                    onClick={() => handleBulkAssign(assignee)}
                  >
                    {assignee}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  Nenhum responsável disponível
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600"
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSelectedLeads([])}
        >
          Cancelar
        </Button>
      </div>
    );
  };
  
  // Renderizar barra de filtros
  const renderFilterBar = () => {
    return (
      <div className="flex items-center gap-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filtrar por etapa
              {stageFilter && <Badge variant="secondary" className="ml-1">{stageFilter}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={() => setStageFilter(null)}
              className={!stageFilter ? "bg-muted" : ""}
            >
              Todas as etapas
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {stages.map((stage) => (
              <DropdownMenuItem 
                key={stage}
                onClick={() => setStageFilter(stage)}
                className={stageFilter === stage ? "bg-muted" : ""}
              >
                {stage}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Tag className="h-4 w-4" />
              Filtrar por tag
              {tagFilter && <Badge variant="secondary" className="ml-1">{tagFilter}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={() => setTagFilter(null)}
              className={!tagFilter ? "bg-muted" : ""}
            >
              Todas as tags
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {allTags.map((tag) => (
              <DropdownMenuItem 
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={tagFilter === tag ? "bg-muted" : ""}
              >
                {tag}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <UserCheck className="h-4 w-4" />
              Filtrar por responsável
              {assigneeFilter && <Badge variant="secondary" className="ml-1">{assigneeFilter}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={() => setAssigneeFilter(null)}
              className={!assigneeFilter ? "bg-muted" : ""}
            >
              Todos os responsáveis
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {allAssignees.map((assignee) => (
              <DropdownMenuItem 
                key={assignee}
                onClick={() => setAssigneeFilter(assignee)}
                className={assigneeFilter === assignee ? "bg-muted" : ""}
              >
                {assignee}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns.map((column) => (
                <DropdownMenuItem 
                  key={column.key}
                  onClick={() => {
                    setVisibleColumns(prev => 
                      prev.includes(column.key)
                        ? prev.filter(key => key !== column.key)
                        : [...prev, column.key]
                    );
                  }}
                >
                  <Checkbox 
                    checked={visibleColumns.includes(column.key)} 
                    className="mr-2"
                  />
                  {column.icon && <column.icon className="h-4 w-4 mr-2 text-muted-foreground" />}
                  {column.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };
  
  // Componente principal da tabela
  return (
    <div className="space-y-2">
      {renderFilterBar()}
      
      {renderBulkActionBar()}
      
      <div className="rounded-md border shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedLeads.length > 0 && selectedLeads.length === filteredLeads.length} 
                    onCheckedChange={toggleAllLeads}
                  />
                </TableHead>
                
                {columns
                  .filter(col => visibleColumns.includes(col.key))
                  .map((column) => (
                    <TableHead 
                      key={column.key}
                      className={cn(
                        column.width ? column.width : "",
                        column.sortable ? "cursor-pointer" : ""
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-1">
                        {column.icon && <column.icon className="h-4 w-4 text-muted-foreground" />}
                        {column.title}
                        {column.sortable && sortConfig.key === column.key && (
                          sortConfig.direction === "asc" 
                            ? <ChevronUp className="h-4 w-4" />
                            : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  ))
                }
                
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + 2} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <div className="text-lg font-medium">Nenhum registro encontrado</div>
                      <div className="text-sm">Tente ajustar os filtros ou adicionar novos leads</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow 
                    key={lead.id}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      selectedLeads.includes(lead.id) && "bg-muted/50"
                    )}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedLeads.includes(lead.id)} 
                        onCheckedChange={() => toggleLeadSelection(lead.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    
                    {columns
                      .filter(col => visibleColumns.includes(col.key))
                      .map((column) => (
                        <TableCell 
                          key={`${lead.id}-${column.key}`}
                          onDoubleClick={() => handleCellDoubleClick(lead.id, column.key, lead[column.key as keyof Lead])}
                          onClick={column.key === "name" ? () => handleLeadClick(lead) : undefined}
                          className={column.key === "name" ? "cursor-pointer" : ""}
                        >
                          {renderCell(lead, column.key)}
                        </TableCell>
                      ))
                    }
                    
                    <TableCell>
                      <div className="flex items-center gap-1 justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleLeadClick(lead)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => onDeleteLead && onDeleteLead(lead.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Modal de detalhes do lead */}
      {selectedLead && (
        <PipelineCardModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          lead={selectedLead}
          onStageChange={onStageChange}
          onLeadUpdate={onLeadUpdate}
        />
      )}
    </div>
  );
}