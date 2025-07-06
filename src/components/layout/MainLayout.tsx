import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div 
        className={cn(
          "flex flex-col border-r border-border bg-card relative transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[60px]" : "w-64"
        )}
      >
        <Sidebar collapsed={sidebarCollapsed} />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -right-5 top-[70px] z-50 h-10 w-10 rounded-full border shadow-sm bg-background"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? 
            <ChevronRight className="h-4 w-4" /> : 
            <ChevronLeft className="h-4 w-4" />
          }
        </Button>
      </div>
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}