import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Flag, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  avatarUrl?: string;
  phone: string;
  salesperson: string;
  tags: string[];
  value: number;
  date: string;
  priority?: "red" | "green";
  activities: boolean;
}

interface PipelineCardProps {
  lead: Lead;
}

export function PipelineCard({ lead }: PipelineCardProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-border">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={lead.avatarUrl} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {lead.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">{lead.name}</span>
                {lead.priority && (
                  <span className="ml-1">
                    {lead.priority === 'red' ? (
                      <Flag className="h-3 w-3 text-red-500 fill-red-500" />
                    ) : (
                      <Flag className="h-3 w-3 text-green-500 fill-green-500" />
                    )}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{lead.company}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="w-4 h-4 flex items-center justify-center mr-1">H</span>
            <span>{lead.salesperson}</span>
          </div>
          {lead.value > 0 && (
            <div className="flex items-center text-xs">
              <span className="w-4 h-4 flex items-center justify-center mr-1">R$</span>
              <span>{formatCurrency(lead.value)}</span>
            </div>
          )}
          {lead.value === 0 && (
            <div className="flex items-center text-xs">
              <span className="w-4 h-4 flex items-center justify-center mr-1">R$</span>
              <span>{formatCurrency(0)}</span>
            </div>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{lead.date}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            <span>Sem atividades</span>
            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}