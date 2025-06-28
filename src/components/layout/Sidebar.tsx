import { NavLink } from "react-router-dom";
import { Home, GanttChartSquare, MessageSquare, Settings, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/pipelines", icon: GanttChartSquare, label: "Pipelines" },
    { to: "/chat", icon: MessageSquare, label: "Atendimentos" },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-dark-background text-white fixed h-full">
      <div className="flex items-center justify-center h-20 border-b border-dark-surface">
        <Rocket className="h-8 w-8 text-accent-red" />
        <h1 className="ml-2 text-2xl font-bold">Space Sales</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-accent-red text-white"
                  : "hover:bg-dark-surface"
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-dark-surface">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="w-full justify-start hover:bg-dark-surface">
              <Settings className="h-5 w-5 mr-3" />
              <span>Configurações</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Configurações</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;