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
    <div className="flex min-h-screen w-full relative">
      {/* Background com gradiente animado */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] -z-10" />
      
      <div 
        className={cn(
          "flex flex-col sidebar-modern relative transition-all duration-500 ease-in-out",
          sidebarCollapsed ? "w-[70px]" : "w-72"
        )}
      >
        <Sidebar collapsed={sidebarCollapsed} />
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "absolute -right-4 top-20 z-50 h-8 w-8 rounded-full",
            "glass border border-white/30 hover:bg-white/20",
            "transition-all duration-300 hover:scale-110 hover:shadow-lg"
          )}
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? 
            <ChevronRight className="h-4 w-4" /> : 
            <ChevronLeft className="h-4 w-4" />
          }
        </Button>
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 lg:p-10 animate-fade-in-up">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}