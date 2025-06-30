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

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pipelines", icon: Columns, label: "Pipelines" },
  { to: "/leads", icon: Users, label: "Leads/Clientes" },
  { to: "/chat", icon: MessageSquare, label: "Atendimentos" },
];

export const NavContent = () => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-border">
      <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
        <Rocket className="w-7 h-7" />
        Space Sales
      </h1>
    </div>
    <nav className="flex-1 px-2 py-4 space-y-1">
      {navItems.map((item) => (
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
      ))}
    </nav>
    <div className="mt-auto p-2 border-t border-border">
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
    </div>
  </div>
);

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:border-r md:border-border bg-card">
      <NavContent />
    </aside>
  );
}