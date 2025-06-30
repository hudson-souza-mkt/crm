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

export function PipelineFilters() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [minValue, setMinValue] = useState<string>("");
  const [maxValue, setMaxValue] = useState<string>("");
  
  const handleReset = () => {
    // Reset all filters
    setStartDate(undefined);
    setEndDate(undefined);
    setMinValue("");
    setMaxValue("");
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium mb-4">Filtros</h3>
      
      <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        <FilterSection title="Tags">
          <div className="space-y-2">
            {["Potencial", "Urgente", "Alto valor", "Desconto aplicado", "VIP"].map((tag) => (
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
              <Label htmlFor="tipo" className="text-xs">Tipo de negócio</Label>
              <Select>
                <SelectTrigger id="tipo" className="h-8 text-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo cliente</SelectItem>
                  <SelectItem value="renovacao">Renovação</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="adicional">Venda adicional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prioridade" className="text-xs">Prioridade</Label>
              <Select>
                <SelectTrigger id="prioridade" className="h-8 text-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterSection>
        
        <FilterSection title="Listas">
          <div className="space-y-2">
            {["Black Friday", "Promoção de Verão", "Clientes Inativos"].map((lista) => (
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
            {["Chat", "Indicação", "Site", "Ligação"].map((origem) => (
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
              <Label htmlFor="desconto" className="text-xs">Desconto aplicado</Label>
              <Select>
                <SelectTrigger id="desconto" className="h-8 text-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem">Sem desconto</SelectItem>
                  <SelectItem value="ate10">Até 10%</SelectItem>
                  <SelectItem value="ate20">Até 20%</SelectItem>
                  <SelectItem value="mais20">Mais de 20%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="metodo" className="text-xs">Método de pagamento</Label>
              <Select>
                <SelectTrigger id="metodo" className="h-8 text-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cartao">Cartão de crédito</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
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
            <div className="flex items-center space-x-2">
              <Checkbox id="has-previous-purchase" />
              <Label htmlFor="has-previous-purchase" className="text-sm font-normal cursor-pointer">
                Cliente já realizou compra anterior
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="first-purchase" />
              <Label htmlFor="first-purchase" className="text-sm font-normal cursor-pointer">
                Primeira compra
              </Label>
            </div>
          </div>
        </FilterSection>
        
        <FilterSection title="Valor do negócio">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-value" className="text-xs">Valor mínimo</Label>
                <Input 
                  id="min-value" 
                  type="number" 
                  className="h-8 text-xs" 
                  placeholder="R$ 0,00"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max-value" className="text-xs">Valor máximo</Label>
                <Input 
                  id="max-value" 
                  type="number" 
                  className="h-8 text-xs" 
                  placeholder="R$ 10.000,00"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
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