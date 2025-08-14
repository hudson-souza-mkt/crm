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
  gradient = "from-blue-500 to-blue-600"
}: EnhancedMetricCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Borda superior colorida */}
      <div className={cn(
        "h-1 w-full bg-gradient-to-r",
        gradient
      )} />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
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
                  "text-xs font-medium",
                  changeType === 'increase' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                )}
              >
                {change}
              </Badge>
            )}
          </div>
          
          {/* Ícone */}
          <div className={cn(
            "p-3 rounded-xl",
            gradient === 'from-green-500 to-green-600' ? 'bg-green-100' : 
            gradient === 'from-blue-500 to-blue-600' ? 'bg-blue-100' : 
            gradient === 'from-purple-500 to-purple-600' ? 'bg-purple-100' : 
            gradient === 'from-orange-500 to-orange-600' ? 'bg-orange-100' : 'bg-gray-100'
          )}>
            <Icon className={cn(
              "h-5 w-5",
              gradient === 'from-green-500 to-green-600' ? 'text-green-600' : 
              gradient === 'from-blue-500 to-blue-600' ? 'text-blue-600' : 
              gradient === 'from-purple-500 to-purple-600' ? 'text-purple-600' : 
              gradient === 'from-orange-500 to-orange-600' ? 'text-orange-600' : 'text-gray-600'
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}