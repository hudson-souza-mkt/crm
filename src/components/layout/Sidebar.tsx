import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Columns,
  Users,
  MessageSquare,
  Settings,
  Rocket,
  Bot,
  Target,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed?: boolean;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", gradient: "from-blue-500 to-blue-600" },
  { to: "/pipelines", icon: Columns, label: "Pipelines", gradient: "from-purple-500 to-purple-600" },
  { to: "/leads", icon: Users, label: "Leads/Clientes", gradient: "from-green-500 to-green-600" },
  { to: "/chat", icon: MessageSquare, label: "Atendimentos", gradient: "from-amber-500 to-amber-600" },
  { to: "/automations", icon: Bot, label: "Automações", gradient: "from-cyan-500 to-cyan-600" },
  { to: "/goals", icon: Target, label: "Metas", gradient: "from-pink-500 to-pink-600" },
];

export const NavContent = ({ collapsed }: SidebarProps) => (
  <div className="flex flex-col h-full">
    <div className={cn(
      "border-b border-white/20 backdrop-blur-sm",
      collapsed ? "p-3" : "p-6"
    )}>
      <div className={cn(
        "flex items-center transition-all duration-300",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-2 rounded-xl">
            <Rocket className="w-6 h-6 text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text" />
          </div>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="text-xl font-bold gradient-text">Space Sales</h1>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <Sparkles className="w-3 h-3" />
              <span>CRM Moderno</span>
            </div>
          </div>
        )}
      </div>
    </div>
    
    <nav className="flex-1 px-3 py-6 space-y-2">
      {navItems.map((item, index) => (
        collapsed ? (
          <TooltipProvider key={item.to}>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center justify-center p-3 rounded-xl transition-all duration-300 hover-lift",
                      "hover:bg-white/10 hover:backdrop-blur-sm",
                      is Active
                        ? "bg-white/20 backdrop-blur-sm shadow-lg"
                        : "hover:bg-white/5"
                    )
                  }
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={cn(
                    "relative p-2 rounded-lg transition-all duration-300",
                    "group-hover:scale-110"
                  )}>
                    <item.icon className="h-5 w-5 text-white/90" />
                  </div>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="glass border border-white/20">
                <p className="font-medium">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover-lift",
                "hover:bg-white/10 hover:backdrop-blur-sm micro-bounce",
                isActive
                  ? "bg-white/20 backdrop-blur-sm shadow-lg text-white"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              )
            }
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={cn(
              "relative p-2 rounded-lg mr-3 transition-all duration-300",
              "group-hover:scale-110"
            )}>
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r rounded-lg opacity-0 transition-opacity duration-300",
                item.gradient,
                "group-hover:opacity-20"
              )} />
              <item.icon className="relative h-5 w-5" />
            </div>
            <span className="relative">{item.label}</span>
          </NavLink>
        )
      ))}
    </nav>
    
    <div className={cn(
      "border-t border-white/20 backdrop-blur-sm", 
      collapsed ? "p-3" : "p-4"
    )}>
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  cn(
                    "group flex items-center justify-center p-3 rounded-xl transition-all duration-300 hover-lift",
                    "hover:bg-white/10 hover:backdrop-blur-sm",
                    isActive
                      ? "bg-white/20 backdrop-blur-sm shadow-lg"
                      : "hover:bg-white/5"
                  )
                }
              >
                <div className="relative p-2 rounded-lg transition-all duration-300 group-hover:scale-110">
                  <Settings className="h-5 w-5 text-white/90" />
                </div>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass border border-white/20">
              <p className="font-medium">Configurações</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover-lift w-full",
              "hover:bg-white/10 hover:backdrop-blur-sm",
              isActive
                ? "bg-white/20 backdrop-blur-sm shadow-lg text-white"
                : "text-white/80 hover:text-white hover:bg-white/5"
            )
          }
        >
          <div className="relative p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
            <Settings className="relative h-5 w-5" />
          </div>
          <span className="relative">Configurações</span>
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