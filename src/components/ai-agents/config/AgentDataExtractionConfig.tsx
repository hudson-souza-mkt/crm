import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BrainCircuit, Database, Plus, Trash2, Wand2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { AIAgent } from "@/types/aiAgent";

interface AgentDataExtractionConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

// Definir tipos para o sistema de extração de dados
export interface DataExtractionField {
  id: string;
  name: string;
  key: string;
  description: string;
  required: boolean;
  extractionPatterns: string[];
  validationRule?: string;
  defaultPrompt?: string;
  destination: {
    field: string;
    entityType: 'lead' | 'deal' | 'contact' | 'company';
  };
}

export function AgentDataExtractionConfig({ data, onChange, onSave }: AgentDataExtractionConfigProps) {
  // Inicializa a configuração de extração de dados se não existir
  const extractionConfig = data.dataExtractionConfig || {
    enabled: false,
    autoUpdate: true,
    confirmBeforeUpdate: true,
    requestMissingFields: true,
    fields: []
  };

  // Estado para o novo campo sendo adicionado
  const [newField, setNewField] = useState<Partial<DataExtractionField>>({
    name: '',
    key: '',
    description: '',
    required: false,
    extractionPatterns: [],
    destination: {
      field: '',
      entityType: 'lead'
    }
  });

  // Estado para controlar a string de padrão sendo editada
  const [newPattern, setNewPattern] = useState('');

  // Atualizar configuração geral
  const updateConfig = (field: string, value: any) => {
    const updatedConfig = {
      ...extractionConfig,
      [field]: value
    };
    
    onChange({ dataExtractionConfig: updatedConfig });
  };

  // Adicionar novo campo de extração
  const addField = () => {
    if (!newField.name || !newField.key || !newField.destination?.field) return;
    
    const field: DataExtractionField = {
      id: `field-${Date.now()}`,
      name: newField.name,
      key: newField.key,
      description: newField.description || '',
      required: newField.required || false,
      extractionPatterns: newField.extractionPatterns || [],
      validationRule: newField.validationRule,
      defaultPrompt: newField.defaultPrompt,
      destination: {
        field: newField.destination.field,
        entityType: newField.destination.entityType || 'lead'
      }
    };
    
    const updatedConfig = {
      ...extractionConfig,
      fields: [...extractionConfig.fields, field]
    };
    
    onChange({ dataExtractionConfig: updatedConfig });
    
    // Resetar formulário
    setNewField({
      name: '',
      key: '',
      description: '',
      required: false,
      extractionPatterns: [],
      destination: {
        field: '',
        entityType: 'lead'
      }
    });
    setNewPattern('');
  };

  // Remover campo
  const removeField = (id: string) => {
    const updatedConfig = {
      ...extractionConfig,
      fields: extractionConfig.fields.filter(field => field.id !== id)
    };
    
    onChange({ dataExtractionConfig: updatedConfig });
  };

  // Adicionar padrão de extração ao campo em edição
  const addPattern = () => {
    if (!newPattern.trim()) return;
    
    setNewField({
      ...newField,
      extractionPatterns: [...(newField.extractionPatterns || []), newPattern.trim()]
    });
    
    setNewPattern('');
  };

  // Remover padrão de extração
  const removePattern = (index: number) => {
    const patterns = [...(newField.extractionPatterns || [])];
    patterns.splice(index, 1);
    
    setNewField({
      ...newField,
      extractionPatterns: patterns
    });
  };

  // Gerar campos comuns automaticamente
  const generateCommonFields = () => {
    const commonFields: DataExtractionField[] = [
      {
        id: `field-${Date.now()}-name`,
        name: 'Nome',
        key: 'nome',
        description: 'Nome completo do lead',
        required: true,
        extractionPatterns: [
          'Meu nome é {valor}',
          'Me chamo {valor}',
          'Sou {valor}',
          '{valor} é meu nome'
        ],
        destination: {
          field: 'name',
          entityType: 'lead'
        }
      },
      {
        id: `field-${Date.now()}-email`,
        name: 'Email',
        key: 'email',
        description: 'Endereço de email do lead',
        required: true,
        extractionPatterns: [
          'Meu email é {valor}',
          'Email: {valor}',
          '{valor} (email)',
          'Pode me enviar para {valor}'
        ],
        validationRule: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
        destination: {
          field: 'email',
          entityType: 'lead'
        }
      },
      {
        id: `field-${Date.now()}-phone`,
        name: 'Telefone',
        key: 'telefone',
        description: 'Número de telefone do lead',
        required: true,
        extractionPatterns: [
          'Meu telefone é {valor}',
          'Meu número é {valor}',
          'Telefone: {valor}',
          'Pode me ligar no {valor}'
        ],
        destination: {
          field: 'phone',
          entityType: 'lead'
        }
      },
      {
        id: `field-${Date.now()}-company`,
        name: 'Empresa',
        key: 'empresa',
        description: 'Nome da empresa do lead',
        required: false,
        extractionPatterns: [
          'Trabalho na {valor}',
          'Sou da empresa {valor}',
          'Empresa: {valor}',
          'Represento a {valor}'
        ],
        destination: {
          field: 'company',
          entityType: 'lead'
        }
      },
      {
        id: `field-${Date.now()}-product`,
        name: 'Produto de Interesse',
        key: 'produto_interesse',
        description: 'Produto ou serviço que o lead está interessado',
        required: false,
        extractionPatterns: [
          'Estou interessado em {valor}',
          'Quero saber mais sobre {valor}',
          'Gostaria de conhecer o {valor}',
          'O produto {valor} me interessa'
        ],
        destination: {
          field: 'tags',
          entityType: 'lead'
        }
      }
    ];
    
    const updatedConfig = {
      ...extractionConfig,
      fields: [...extractionConfig.fields, ...commonFields],
      enabled: true
    };
    
    onChange({ dataExtractionConfig: updatedConfig });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Extração Automática de Dados</h3>
        <p className="text-sm text-muted-foreground">
          Configure como o agente identifica e preenche informações durante a conversa
        </p>
      </div>

      {/* Configurações gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            Extração Inteligente de Dados
          </CardTitle>
          <CardDescription>
            Permita que o agente extraia informações automaticamente da conversa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableExtraction">Ativar Extração de Dados</Label>
              <p className="text-sm text-muted-foreground">
                O agente identificará informações importantes como nome, email, telefone, etc.
              </p>
            </div>
            <Switch
              id="enableExtraction"
              checked={extractionConfig.enabled}
              onCheckedChange={(checked) => updateConfig('enabled', checked)}
            />
          </div>

          {extractionConfig.enabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoUpdate">Atualizar Automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Atualizar os dados do lead automaticamente quando informações forem identificadas
                  </p>
                </div>
                <Switch
                  id="autoUpdate"
                  checked={extractionConfig.autoUpdate}
                  onCheckedChange={(checked) => updateConfig('autoUpdate', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="confirmBeforeUpdate">Confirmar Antes de Atualizar</Label>
                  <p className="text-sm text-muted-foreground">
                    O agente confirmará com o usuário antes de salvar as informações
                  </p>
                </div>
                <Switch
                  id="confirmBeforeUpdate"
                  checked={extractionConfig.confirmBeforeUpdate}
                  onCheckedChange={(checked) => updateConfig('confirmBeforeUpdate', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requestMissingFields">Solicitar Campos Obrigatórios</Label>
                  <p className="text-sm text-muted-foreground">
                    O agente solicitará informações obrigatórias que não foram fornecidas
                  </p>
                </div>
                <Switch
                  id="requestMissingFields"
                  checked={extractionConfig.requestMissingFields}
                  onCheckedChange={(checked) => updateConfig('requestMissingFields', checked)}
                />
              </div>
              
              {/* Botão de geração automática */}
              {extractionConfig.fields.length === 0 && (
                <div className="border border-dashed rounded-md p-4 mt-4">
                  <div className="text-center">
                    <Database className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium mb-1">Nenhum campo configurado</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure os campos que o agente deve extrair durante a conversa.
                    </p>
                    <Button onClick={generateCommonFields} className="gap-2">
                      <Wand2 className="h-4 w-4" />
                      Gerar campos comuns automaticamente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Lista de campos configurados */}
      {extractionConfig.enabled && extractionConfig.fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campos Configurados</CardTitle>
            <CardDescription>
              Campos que serão extraídos automaticamente durante a conversa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Variável</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Obrigatório</TableHead>
                  <TableHead>Padrões</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extractionConfig.fields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {'{'}
                        {field.key}
                        {'}'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center">
                        <Badge variant="secondary" className="mr-1">
                          {field.destination.entityType}
                        </Badge>
                        {field.destination.field}
                      </span>
                    </TableCell>
                    <TableCell>
                      {field.required ? (
                        <Badge className="bg-green-500">Sim</Badge>
                      ) : (
                        <Badge variant="outline">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {field.extractionPatterns.length} padrões
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeField(field.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Formulário para adicionar novos campos */}
      {extractionConfig.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Campo
            </CardTitle>
            <CardDescription>
              Configure um novo campo para ser extraído durante a conversa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fieldName">Nome do Campo</Label>
                <Input
                  id="fieldName"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  placeholder="Ex: Nome do Cliente"
                />
              </div>
              <div>
                <Label htmlFor="fieldKey">
                  Variável 
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 ml-1 inline text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Essa é a variável que você poderá usar em mensagens como {'{nome}'} ou {'{email}'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="fieldKey"
                  value={newField.key}
                  onChange={(e) => setNewField({ ...newField, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="Ex: nome_cliente"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="fieldDescription">Descrição</Label>
              <Input
                id="fieldDescription"
                value={newField.description || ''}
                onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                placeholder="Descreva o que este campo representa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="destinationEntity">Entidade de Destino</Label>
                <Select
                  value={newField.destination?.entityType || 'lead'}
                  onValueChange={(value) => setNewField({
                    ...newField,
                    destination: {
                      ...newField.destination,
                      entityType: value as 'lead' | 'deal' | 'contact' | 'company'
                    }
                  })}
                >
                  <SelectTrigger id="destinationEntity">
                    <SelectValue placeholder="Selecione a entidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="deal">Negócio</SelectItem>
                    <SelectItem value="contact">Contato</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="destinationField">Campo de Destino</Label>
                <Input
                  id="destinationField"
                  value={newField.destination?.field || ''}
                  onChange={(e) => setNewField({
                    ...newField,
                    destination: {
                      ...newField.destination,
                      field: e.target.value
                    }
                  })}
                  placeholder="Ex: name, email, phone, etc."
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requiredField"
                checked={newField.required || false}
                onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
              />
              <Label htmlFor="requiredField">Campo Obrigatório</Label>
            </div>

            <div>
              <Label>Padrões de Extração</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Configure frases que o agente deve reconhecer. Use {'{valor}'} para indicar onde está a informação.
              </p>
              
              <div className="flex gap-2 mb-2">
                <Input
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  placeholder="Ex: Meu nome é {valor}"
                  className="flex-1"
                />
                <Button onClick={addPattern} variant="outline">
                  Adicionar
                </Button>
              </div>
              
              {(newField.extractionPatterns || []).length > 0 && (
                <div className="border rounded-md p-2 space-y-1">
                  {(newField.extractionPatterns || []).map((pattern, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-1 hover:bg-muted rounded">
                      <span className="font-mono">{pattern}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removePattern(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="validationRule">Regra de Validação (opcional)</Label>
              <Input
                id="validationRule"
                value={newField.validationRule || ''}
                onChange={(e) => setNewField({ ...newField, validationRule: e.target.value })}
                placeholder="Expressão regular para validar o valor extraído"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use expressões regulares para validação. Ex: email: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
              </p>
            </div>

            <div>
              <Label htmlFor="defaultPrompt">Prompt para Solicitar (opcional)</Label>
              <Textarea
                id="defaultPrompt"
                value={newField.defaultPrompt || ''}
                onChange={(e) => setNewField({ ...newField, defaultPrompt: e.target.value })}
                placeholder="Texto que o agente usará para solicitar esta informação"
                rows={2}
              />
            </div>

            <Button onClick={addField} disabled={!newField.name || !newField.key || !newField.destination?.field}>
              Adicionar Campo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Configurações</Button>
      </div>
    </div>
  );
}