import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Columns,
  MessageSquare,
  Menu,
  Rocket,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pipelines", icon: Columns, label: "Pipelines" },
  { to: "/chat", icon: MessageSquare, label: "Atendimentos" },
];

const NavContent = () => (
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
       <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <Settings className="mr-3 h-5 w-5" />
          Configurações
        </Button>
    </div>
  </div>
);

export function Sidebar() {
  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:border-r md:border-border bg-card">
        <NavContent />
      </aside>
    </>
  );
}