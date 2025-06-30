import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function LeadFilters() {
  const [name, setName] = useState("");
  const [funnel, setFunnel] = useState("");
  const [stage, setStage] = useState("");
  const [tag, setTag] = useState("");
  
  const handleReset = () => {
    setName("");
    setFunnel("");
    setStage("");
    setTag("");
  };
  
  return (
    <div className="bg-card p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium mb-4">Filtrar Leads</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome ou Telefone</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Buscar por nome ou telefone"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="funnel">Funil</Label>
          <Select value={funnel} onValueChange={setFunnel}>
            <SelectTrigger id="funnel">
              <SelectValue placeholder="Todos os funis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aquisicao">Aquisição e Qualificação</SelectItem>
              <SelectItem value="vendas">Funil de Vendas</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stage">Etapa</Label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger id="stage">
              <SelectValue placeholder="Todas as etapas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="novo">Novo Lead</SelectItem>
              <SelectItem value="qualificacao">Qualificação</SelectItem>
              <SelectItem value="conversando">Conversando</SelectItem>
              <SelectItem value="proposta">Proposta</SelectItem>
              <SelectItem value="fechado">Fechado</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tag">Tag</Label>
          <Select value={tag} onValueChange={setTag}>
            <SelectTrigger id="tag">
              <SelectValue placeholder="Todas as tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="potencial">Potencial</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="consultoria">Consultoria</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="alto-valor">Alto valor</SelectItem>
              <SelectItem value="medio-porte">Médio porte</SelectItem>
              <SelectItem value="fidelizado">Fidelizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={handleReset} className="mr-2">
          Limpar Filtros
        </Button>
        <Button>
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}