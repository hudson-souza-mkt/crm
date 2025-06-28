import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, User, MessageSquare, Calendar, Tag } from "lucide-react";

export interface Lead {
  id: string;
  name: string;
  avatarUrl?: string;
  phone: string;
  salesperson: string;
  tags: string[];
}

interface PipelineCardProps {
  lead: Lead;
}

export function PipelineCard({ lead }: PipelineCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={lead.avatarUrl} />
            <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{lead.name}</p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <Phone className="w-3 h-3" />
              <span>{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <User className="w-3 h-3" />
              <span>{lead.salesperson}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {lead.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Calendar className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Tag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}