import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Columns,
  Users,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Target,
  FolderKanban,
  Calendar,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed?: boolean;
  toggleSidebar: () => void;
  onItemClick?: () => void;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pipelines", icon: Columns, label: "Pipelines" },
  { to: "/leads", icon: Users, label: "Leads/Clientes" },
  { to: "/chat", icon: MessageSquare, label: "Atendimentos" },
  { to: "/calendar", icon: Calendar, label: "Agenda" },
  { to: "/ai-agents", icon: Bot, label: "Agentes de IA" },
  { to: "/automations", icon: Zap, label: "Automações" },
  { to: "/goals", icon: Target, label: "Metas" },
];

export function Sidebar({ collapsed, toggleSidebar, onItemClick }: SidebarProps) {
  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo e botão de toggle */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center min-w-0">
            <FolderKanban className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2 flex-shrink-0" />
            <span className="font-bold text-base sm:text-lg truncate">Space Sales</span>
          </div>
        ) : (
          <FolderKanban className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto" />
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 sm:h-7 sm:w-7 rounded-sm p-0 ml-auto flex-shrink-0"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />}
        </Button>
      </div>
      
      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto py-3 sm:py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            if (collapsed) {
              return (
                <TooltipProvider key={item.to}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <li>
                        <NavLink
                          to={item.to}
                          onClick={handleItemClick}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center justify-center p-2 sm:p-2.5 rounded-sm transition-colors touch-manipulation",
                              isActive 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                            )
                          }
                        >
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </NavLink>
                      </li>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border border-border bg-white hidden md:block">
                      <p className="font-medium text-sm">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            } else {
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={handleItemClick}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2.5 sm:py-2 text-sm font-medium rounded-sm transition-colors touch-manipulation",
                        isActive 
                          ? "nav-item-active pl-[11px]" 
                          : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground pl-3"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
              );
            }
          })}
        </ul>
      </nav>
      
      {/* Configurações */}
      <div className="border-t border-border p-2">
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/settings"
                  onClick={handleItemClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-center p-2 sm:p-2.5 rounded-sm transition-colors touch-manipulation",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )
                  }
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="border border-border bg-white hidden md:block">
                <p className="font-medium text-sm">Configurações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <NavLink
            to="/settings"
            onClick={handleItemClick}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 sm:py-2 text-sm font-medium rounded-sm transition-colors w-full touch-manipulation",
                isActive 
                  ? "nav-item-active pl-[11px]" 
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground pl-3"
              )
            }
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
            <span className="truncate">Configurações</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}