import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EnhancedMetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease";
  subtitle?: string;
  trend?: number[];
  color?: string;
  gradient?: string;
}

export function EnhancedMetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType,
  subtitle,
  color = "bg-primary",
  gradient = "from-blue-500 to-blue-600"
}: EnhancedMetricCardProps) {
  return (
    <Card className="modern-card group overflow-hidden border-0 hover-lift">
      {/* Gradiente de fundo */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300",
        gradient.replace("from-", "from-").replace("to-", "to-")
      )} />
      
      {/* Borda superior colorida */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        gradient
      )} />
      
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {title}
            </p>
            <div className="space-y-2">
              <p className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {change && (
              <Badge 
                variant="outline"
                className={cn(
                  "text-xs font-medium border-0",
                  changeType === 'increase' 
                    ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                )}
              >
                {change}
              </Badge>
            )}
          </div>
          
          {/* Ícone com efeito glassmorphism */}
          <div className="relative">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300",
              gradient
            )} />
            <div className={cn(
              "relative p-4 rounded-2xl glass border border-white/20",
              "group-hover:scale-110 transition-all duration-300"
            )}>
              <Icon className={cn(
                "h-6 w-6 text-transparent bg-gradient-to-r bg-clip-text",
                gradient.replace("from-", "from-").replace("to-", "to-")
              )} />
            </div>
          </div>
        </div>
        
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-pulse" />
      </CardContent>
    </Card>
  );
}