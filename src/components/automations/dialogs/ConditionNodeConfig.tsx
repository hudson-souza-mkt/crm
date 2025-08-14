import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";

interface ConditionNodeConfigProps {
  data: any;
  onChange: (data: any) => void;
}

// Operadores de condição
const OPERATORS = [
  { value: "equals", label: "igual a" },
  { value: "not_equals", label: "diferente de" },
  { value: "contains", label: "contém" },
  { value: "not_contains", label: "não contém" },
  { value: "starts_with", label: "começa com" },
  { value: "ends_with", label: "termina com" },
  { value: "greater_than", label: "maior que" },
  { value: "less_than", label: "menor que" },
  { value: "is_empty", label: "está vazio" },
  { value: "is_not_empty", label: "não está vazio" },
  { value: "exists", label: "existe" },
  { value: "not_exists", label: "não existe" },
];

// Tipos de campos
const FIELD_TYPES = [
  { group: "lead", label: "Lead", fields: [
    { value: "lead.name", label: "Nome" },
    { value: "lead.email", label: "Email" },
    { value: "lead.phone", label: "Telefone" },
    { value: "lead.company", label: "Empresa" },
    { value: "lead.source", label: "Origem" },
    { value: "lead.created_at", label: "Data de criação" },
    { value: "lead.tags", label: "Tags" },
  ]},
  { group: "deal", label: "Negócio", fields: [
    { value: "deal.title", label: "Título" },
    { value: "deal.value", label: "Valor" },
    { value: "deal.stage", label: "Etapa" },
    { value: "deal.created_at", label: "Data de criação" },
    { value: "deal.probability", label: "Probabilidade" },
    { value: "deal.tags", label: "Tags" },
  ]},
  { group: "task", label: "Tarefa", fields: [
    { value: "task.title", label: "Título" },
    { value: "task.status", label: "Status" },
    { value: "task.due_date", label: "Data de vencimento" },
    { value: "task.priority", label: "Prioridade" },
  ]},
  { group: "user", label: "Usuário", fields: [
    { value: "user.name", label: "Nome" },
    { value: "user.email", label: "Email" },
    { value: "user.team", label: "Equipe" },
    { value: "user.role", label: "Cargo" },
  ]},
  { group: "custom", label: "Personalizado", fields: [
    { value: "custom.field", label: "Campo personalizado" },
  ]},
];

export function ConditionNodeConfig({ data, onChange }: ConditionNodeConfigProps) {
  // Inicializa as condições se não existirem
  const conditions = data.conditions || [];
  
  // Adicionar nova condição
  const handleAddCondition = () => {
    onChange({
      ...data,
      conditions: [
        ...conditions,
        { field: "", operator: "equals", value: "" }
      ]
    });
  };
  
  // Remover condição
  const handleRemoveCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    onChange({
      ...data,
      conditions: newConditions
    });
  };
  
  // Atualizar condição
  const handleUpdateCondition = (index: number, field: string, value: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    onChange({
      ...data,
      conditions: newConditions
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da condição</Label>
        <Input 
          id="name" 
          value={data.label || ""}
          onChange={(e) => onChange({...data, label: e.target.value})}
          placeholder="Ex: Verificar valor do negócio"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Condições</Label>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={handleAddCondition}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar condição
          </Button>
        </div>
        
        {conditions.length === 0 ? (
          <div className="border rounded-md p-8 text-center text-muted-foreground">
            <p>Nenhuma condição adicionada.</p>
            <p className="text-sm">Clique no botão acima para adicionar uma condição.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conditions.map((condition: any, index: number) => (
              <Card key={index}>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Condição {index + 1}</CardTitle>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleRemoveCondition(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Campo</Label>
                      <Select
                        value={condition.field || ""}
                        onValueChange={(value) => handleUpdateCondition(index, "field", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o campo" />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((group) => (
                            <div key={group.group}>
                              <SelectItem value={`__group_${group.group}`} disabled>
                                {group.label}
                              </SelectItem>
                              {group.fields.map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                              {group !== FIELD_TYPES[FIELD_TYPES.length - 1] && (
                                <Separator className="my-1" />
                              )}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Operador</Label>
                      <Select
                        value={condition.operator || "equals"}
                        onValueChange={(value) => handleUpdateCondition(index, "operator", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o operador" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((operator) => (
                            <SelectItem key={operator.value} value={operator.value}>
                              {operator.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {!["is_empty", "is_not_empty", "exists", "not_exists"].includes(condition.operator) && (
                      <div className="space-y-2">
                        <Label>Valor</Label>
                        <Input 
                          value={condition.value || ""}
                          onChange={(e) => handleUpdateCondition(index, "value", e.target.value)}
                          placeholder="Digite o valor ou use {{variável}}"
                        />
                        <p className="text-xs text-muted-foreground">
                          Você pode usar variáveis como {{lead.email}} ou valores fixos.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {conditions.length > 1 && (
              <div className="space-y-2">
                <Label>Lógica de avaliação</Label>
                <RadioGroup 
                  value={data.logicType || "and"}
                  onValueChange={(value) => onChange({...data, logicType: value})}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="and" id="and" />
                    <Label htmlFor="and">E (todas as condições)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="or" id="or" />
                    <Label htmlFor="or">OU (qualquer condição)</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-2 mt-6">
        <Label>Saídas</Label>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3 bg-green-50">
              <CardTitle className="text-sm text-green-600">Se for verdadeiro</CardTitle>
              <CardDescription className="text-xs text-green-600">
                Quando a condição for atendida
              </CardDescription>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm text-muted-foreground">
                A automação seguirá para o próximo nó conectado na saída de baixo.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-3 bg-red-50">
              <CardTitle className="text-sm text-red-600">Se for falso</CardTitle>
              <CardDescription className="text-xs text-red-600">
                Quando a condição não for atendida
              </CardDescription>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-sm text-muted-foreground">
                A automação seguirá para o próximo nó conectado na saída da direita.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}