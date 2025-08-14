import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { CalendarIcon, Clock } from "lucide-react";

interface WaitNodeConfigProps {
  data: any;
  onChange: (data: any) => void;
}

export function WaitNodeConfig({ data, onChange }: WaitNodeConfigProps) {
  // Handler para mudança de tipo de espera
  const handleWaitTypeChange = (waitType: string) => {
    onChange({
      ...data,
      waitType,
      // Reset configurações específicas do tipo
      waitConfig: {}
    });
  };
  
  // Handler genérico para configurações
  const handleConfigChange = (key: string, value: any) => {
    onChange({
      ...data,
      waitConfig: {
        ...data.waitConfig,
        [key]: value
      }
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da espera</Label>
        <Input 
          id="name" 
          value={data.label || ""}
          onChange={(e) => onChange({...data, label: e.target.value})}
          placeholder="Ex: Aguardar 2 dias"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Tipo de espera</Label>
        <Tabs 
          value={data.waitType || "duration"} 
          onValueChange={handleWaitTypeChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="duration">
              <Clock className="h-4 w-4 mr-2" />
              Duração
            </TabsTrigger>
            <TabsTrigger value="until">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Até data/hora
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="duration" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duração</Label>
                <Input 
                  id="duration"
                  type="number"
                  min="1"
                  value={data.waitConfig?.duration || "1"}
                  onChange={(e) => handleConfigChange("duration", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select
                  value={data.waitConfig?.unit || "hours"}
                  onValueChange={(value) => handleConfigChange("unit", value)}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutos</SelectItem>
                    <SelectItem value="hours">Horas</SelectItem>
                    <SelectItem value="days">Dias</SelectItem>
                    <SelectItem value="weeks">Semanas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(data.waitConfig?.unit === "days" || data.waitConfig?.unit === "weeks") && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="businessDays"
                    checked={data.waitConfig?.businessDays || false}
                    onCheckedChange={(checked) => handleConfigChange("businessDays", checked)}
                  />
                  <Label htmlFor="businessDays">Considerar apenas dias úteis</Label>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Quando ativado, ignora sábados, domingos e feriados.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="until" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Esperar até</Label>
              <RadioGroup 
                value={data.waitConfig?.untilType || "specific"}
                onValueChange={(value) => handleConfigChange("untilType", value)}
                className="space-y-2"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="specific" id="specific" />
                  <div>
                    <Label htmlFor="specific">Data e hora específicas</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Input 
                        type="date"
                        value={data.waitConfig?.date || ""}
                        onChange={(e) => handleConfigChange("date", e.target.value)}
                        disabled={data.waitConfig?.untilType !== "specific"}
                      />
                      <Input 
                        type="time"
                        value={data.waitConfig?.time || ""}
                        onChange={(e) => handleConfigChange("time", e.target.value)}
                        disabled={data.waitConfig?.untilType !== "specific"}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="dynamic" id="dynamic" />
                  <div className="w-full">
                    <Label htmlFor="dynamic">Data calculada dinamicamente</Label>
                    <div className="mt-2 space-y-2">
                      <Select
                        value={data.waitConfig?.field || ""}
                        onValueChange={(value) => handleConfigChange("field", value)}
                        disabled={data.waitConfig?.untilType !== "dynamic"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um campo de data" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead.created_at">Data de criação do lead</SelectItem>
                          <SelectItem value="deal.created_at">Data de criação do negócio</SelectItem>
                          <SelectItem value="deal.last_activity">Data da última atividade</SelectItem>
                          <SelectItem value="task.due_date">Data de vencimento da tarefa</SelectItem>
                          <SelectItem value="custom.date">Campo de data personalizado</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          value={data.waitConfig?.operation || "add"}
                          onValueChange={(value) => handleConfigChange("operation", value)}
                          disabled={data.waitConfig?.untilType !== "dynamic"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Operação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Adicionar</SelectItem>
                            <SelectItem value="subtract">Subtrair</SelectItem>
                            <SelectItem value="exact">Exatamente</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {data.waitConfig?.operation !== "exact" && (
                          <>
                            <Input 
                              type="number"
                              min="0"
                              value={data.waitConfig?.offset || "1"}
                              onChange={(e) => handleConfigChange("offset", e.target.value)}
                              disabled={data.waitConfig?.untilType !== "dynamic"}
                            />
                            
                            <Select
                              value={data.waitConfig?.offsetUnit || "days"}
                              onValueChange={(value) => handleConfigChange("offsetUnit", value)}
                              disabled={data.waitConfig?.untilType !== "dynamic"}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hours">Horas</SelectItem>
                                <SelectItem value="days">Dias</SelectItem>
                                <SelectItem value="weeks">Semanas</SelectItem>
                                <SelectItem value="months">Meses</SelectItem>
                              </SelectContent>
                            </Select>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="next_time" id="next_time" />
                  <div className="w-full">
                    <Label htmlFor="next_time">Próxima ocorrência</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Select
                        value={data.waitConfig?.timeFrame || ""}
                        onValueChange={(value) => handleConfigChange("timeFrame", value)}
                        disabled={data.waitConfig?.untilType !== "next_time"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Dia</SelectItem>
                          <SelectItem value="week">Semana</SelectItem>
                          <SelectItem value="month">Mês</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input 
                        type="time"
                        value={data.waitConfig?.specificTime || "09:00"}
                        onChange={(e) => handleConfigChange("specificTime", e.target.value)}
                        disabled={data.waitConfig?.untilType !== "next_time"}
                      />
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="space-y-2 mt-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Switch
            id="businessHours"
            checked={data.waitConfig?.businessHours || false}
            onCheckedChange={(checked) => handleConfigChange("businessHours", checked)}
          />
          <Label htmlFor="businessHours">Considerar apenas horário comercial</Label>
        </div>
        <p className="text-xs text-muted-foreground pl-6">
          Quando ativado, a automação só avançará em horário comercial (segunda a sexta, 9h às 18h).
        </p>
      </div>
      
      <div className="space-y-2 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Switch
            id="allowSkip"
            checked={data.allowSkip || false}
            onCheckedChange={(checked) => onChange({...data, allowSkip: checked})}
          />
          <Label htmlFor="allowSkip">Permitir pular espera</Label>
        </div>
        <p className="text-xs text-muted-foreground pl-6">
          Quando ativado, usuários com permissões adequadas podem pular esta espera manualmente.
        </p>
      </div>
    </div>
  );
}