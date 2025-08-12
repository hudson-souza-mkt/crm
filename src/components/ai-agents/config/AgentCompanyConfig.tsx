import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Building, Target, Users, Award } from "lucide-react";
import { useState } from "react";
import type { AIAgent } from "@/types/aiAgent";

interface AgentCompanyConfigProps {
  data: Partial<AIAgent>;
  onChange: (updates: Partial<AIAgent>) => void;
  onSave: () => void;
}

export function AgentCompanyConfig({ data, onChange, onSave }: AgentCompanyConfigProps) {
  const [newValue, setNewValue] = useState("");
  const [newDifferential, setNewDifferential] = useState("");

  const handleAddValue = () => {
    if (newValue.trim()) {
      const currentValues = data.companyInfo?.values || [];
      onChange({
        companyInfo: {
          ...data.companyInfo,
          values: [...currentValues, newValue.trim()]
        }
      });
      setNewValue("");
    }
  };

  const handleRemoveValue = (index: number) => {
    const currentValues = [...(data.companyInfo?.values || [])];
    currentValues.splice(index, 1);
    onChange({
      companyInfo: {
        ...data.companyInfo,
        values: currentValues
      }
    });
  };

  const handleAddDifferential = () => {
    if (newDifferential.trim()) {
      const currentDifferentials = data.companyInfo?.differentials || [];
      onChange({
        companyInfo: {
          ...data.companyInfo,
          differentials: [...currentDifferentials, newDifferential.trim()]
        }
      });
      setNewDifferential("");
    }
  };

  const handleRemoveDifferential = (index: number) => {
    const currentDifferentials = [...(data.companyInfo?.differentials || [])];
    currentDifferentials.splice(index, 1);
    onChange({
      companyInfo: {
        ...data.companyInfo,
        differentials: currentDifferentials
      }
    });
  };

  const updateCompanyInfo = (field: string, value: string) => {
    onChange({
      companyInfo: {
        ...data.companyInfo,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Informações da Empresa</h3>
        <p className="text-sm text-muted-foreground">
          Configure as informações sobre sua empresa que o agente deve conhecer
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Dados fundamentais sobre a empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={data.companyInfo?.name || ""}
                onChange={(e) => updateCompanyInfo("name", e.target.value)}
                placeholder="Ex: Space Sales"
              />
            </div>

            <div>
              <Label htmlFor="companyDescription">Descrição da Empresa</Label>
              <Textarea
                id="companyDescription"
                value={data.companyInfo?.description || ""}
                onChange={(e) => updateCompanyInfo("description", e.target.value)}
                placeholder="Descreva o que sua empresa faz..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="companyMission">Missão</Label>
              <Textarea
                id="companyMission"
                value={data.companyInfo?.mission || ""}
                onChange={(e) => updateCompanyInfo("mission", e.target.value)}
                placeholder="Qual é a missão da sua empresa?"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Valores da Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Valores da Empresa
            </CardTitle>
            <CardDescription>
              Princípios e valores que guiam a empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex: Transparência"
                onKeyPress={(e) => e.key === "Enter" && handleAddValue()}
              />
              <Button onClick={handleAddValue} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.companyInfo?.values && data.companyInfo.values.length > 0 && (
              <div className="space-y-2">
                <Label>Valores:</Label>
                <div className="flex flex-wrap gap-2">
                  {data.companyInfo.values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {value}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveValue(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diferenciais Competitivos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Diferenciais Competitivos
            </CardTitle>
            <CardDescription>
              O que diferencia sua empresa da concorrência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newDifferential}
                onChange={(e) => setNewDifferential(e.target.value)}
                placeholder="Ex: IA mais avançada do mercado"
                onKeyPress={(e) => e.key === "Enter" && handleAddDifferential()}
              />
              <Button onClick={handleAddDifferential} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.companyInfo?.differentials && data.companyInfo.differentials.length > 0 && (
              <div className="space-y-2">
                <Label>Diferenciais:</Label>
                <div className="space-y-2">
                  {data.companyInfo.differentials.map((differential, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                      <span className="flex-1">{differential}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDifferential(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Público-Alvo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Público-Alvo
            </CardTitle>
            <CardDescription>
              Quem são seus clientes ideais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="targetAudience">Descrição do Público-Alvo</Label>
              <Textarea
                id="targetAudience"
                value={data.companyInfo?.targetAudience || ""}
                onChange={(e) => updateCompanyInfo("targetAudience", e.target.value)}
                placeholder="Descreva seu público-alvo: empresas de que tamanho, setor, necessidades..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
            <CardDescription>
              Outras informações relevantes sobre a empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="founded">Ano de Fundação</Label>
                <Input
                  id="founded"
                  placeholder="Ex: 2020"
                />
              </div>
              <div>
                <Label htmlFor="employees">Número de Funcionários</Label>
                <Input
                  id="employees"
                  placeholder="Ex: 50-100"
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  placeholder="Ex: São Paulo, Brasil"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="Ex: www.spacesales.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={onSave}>Salvar Informações</Button>
      </div>
    </div>
  );
}