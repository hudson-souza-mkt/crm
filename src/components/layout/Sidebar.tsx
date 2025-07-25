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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed?: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pipelines", icon: Columns, label: "Pipelines" },
  { to: "/leads", icon: Users, label: "Leads/Clientes" },
  { to: "/chat", icon: MessageSquare, label: "Atendimentos" },
  { to: "/automations", icon: Bot, label: "Automações" },
  { to: "/goals", icon: Target, label: "Metas" },
];

export function Sidebar({ collapsed, toggleSidebar }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo e botão de toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center">
            <FolderKanban className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">Space Sales</span>
          </div>
        ) : (
          <FolderKanban className="h-6 w-6 text-primary mx-auto" />
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 rounded-sm p-0 ml-auto"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto py-4">
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
                          className={({ isActive }) =>
                            cn(
                              "flex items-center justify-center p-2 rounded-sm transition-colors",
                              isActive 
                                ? "bg-primary/10 text-primary" 
                                : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                            )
                          }
                        >
                          <item.icon className="h-5 w-5" />
                        </NavLink>
                      </li>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="border border-border bg-white">
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
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors",
                        isActive 
                          ? "nav-item-active pl-[11px]" 
                          : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground pl-3"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
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
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-center p-2 rounded-sm transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )
                  }
                >
                  <Settings className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="border border-border bg-white">
                <p className="font-medium text-sm">Configurações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors w-full",
                isActive 
                  ? "nav-item-active pl-[11px]" 
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground pl-3"
              )
            }
          >
            <Settings className="h-5 w-5 mr-3" />
            <span>Configurações</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}