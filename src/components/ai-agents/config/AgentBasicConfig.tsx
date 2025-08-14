import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, BrainCircuit } from "lucide-react";
import { useState } from "react";
import type { AIAgent, AgentType } from "@/types/aiAgent";

interface AgentBasicConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentBasicConfig({ data, onChange, onSave }: AgentBasicConfigProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !data.tags?.includes(newTag.trim())) {
      onChange({
        tags: [...(data.tags || []), newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({
      tags: data.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Configurações Básicas</h3>
        <p className="text-sm text-muted-foreground">
          Configure as informações fundamentais do seu agente de IA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações principais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Principais</CardTitle>
            <CardDescription>
              Nome, descrição e tipo do agente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Agente *</Label>
              <Input
                id="name"
                value={data.name || ""}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Ex: Sofia - Atendimento"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={data.description || ""}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Descreva o propósito e função deste agente..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo de Agente *</Label>
              <Select
                value={data.type}
                onValueChange={(value: AgentType) => onChange({ type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atendimento">🎧 Atendimento</SelectItem>
                  <SelectItem value="qualificacao">🎯 Qualificação</SelectItem>
                  <SelectItem value="vendas">💰 Vendas</SelectItem>
                  <SelectItem value="followup">📞 Follow-up</SelectItem>
                  <SelectItem value="suporte">🛠️ Suporte</SelectItem>
                  <SelectItem value="consultor">🧠 Consultor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="objective">Objetivo Principal</Label>
              <Textarea
                id="objective"
                value={data.objective || ""}
                onChange={(e) => onChange({ objective: e.target.value })}
                placeholder="Qual é o objetivo principal deste agente?"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personalidade e tom */}
        <Card>
          <CardHeader>
            <CardTitle>Personalidade e Tom</CardTitle>
            <CardDescription>
              Configure como o agente se comporta e se comunica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="personality">Personalidade</Label>
              <Textarea
                id="personality"
                value={data.personality || ""}
                onChange={(e) => onChange({ personality: e.target.value })}
                placeholder="Descreva a personalidade do agente (ex: amigável, profissional, consultivo...)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tone">Tom de Comunicação</Label>
              <Select
                value={data.tone}
                onValueChange={(value) => onChange({ tone: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="amigavel">Amigável</SelectItem>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="consultivo">Consultivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={data.language}
                onValueChange={(value) => onChange({ language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Adicione tags para organizar e categorizar seus agentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Digite uma tag..."
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button onClick={handleAddTag} variant="outline">
                Adicionar
              </Button>
            </div>
            
            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Configurações</Button>
      </div>
    </div>
  );
}