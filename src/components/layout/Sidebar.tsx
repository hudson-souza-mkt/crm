import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Columns,
  Users,
  MessageSquare,
  Settings,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed?: boolean;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pipelines", icon: Columns, label: "Pipelines" },
  { to: "/leads", icon: Users, label: "Leads/Clientes" },
  { to: "/chat", icon: MessageSquare, label: "Atendimentos" },
];

export const NavContent = ({ collapsed }: SidebarProps) => (
  <div className="flex flex-col h-full">
    <div className={cn(
      "border-b border-border",
      collapsed ? "p-2" : "p-4"
    )}>
      <h1 className={cn(
        "text-2xl font-bold text-primary flex items-center",
        collapsed ? "justify-center" : "gap-2"
      )}>
        <Rocket className="w-7 h-7" />
        {!collapsed && <span>Space Sales</span>}
      </h1>
    </div>
    <nav className="flex-1 px-2 py-4 space-y-1">
      {navItems.map((item) => (
        collapsed ? (
          <TooltipProvider key={item.to}>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-center p-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        )
      ))}
    </nav>
    <div className={cn(
      "border-t border-border", 
      collapsed ? "p-2" : "p-2"
    )}>
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-center p-2 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <Settings className="h-5 w-5" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">
              Configurações
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors w-full justify-start",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <Settings className="mr-3 h-5 w-5" />
          Configurações
        </NavLink>
      )}
    </div>
  </div>
);

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <NavContent collapsed={collapsed} />
    </div>
  );
}