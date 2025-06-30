import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LucideIcon, Settings } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AutomationCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  onToggle: (id: string, active: boolean) => void;
}

export function AutomationCard({ id, icon: Icon, title, description, isActive, onToggle }: AutomationCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="pt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id={`automation-${id}`}
            checked={isActive}
            onCheckedChange={(checked) => onToggle(id, checked)}
          />
          <Label htmlFor={`automation-${id}`} className="cursor-pointer">
            {isActive ? "Ativa" : "Inativa"}
          </Label>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Configurar</span>
        </Button>
      </CardFooter>
    </Card>
  );
}