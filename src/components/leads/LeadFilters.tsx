import { useState } from "react";
import { FilterSection } from "@/components/shared/FilterSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function LeadFilters() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [lastPurchaseStart, setLastPurchaseStart] = useState<Date | undefined>(undefined);
  const [lastPurchaseEnd, setLastPurchaseEnd] = useState<Date | undefined>(undefined);
  
  const handleReset = () => {
    // Reset all filters
    setStartDate(undefined);
    setEndDate(undefined);
    setLastPurchaseStart(undefined);
    setLastPurchaseEnd(undefined);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium mb-4">Filtros</h3>
      
      <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        <FilterSection title="Tags">
          <div className="space-y-2">
            {["Potencial", "Fidelizado", "Alto valor", "Médio porte", "Consultoria"].map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox id={`tag-${tag}`} />
                <Label htmlFor={`tag-${tag}`} className="text-sm font-normal cursor-pointer">
                  {tag}
                </Label>
              </div>
            ))}
            <Button variant="link" className="p-0 h-auto text-xs">+ Adicionar mais tags</Button>
          </div>
        </FilterSection>
        
        <FilterSection title="Endereço">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="estado" className="text-xs">Estado</Label>
                <Select>
                  <SelectTrigger id="estado" className="h-8 text-xs">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp">São Paulo</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro</SelectItem>
                    <SelectItem value="mg">Minas Gerais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cidade" className="text-xs">Cidade</Label>
                <Select>
                  <SelectTrigger id="cidade" className="h-8 text-xs">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saopaulo">São Paulo</SelectItem>
                    <SelectItem value="campinas">Campinas</SelectItem>
                    <SelectItem value="santos">Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </FilterSection>
        
        <FilterSection title="Negócios">
          <div className="space-y-2">
            <div>
              <Label htmlFor="funil" className="text-xs">Funil</Label>
              <Select>
                <SelectTrigger id="funil" className="h-8 text-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aquisicao">Aquisição e Qualificação</SelectItem>
                  <SelectItem value="vendas">Funil de Vendas</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estagio" className="text-xs">Estágio</Label>
              <Select>
                <SelectTrigger id="estagio" className="h-8 text-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo Lead</SelectItem>
                  <SelectItem value="qualificado">Qualificado</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterSection>
        
        <FilterSection title="Listas">
          <div className="space-y-2">
            {["Newsletter", "Webinar Jul/23", "Campanha Promocional"].map((lista) => (
              <div key={lista} className="flex items-center space-x-2">
                <Checkbox id={`lista-${lista}`} />
                <Label htmlFor={`lista-${lista}`} className="text-sm font-normal cursor-pointer">
                  {lista}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
        
        <FilterSection title="Produtos">
          <div className="space-y-2">
            {["Software CRM", "Software ERP", "Consultoria", "Suporte Premium"].map((produto) => (
              <div key={produto} className="flex items-center space-x-2">
                <Checkbox id={`produto-${produto}`} />
                <Label htmlFor={`produto-${produto}`} className="text-sm font-normal cursor-pointer">
                  {produto}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
        
        <FilterSection title="Atendente">
          <div className="space-y-2">
            {["Ana Silva", "Carlos Oliveira", "Mariana Santos", "Pedro Costa"].map((atendente) => (
              <div key={atendente} className="flex items-center space-x-2">
                <Checkbox id={`atendente-${atendente}`} />
                <Label htmlFor={`atendente-${atendente}`} className="text-sm font-normal cursor-pointer">
                  {atendente}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
        
        <FilterSection title="Origem">
          <div className="space-y-2">
            {["Chat", "Manual", "Importação", "Sistema Externo"].map((origem) => (
              <div key={origem} className="flex items-center space-x-2">
                <Checkbox id={`origem-${origem}`} />
                <Label htmlFor={`origem-${origem}`} className="text-sm font-normal cursor-pointer">
                  {origem}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
        
        <FilterSection title="Campos adicionais">
          <div className="space-y-2">
            <div>
              <Label htmlFor="segmento" className="text-xs">Segmento</Label>
              <Select>
                <SelectTrigger id="segmento" className="h-8 text-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="b2c">B2C</SelectItem>
                  <SelectItem value="governo">Governo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tamanho" className="text-xs">Tamanho da empresa</Label>
              <Select>
                <SelectTrigger id="tamanho" className="h-8 text-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequena">Pequena (1-50)</SelectItem>
                  <SelectItem value="media">Média (51-200)</SelectItem>
                  <SelectItem value="grande">Grande (201+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterSection>
        
        <FilterSection title="Data de criação">
          <div className="space-y-2">
            <div>
              <Label className="text-xs">De</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left h-8 text-xs font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs">Até</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left h-8 text-xs font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </FilterSection>
        
        <FilterSection title="Última compra">
          <div className="space-y-2">
            <div>
              <Label className="text-xs">De</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left h-8 text-xs font-normal",
                      !lastPurchaseStart && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {lastPurchaseStart ? format(lastPurchaseStart, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={lastPurchaseStart}
                    onSelect={setLastPurchaseStart}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs">Até</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left h-8 text-xs font-normal",
                      !lastPurchaseEnd && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {lastPurchaseEnd ? format(lastPurchaseEnd, "dd/MM/yyyy") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={lastPurchaseEnd}
                    onSelect={setLastPurchaseEnd}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </FilterSection>
        
        <FilterSection title="Quantidade de negócios">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-deals" className="text-xs">Mínimo</Label>
                <Input 
                  id="min-deals" 
                  type="number" 
                  className="h-8 text-xs" 
                  placeholder="0" 
                />
              </div>
              <div>
                <Label htmlFor="max-deals" className="text-xs">Máximo</Label>
                <Input 
                  id="max-deals" 
                  type="number" 
                  className="h-8 text-xs" 
                  placeholder="100" 
                />
              </div>
            </div>
          </div>
        </FilterSection>
      </div>
      
      <div className="flex justify-end mt-4 pt-3 border-t">
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