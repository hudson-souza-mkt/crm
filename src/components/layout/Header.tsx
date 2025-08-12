import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, HelpCircle, Calendar, Inbox, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="header-corporate py-2 px-3 sm:px-4">
      <div className="flex items-center justify-between h-10 sm:h-12">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Botão de menu para mobile */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-sm md:hidden flex-shrink-0"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Busca */}
          <div className="relative flex items-center flex-1 max-w-xs sm:max-w-sm lg:max-w-md">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-7 sm:pl-9 pr-2 sm:pr-3 py-1 h-8 sm:h-9 text-xs sm:text-sm rounded-sm border-input"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          {/* Ícones de ação - ocultos em mobile muito pequeno */}
          <div className="hidden sm:flex items-center gap-1 lg:gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-sm text-muted-foreground hover:text-foreground">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-sm text-muted-foreground hover:text-foreground">
              <Inbox className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          
          {/* Notificações */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-sm text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <Badge className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 p-0 flex items-center justify-center bg-red-500 text-white text-[8px] sm:text-[10px]">
                3
              </Badge>
            </Button>
          </div>
          
          {/* Help - oculto em mobile pequeno */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-sm text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          {/* Avatar do usuário */}
          <div className="flex items-center pl-1">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" alt="Carlos Silva" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs sm:text-sm">
                CS
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}