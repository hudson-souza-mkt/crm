import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnhancedMetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease";
  subtitle?: string;
  trend?: number[];
  color?: string;
}

export function EnhancedMetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType,
  subtitle,
  color = "bg-primary"
}: EnhancedMetricCardProps) {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className={`absolute top-0 left-0 w-full h-1 ${color}`} />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {title}
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {change && (
              <Badge 
                variant={changeType === 'increase' ? 'default' : 'secondary'}
                className={`text-xs ${
                  changeType === 'increase' 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {change}
              </Badge>
            )}
          </div>
          <div className={`p-3 rounded-full ${color.replace('bg-', 'bg-').replace('-500', '-100')} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-').replace('-100', '-600')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}