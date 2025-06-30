import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Tag } from "lucide-react";

export function ContactDetails() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://i.pravatar.cc/150?img=1" />
          <AvatarFallback>BA</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="text-xl font-semibold">Bianca Araújo</p>
          <p className="text-muted-foreground">Lead Qualificado</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>bianca.araujo@email.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>(11) 98765-4321</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><Tag className="w-3 h-3 mr-2" /> VIP</Button>
          <Button variant="outline" size="sm"><Tag className="w-3 h-3 mr-2" /> Follow-up</Button>
        </CardContent>
      </Card>
    </div>
  );
}