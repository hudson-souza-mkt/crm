import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  X,
  Type,
  Hash,
  Mail,
  Phone,
  Calendar,
  ToggleLeft,
  List,
  Edit,
  Copy
} from "lucide-react";
import type { Variable, VariableType } from "@/types/playbook";

interface VariableManagerProps {
  variables: Variable[];
  onChange: (variables: Variable[]) => void;
}

export function VariableManager({ variables, onChange }: VariableManagerProps) {
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Variable>>({
    name: "",
    key: "",
    description: "",
    type: "text",
    required: false,
    defaultValue: ""
  });

  const variableTypes: { value: VariableType; label: string; icon: any; description: string }[] = [
    { value: 'text', label: 'Texto', icon: Type, description: 'Texto livre' },
    { value: 'number', label: 'Número', icon: Hash, description: 'Valores numéricos' },
    { value: 'email', label: 'Email', icon: Mail, description: 'Endereço de email' },
    { value: 'phone', label: 'Telefone', icon: Phone, description: 'Número de telefone' },
    { value: 'date', label: 'Data', icon: Calendar, description: 'Data e hora' },
    { value: 'select', label: 'Seleção', icon: List, description: 'Lista de opções' },
    { value: 'boolean', label: 'Sim/Não', icon: ToggleLeft, description: 'Verdadeiro ou falso' }
  ];

  const handleSaveVariable = () => {
    if (!formData.name || !formData.key) return;

    const newVariable: Variable = {
      id: editingVariable?.id || `var-${Date.now()}`,
      name: formData.name,
      key: formData.key,
      description: formData.description || "",
      type: formData.type || "text",
      required: formData.required || false,
      defaultValue: formData.defaultValue,
      options: formData.options,
      validation: formData.validation
    };

    if (editingVariable) {
      onChange(variables.map(v => v.id === editingVariable.id ? newVariable : v));
    } else {
      onChange([...variables, newVariable]);
    }

    resetForm();
  };

  const handleDeleteVariable = (id: string) => {
    onChange(variables.filter(v => v.id !== id));
  };

  const handleEditVariable = (variable: Variable) => {
    setEditingVariable(variable);
    setFormData(variable);
    setShowForm(true);
  };

  const handleDuplicateVariable = (variable: Variable) => {
    const duplicated = {
      ...variable,
      id: `var-${Date.now()}`,
      name: `${variable.name} (Cópia)`,
      key: `${variable.key}_copy`
    };
    onChange([...variables, duplicated]);
  };

  const resetForm = () => {
    setEditingVariable(null);
    setFormData({
      name: "",
      key: "",
      description: "",
      type: "text",
      required: false,
      defaultValue: ""
    });
    setShowForm(false);
  };

  const generateKey = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const getVariableTypeInfo = (type: VariableType) => {
    return variableTypes.find(vt => vt.value === type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Variáveis Dinâmicas</h3>
          <p className="text-sm text-muted-foreground">
            Configure variáveis para personalizar automaticamente suas mensagens
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Variável
        </Button>
      </div>

      {/* Lista de Variáveis */}
      {variables.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variables.map((variable) => {
            const typeInfo = getVariableTypeInfo(variable.type);
            const Icon = typeInfo?.icon || Type;

            return (
              <Card key={variable.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{variable.name}</CardTitle>
                        {variable.required && (
                          <Badge variant="destructive" className="text-xs">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {`{${variable.key}}`}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {typeInfo?.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditVariable(variable)}
                        className="h-6 w-6"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicateVariable(variable)}
                        className="h-6 w-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVariable(variable.id)}
                        className="h-6 w-6 text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {variable.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {variable.description}
                    </p>
                  )}
                  
                  {variable.defaultValue && (
                    <div className="text-xs">
                      <span className="font-medium">Valor padrão:</span> {variable.defaultValue}
                    </div>
                  )}

                  {variable.options && variable.options.length > 0 && (
                    <div className="text-xs mt-2">
                      <span className="font-medium">Opções:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {variable.options.slice(0, 3).map((option, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                        {variable.options.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{variable.options.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Formulário de Variável */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingVariable ? "Editar Variável" : "Nova Variável"}
            </CardTitle>
            <CardDescription>
              Configure uma variável para personalizar suas mensagens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="varName">Nome da Variável</Label>
                <Input
                  id="varName"
                  value={formData.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name,
                      key: generateKey(name)
                    }));
                  }}
                  placeholder="Ex: Nome do Cliente"
                />
              </div>
              
              <div>
                <Label htmlFor="varKey">Chave da Variável</Label>
                <Input
                  id="varKey"
                  value={formData.key || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="Ex: nome_cliente"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use como: {`{${formData.key || 'chave'}}`}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="varDescription">Descrição (opcional)</Label>
              <Textarea
                id="varDescription"
                value={formData.description || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva quando e como usar esta variável..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="varType">Tipo da Variável</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: VariableType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {variableTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="varDefault">Valor Padrão (opcional)</Label>
                <Input
                  id="varDefault"
                  value={formData.defaultValue || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
                  placeholder="Valor usado quando não informado"
                />
              </div>
            </div>

            {formData.type === 'select' && (
              <div>
                <Label htmlFor="varOptions">Opções (uma por linha)</Label>
                <Textarea
                  id="varOptions"
                  value={formData.options?.join('\n') || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    options: e.target.value.split('\n').filter(opt => opt.trim()) 
                  }))}
                  placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                  rows={4}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="varRequired"
                  checked={formData.required || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
                />
                <Label htmlFor="varRequired">Campo obrigatório</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveVariable}>
                {editingVariable ? "Atualizar" : "Criar"} Variável
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado Vazio */}
      {variables.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-12 text-center">
            <Type className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma variável criada</h3>
            <p className="text-muted-foreground mb-4">
              Crie variáveis para personalizar automaticamente suas mensagens
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Variável
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dicas */}
      {variables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">💡 Dicas de Uso</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Use variáveis em suas mensagens com a sintaxe: <code className="bg-muted px-1 rounded">{`{nome_da_variavel}`}</code></p>
            <p>• Variáveis obrigatórias devem ser preenchidas antes de enviar a mensagem</p>
            <p>• Valores padrão são usados quando a variável não é informada</p>
            <p>• Variáveis de seleção permitem escolher entre opções pré-definidas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}