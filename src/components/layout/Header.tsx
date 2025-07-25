import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, HelpCircle, Calendar, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="header-corporate py-2 px-4">
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center gap-4">
          {/* Busca */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-9 pr-3 py-1 h-9 w-64 text-sm rounded-sm border-input"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Ícones de ação */}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-sm text-muted-foreground hover:text-foreground">
            <Calendar className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-sm text-muted-foreground hover:text-foreground">
            <Inbox className="h-5 w-5" />
          </Button>
          
          {/* Notificações */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-sm text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                3
              </Badge>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 rounded-sm text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {/* Avatar do usuário */}
          <div className="flex items-center pl-1">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" alt="Carlos Silva" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                CS
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}