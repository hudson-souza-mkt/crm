import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Menu, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="header-modern border-b border-white/20 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-6 md:px-8">
        <div className="flex items-center gap-6">
          {/* Search modernizado */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 z-10" />
              <Input
                type="search"
                placeholder="Buscar leads, contatos, negócios..."
                className={cn(
                  "pl-11 pr-4 py-2 w-80 lg:w-96",
                  "input-modern focus-modern",
                  "bg-white/10 border-white/20 text-white placeholder:text-white/60",
                  "transition-all duration-300"
                )}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="bg-white/20 text-white/80 text-xs px-2 py-1">
                  ⌘K
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Indicador de status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-100 font-medium">Sistema Online</span>
          </div>
          
          {/* Notificações */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "relative h-10 w-10 rounded-xl",
                "glass border border-white/20 hover:bg-white/10",
                "transition-all duration-300 hover:scale-105"
              )}
            >
              <Bell className="h-5 w-5 text-white/90" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </Button>
          </div>
          
          {/* Ações rápidas */}
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl",
              "glass border border-white/20 hover:bg-white/10",
              "transition-all duration-300 hover:scale-105"
            )}
          >
            <Zap className="h-5 w-5 text-white/90" />
          </Button>
          
          {/* Avatar do usuário */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-white">Carlos Silva</span>
              <span className="text-xs text-white/60">Administrador</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <Avatar className="relative h-10 w-10 border-2 border-white/30 hover:border-white/50 transition-all duration-300">
                <AvatarImage src="https://github.com/shadcn.png" alt="Carlos Silva" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  CS
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}