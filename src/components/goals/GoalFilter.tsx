import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export function GoalFilter() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filtros</h3>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search" className="text-xs">Buscar por título</Label>
          <div className="relative mt-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar meta..."
              className="pl-8"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="category" className="text-xs">Categoria</Label>
          <Select>
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="revenue">Receita</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="conversion">Taxa de Conversão</SelectItem>
              <SelectItem value="retention">Retenção</SelectItem>
              <SelectItem value="ticket">Ticket Médio</SelectItem>
              <SelectItem value="deals">Número de Negócios</SelectItem>
              <SelectItem value="custom">Personalizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status" className="text-xs">Status</Label>
          <Select>
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Em andamento</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="overdue">Atrasada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="responsible" className="text-xs">Responsável</Label>
          <Select>
            <SelectTrigger id="responsible" className="mt-1">
              <SelectValue placeholder="Todos os responsáveis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os responsáveis</SelectItem>
              <SelectItem value="team-sales">Equipe de Vendas</SelectItem>
              <SelectItem value="team-marketing">Equipe de Marketing</SelectItem>
              <SelectItem value="director">Diretor Comercial</SelectItem>
              <SelectItem value="ceo">CEO</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-xs">Data de início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left mt-1",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "P", { locale: ptBR }) : "Selecione uma data"}
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
          <Label className="text-xs">Data de término</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left mt-1",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "P", { locale: ptBR }) : "Selecione uma data"}
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
      
      <div className="mt-4 border-t pt-4">
        <Label className="text-xs font-medium">Progresso</Label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="progress-low" />
            <label
              htmlFor="progress-low"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Baixo (&lt;30%)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="progress-medium" />
            <label
              htmlFor="progress-medium"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Médio (30-70%)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="progress-high" />
            <label
              htmlFor="progress-high"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Alto (&gt;70%)
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4 pt-3 border-t">
        <Button>
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}