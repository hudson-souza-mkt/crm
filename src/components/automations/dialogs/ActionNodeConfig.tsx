import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";

interface ActionNodeConfigProps {
  data: any;
  onChange: (data: any) => void;
}

// Lista de categorias de ações
const ACTION_CATEGORIES = [
  { value: "lead", label: "Lead" },
  { value: "deal", label: "Negócio" },
  { value: "task", label: "Tarefa" },
  { value: "notification", label: "Notificação" },
  { value: "integration", label: "Integração" },
  { value: "custom", label: "Personalizado" },
];

// Ações por categoria
const ACTIONS_BY_CATEGORY: Record<string, Array<{ value: string, label: string }>> = {
  lead: [
    { value: "lead.create", label: "Criar lead" },
    { value: "lead.update", label: "Atualizar lead" },
    { value: "lead.add_tag", label: "Adicionar tag ao lead" },
    { value: "lead.remove_tag", label: "Remover tag do lead" },
    { value: "lead.assign", label: "Atribuir lead" },
  ],
  deal: [
    { value: "deal.create", label: "Criar negócio" },
    { value: "deal.update", label: "Atualizar negócio" },
    { value: "deal.change_stage", label: "Mudar etapa do negócio" },
    { value: "deal.change_value", label: "Atualizar valor do negócio" },
    { value: "deal.set_win_probability", label: "Definir probabilidade de ganho" },
  ],
  task: [
    { value: "task.create", label: "Criar tarefa" },
    { value: "task.complete", label: "Concluir tarefa" },
    { value: "task.assign", label: "Atribuir tarefa" },
    { value: "task.set_due_date", label: "Definir data de vencimento" },
  ],
  notification: [
    { value: "notification.email", label: "Enviar e-mail interno" },
    { value: "notification.slack", label: "Enviar mensagem no Slack" },
    { value: "notification.mobile", label: "Enviar notificação push" },
    { value: "notification.webhook", label: "Disparar webhook" },
  ],
  integration: [
    { value: "integration.zapier", label: "Acionar Zapier" },
    { value: "integration.make", label: "Acionar Make (Integromat)" },
    { value: "integration.webhook", label: "Enviar dados para webhook" },
    { value: "integration.api", label: "Chamar API externa" },
  ],
  custom: [
    { value: "custom.javascript", label: "Executar código JavaScript" },
    { value: "custom.api", label: "Consulta de API personalizada" },
  ],
};

export function ActionNodeConfig({ data, onChange }: ActionNodeConfigProps) {
  // Handler para mudança de categoria
  const handleCategoryChange = (category: string) => {
    onChange({
      ...data,
      actionCategory: category,
      // Limpar ação se mudar de categoria
      actionType: "",
      actionConfig: {},
    });
  };
  
  // Handler para mudança de ação
  const handleActionTypeChange = (actionType: string) => {
    onChange({
      ...data,
      actionType,
      // Limpar configuração específica da ação
      actionConfig: {},
    });
  };
  
  // Handler genérico para atualização de configuração da ação
  const handleConfigChange = (key: string, value: any) => {
    onChange({
      ...data,
      actionConfig: {
        ...data.actionConfig,
        [key]: value
      }
    });
  };
  
  // Adicionando tags
  const handleAddTag = () => {
    const newTag = data.actionConfig?.newTag?.trim() || "";
    if (!newTag) return;
    
    const currentTags = data.actionConfig?.tags || [];
    if (!currentTags.includes(newTag)) {
      handleConfigChange("tags", [...currentTags, newTag]);
    }
    handleConfigChange("newTag", "");
  };
  
  // Remover tag
  const handleRemoveTag = (tag: string) => {
    const currentTags = data.actionConfig?.tags || [];
    handleConfigChange("tags", currentTags.filter((t: string) => t !== tag));
  };
  
  // Renderizar campos específicos com base no tipo de ação selecionado
  const renderActionSpecificFields = () => {
    const actionType = data.actionType || "";
    
    switch (actionType) {
      case "lead.create":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="name">Nome do Lead</Label>
              <Input 
                id="name"
                placeholder="Ex: {'{{'} trigger.form.name {'}}'}  ou João Silva"
                value={data.actionConfig?.name || ""}
                onChange={(e) => handleConfigChange("name", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Use {'{{'} trigger.variable {'}}'}  para valores dinâmicos do gatilho.
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                placeholder="Ex: {'{{'} trigger.form.email {'}}'} "
                value={data.actionConfig?.email || ""}
                onChange={(e) => handleConfigChange("email", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone"
                placeholder="Ex: {'{{'} trigger.form.phone {'}}'} "
                value={data.actionConfig?.phone || ""}
                onChange={(e) => handleConfigChange("phone", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="assign">Atribuir para</Label>
              <Select
                value={data.actionConfig?.assignTo || ""}
                onValueChange={(value) => handleConfigChange("assignTo", value)}
              >
                <SelectTrigger id="assign">
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-atribuir (round-robin)</SelectItem>
                  <SelectItem value="current">Usuário atual</SelectItem>
                  <SelectItem value="1">Amanda Silva</SelectItem>
                  <SelectItem value="2">Bruno Ferreira</SelectItem>
                  <SelectItem value="3">Carlos Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
        
      case "lead.add_tag":
      case "lead.remove_tag":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label>Tags</Label>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Nova tag"
                  value={data.actionConfig?.newTag || ""}
                  onChange={(e) => handleConfigChange("newTag", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {(data.actionConfig?.tags || []).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)} 
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {!(data.actionConfig?.tags || []).length && (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma tag adicionada ainda.
                  </p>
                )}
              </div>
            </div>
          </>
        );
        
      case "deal.create":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="title">Título do Negócio</Label>
              <Input 
                id="title"
                placeholder="Ex: {'{{'} trigger.lead.name {'}}'}  - {'{{'} trigger.lead.company {'}}'} "
                value={data.actionConfig?.title || ""}
                onChange={(e) => handleConfigChange("title", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="pipeline">Pipeline</Label>
              <Select
                value={data.actionConfig?.pipeline || "sales"}
                onValueChange={(value) => handleConfigChange("pipeline", value)}
              >
                <SelectTrigger id="pipeline">
                  <SelectValue placeholder="Selecione o pipeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                  <SelectItem value="projects">Projetos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="stage">Etapa inicial</Label>
              <Select
                value={data.actionConfig?.stage || "new_lead"}
                onValueChange={(value) => handleConfigChange("stage", value)}
              >
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Selecione a etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_lead">Novo Lead</SelectItem>
                  <SelectItem value="qualification">Qualificação</SelectItem>
                  <SelectItem value="presentation">Apresentação</SelectItem>
                  <SelectItem value="proposal">Proposta</SelectItem>
                  <SelectItem value="negotiation">Negociação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input 
                id="value"
                type="number"
                min="1"
                placeholder="Ex: 1000"
                value={data.actionConfig?.value || ""}
                onChange={(e) => handleConfigChange("value", e.target.value)}
              />
            </div>
          </>
        );
        
      case "deal.change_stage":
        return (
          <div className="space-y-2 mt-4">
            <Label htmlFor="stage">Nova etapa</Label>
            <Select
              value={data.actionConfig?.stage || ""}
              onValueChange={(value) => handleConfigChange("stage", value)}
            >
              <SelectTrigger id="stage">
                <SelectValue placeholder="Selecione a etapa" />
              </SelectTrigger>
              <SelectContent>
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
        );
        
      case "task.create":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="title">Título da Tarefa</Label>
              <Input 
                id="title"
                placeholder="Ex: Entrar em contato com {'{{'} trigger.lead.name {'}}'}  "
                value={data.actionConfig?.title || ""}
                onChange={(e) => handleConfigChange("title", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description"
                placeholder="Detalhes da tarefa..."
                value={data.actionConfig?.description || ""}
                onChange={(e) => handleConfigChange("description", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="dueDate">Data de vencimento</Label>
              <div className="flex space-x-2">
                <Select
                  value={data.actionConfig?.dueDateType || "specific"}
                  onValueChange={(value) => handleConfigChange("dueDateType", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Quando vence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="specific">Data específica</SelectItem>
                    <SelectItem value="1day">Em 1 dia</SelectItem>
                    <SelectItem value="3days">Em 3 dias</SelectItem>
                    <SelectItem value="1week">Em 1 semana</SelectItem>
                    <SelectItem value="2weeks">Em 2 semanas</SelectItem>
                    <SelectItem value="1month">Em 1 mês</SelectItem>
                  </SelectContent>
                </Select>
                
                {data.actionConfig?.dueDateType === "specific" && (
                  <Input 
                    type="date"
                    value={data.actionConfig?.dueDate || ""}
                    onChange={(e) => handleConfigChange("dueDate", e.target.value)}
                  />
                )}
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="assignTo">Atribuir para</Label>
              <Select
                value={data.actionConfig?.assignTo || ""}
                onValueChange={(value) => handleConfigChange("assignTo", value)}
              >
                <SelectTrigger id="assignTo">
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Responsável pelo lead/negócio</SelectItem>
                  <SelectItem value="current">Usuário atual</SelectItem>
                  <SelectItem value="1">Amanda Silva</SelectItem>
                  <SelectItem value="2">Bruno Ferreira</SelectItem>
                  <SelectItem value="3">Carlos Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="highPriority"
                checked={data.actionConfig?.highPriority || false}
                onCheckedChange={(checked) => handleConfigChange("highPriority", checked)}
              />
              <Label htmlFor="highPriority">Marcar como alta prioridade</Label>
            </div>
          </>
        );
        
      case "notification.email":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="recipients">Destinatários</Label>
              <Input 
                id="recipients"
                placeholder="Ex: equipe@empresa.com, {'{{'} lead.owner.email {'}}'}  "
                value={data.actionConfig?.recipients || ""}
                onChange={(e) => handleConfigChange("recipients", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separe múltiplos emails com vírgula.
              </p>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="subject">Assunto</Label>
              <Input 
                id="subject"
                placeholder="Ex: Novo lead: {'{{'} lead.name {'}}'}  "
                value={data.actionConfig?.subject || ""}
                onChange={(e) => handleConfigChange("subject", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="body">Conteúdo do Email</Label>
              <Textarea 
                id="body"
                placeholder="Digite o conteúdo do email..."
                value={data.actionConfig?.body || ""}
                onChange={(e) => handleConfigChange("body", e.target.value)}
                rows={5}
              />
            </div>
          </>
        );
        
      case "custom.javascript":
        return (
          <div className="space-y-2 mt-4">
            <Label htmlFor="code">Código JavaScript</Label>
            <Textarea 
              id="code"
              className="font-mono text-sm"
              placeholder="// Escreva seu código aqui
function run(data) {
  // 'data' contém informações do gatilho e etapas anteriores
  console.log('Processando dados:', data);
  
  // Retorne um objeto com os resultados
  return {
    success: true,
    message: 'Código executado com sucesso',
    // Outros valores que você queira passar para as próximas etapas
  };
}"
              value={data.actionConfig?.code || ""}
              onChange={(e) => handleConfigChange("code", e.target.value)}
              rows={10}
            />
            <p className="text-xs text-muted-foreground">
              Atenção: O código JavaScript é executado em um ambiente seguro com limitações.
              Limite de execução: 10 segundos.
            </p>
          </div>
        );
        
      case "integration.webhook":
      case "integration.api":
        return (
          <>
            <div className="space-y-2 mt-4">
              <Label htmlFor="url">URL da API</Label>
              <Input 
                id="url"
                placeholder="https://api.exemplo.com/endpoint"
                value={data.actionConfig?.url || ""}
                onChange={(e) => handleConfigChange("url", e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="method">Método</Label>
              <Select
                value={data.actionConfig?.method || "POST"}
                onValueChange={(value) => handleConfigChange("method", value)}
              >
                <SelectTrigger id="method">
                  <SelectValue placeholder="Selecione o método HTTP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="payload">Payload (JSON)</Label>
              <Textarea 
                id="payload"
                className="font-mono text-sm"
                placeholder='{
  "lead": "{{trigger.lead}}",
  "event": "novo_lead",
  "timestamp": "{{now}}"
}'
                value={data.actionConfig?.payload || ""}
                onChange={(e) => handleConfigChange("payload", e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="space-y-2 mt-4">
              <Label>Headers</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Nome do header"
                    value={data.actionConfig?.headerName || ""}
                    onChange={(e) => handleConfigChange("headerName", e.target.value)}
                  />
                  <Input 
                    placeholder="Valor"
                    value={data.actionConfig?.headerValue || ""}
                    onChange={(e) => handleConfigChange("headerValue", e.target.value)}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (!data.actionConfig?.headerName) return;
                      
                      const headers = data.actionConfig?.headers || {};
                      handleConfigChange("headers", {
                        ...headers,
                        [data.actionConfig.headerName]: data.actionConfig.headerValue
                      });
                      
                      handleConfigChange("headerName", "");
                      handleConfigChange("headerValue", "");
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-1">
                  {Object.entries(data.actionConfig?.headers || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                      <div>
                        <span className="font-semibold">{key}:</span> {value as string}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const headers = {...data.actionConfig?.headers};
                          delete headers[key];
                          handleConfigChange("headers", headers);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
        
      default:
        return (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Selecione uma ação para configurar.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da ação</Label>
        <Input 
          id="name" 
          value={data.label || ""}
          onChange={(e) => onChange({...data, label: e.target.value})}
          placeholder="Ex: Criar novo lead"
        />
      </div>
      
      <Tabs value={data.actionCategory || 'lead'} onValueChange={handleCategoryChange}>
        <TabsList className="grid grid-cols-6">
          {ACTION_CATEGORIES.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {ACTION_CATEGORIES.map((category) => (
          <TabsContent key={category.value} value={category.value} className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`action-${category.value}`}>Ação</Label>
                <Select
                  value={data.actionType || ""}
                  onValueChange={handleActionTypeChange}
                >
                  <SelectTrigger id={`action-${category.value}`}>
                    <SelectValue placeholder="Selecione uma ação" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIONS_BY_CATEGORY[category.value].map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        {action.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {renderActionSpecificFields()}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="continueOnError"
            checked={data.continueOnError || false}
            onCheckedChange={(checked) => onChange({...data, continueOnError: checked})}
          />
          <Label htmlFor="continueOnError">Continuar fluxo mesmo se a ação falhar</Label>
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Se ativado, a automação continuará mesmo que esta ação falhe.
          Caso contrário, o fluxo será interrompido se esta ação falhar.
        </p>
      </div>
    </div>
  );
}