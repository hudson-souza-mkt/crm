import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TriggerNodeConfigProps {
  data: any;
  onChange: (data: any) => void;
}

// Lista de gatilhos disponíveis
const TRIGGER_TYPES = [
  { value: "lead_created", label: "Lead criado" },
  { value: "lead_updated", label: "Lead atualizado" },
  { value: "deal_created", label: "Negócio criado" },
  { value: "deal_stage_changed", label: "Negócio mudou de etapa" },
  { value: "deal_won", label: "Negócio ganho" },
  { value: "deal_lost", label: "Negócio perdido" },
  { value: "form_submitted", label: "Formulário enviado" },
  { value: "task_completed", label: "Tarefa concluída" },
  { value: "webhook", label: "Webhook (API externa)" },
  { value: "scheduled", label: "Agendado (recorrente)" },
];

export function TriggerNodeConfig({ data, onChange }: TriggerNodeConfigProps) {
  const handleTriggerTypeChange = (value: string) => {
    onChange({
      ...data,
      triggerType: value,
      // Reset trigger specific configurations
      triggerConfig: {},
    });
  };
  
  // Handler genérico para atualizações de configuração
  const handleConfigChange = (key: string, value: any) => {
    onChange({
      ...data,
      triggerConfig: {
        ...data.triggerConfig,
        [key]: value
      }
    });
  };
  
  // Renderizar campos específicos com base no tipo de gatilho selecionado
  const renderTriggerSpecificFields = () => {
    const triggerType = data.triggerType || "";
    
    switch (triggerType) {
      case "lead_created":
      case "lead_updated":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="source">Fonte do lead</Label>
              <Select
                value={data.triggerConfig?.source || "any"}
                onValueChange={(value) => handleConfigChange("source", value)}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="Qualquer fonte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer fonte</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="import">Importação</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="form">Formulário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label>Condições adicionais</Label>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Adicionar condições</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-2">
                      <div className="grid grid-cols-3 gap-2">
                        <Select defaultValue="name">
                          <SelectTrigger>
                            <SelectValue placeholder="Campo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Nome</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Telefone</SelectItem>
                            <SelectItem value="company">Empresa</SelectItem>
                            <SelectItem value="source">Origem</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select defaultValue="contains">
                          <SelectTrigger>
                            <SelectValue placeholder="Operador" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Igual a</SelectItem>
                            <SelectItem value="not_equals">Diferente de</SelectItem>
                            <SelectItem value="contains">Contém</SelectItem>
                            <SelectItem value="not_contains">Não contém</SelectItem>
                            <SelectItem value="starts_with">Começa com</SelectItem>
                            <SelectItem value="ends_with">Termina com</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input placeholder="Valor" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        );
        
      case "deal_created":
      case "deal_stage_changed":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="pipeline">Pipeline</Label>
              <Select
                value={data.triggerConfig?.pipeline || "any"}
                onValueChange={(value) => handleConfigChange("pipeline", value)}
              >
                <SelectTrigger id="pipeline">
                  <SelectValue placeholder="Qualquer pipeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer pipeline</SelectItem>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                  <SelectItem value="projects">Projetos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {triggerType === "deal_stage_changed" && (
              <>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="fromStage">De etapa</Label>
                  <Select
                    value={data.triggerConfig?.fromStage || "any"}
                    onValueChange={(value) => handleConfigChange("fromStage", value)}
                  >
                    <SelectTrigger id="fromStage">
                      <SelectValue placeholder="Qualquer etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Qualquer etapa</SelectItem>
                      <SelectItem value="new_lead">Novo Lead</SelectItem>
                      <SelectItem value="qualification">Qualificação</SelectItem>
                      <SelectItem value="presentation">Apresentação</SelectItem>
                      <SelectItem value="proposal">Proposta</SelectItem>
                      <SelectItem value="negotiation">Negociação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="toStage">Para etapa</Label>
                  <Select
                    value={data.triggerConfig?.toStage || "any"}
                    onValueChange={(value) => handleConfigChange("toStage", value)}
                  >
                    <SelectTrigger id="toStage">
                      <SelectValue placeholder="Qualquer etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Qualquer etapa</SelectItem>
                      <SelectItem value="new_lead">Novo Lead</SelectItem>
                      <SelectItem value="qualification">Qualificação</SelectItem>
                      <SelectItem value="presentation">Apresentação</SelectItem>
                      <SelectItem value="proposal">Proposta</SelectItem>
                      <SelectItem value="negotiation">Negociação</SelectItem>
                      <SelectItem value="won">Ganho</SelectItem>
                      <SelectItem value="lost">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </>
        );
        
      case "scheduled":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="frequency">Frequência</Label>
              <Select
                value={data.triggerConfig?.frequency || "daily"}
                onValueChange={(value) => handleConfigChange("frequency", value)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="time">Hora (para agendamentos diários ou superiores)</Label>
              <Input
                id="time"
                type="time"
                value={data.triggerConfig?.time || "09:00"}
                onChange={(e) => handleConfigChange("time", e.target.value)}
              />
            </div>
            
            {data.triggerConfig?.frequency === "weekly" && (
              <div className="space-y-2 mt-4">
                <Label>Dia da semana</Label>
                <RadioGroup 
                  value={data.triggerConfig?.weekDay || "1"} 
                  onValueChange={(value) => handleConfigChange("weekDay", value)}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="monday" />
                      <Label htmlFor="monday">Segunda</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="tuesday" />
                      <Label htmlFor="tuesday">Terça</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="wednesday" />
                      <Label htmlFor="wednesday">Quarta</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="thursday" />
                      <Label htmlFor="thursday">Quinta</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="friday" />
                      <Label htmlFor="friday">Sexta</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}
          </>
        );
        
      case "webhook":
        return (
          <div className="space-y-2 mt-4">
            <Label>URL do Webhook</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
              https://app.seudominio.com/api/webhook/automation/{data.id || 'ID'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Use esta URL para acionar a automação a partir de sistemas externos.
              A automação será executada quando esta URL receber uma requisição POST.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do gatilho</Label>
        <Input 
          id="name" 
          value={data.label || ""}
          onChange={(e) => onChange({...data, label: e.target.value})}
          placeholder="Ex: Quando um novo lead for criado"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="triggerType">Tipo de gatilho</Label>
        <Select
          value={data.triggerType || ""}
          onValueChange={handleTriggerTypeChange}
        >
          <SelectTrigger id="triggerType">
            <SelectValue placeholder="Selecione o gatilho" />
          </SelectTrigger>
          <SelectContent>
            {TRIGGER_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {renderTriggerSpecificFields()}
    </div>
  );
}