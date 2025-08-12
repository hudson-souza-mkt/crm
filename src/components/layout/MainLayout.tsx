import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false); // Em mobile, sempre expandida quando aberta
        setSidebarOpen(false); // Fechada por padrão em mobile
      } else {
        setSidebarOpen(true); // Aberta por padrão em desktop
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-secondary/30">
      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "sidebar-corporate flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden z-50",
          // Desktop
          "md:relative md:h-screen",
          !isMobile && (sidebarCollapsed ? "w-[70px]" : "w-64"),
          // Mobile
          "fixed h-full md:translate-x-0",
          isMobile && (sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full")
        )}
      >
        <Sidebar 
          collapsed={!isMobile && sidebarCollapsed} 
          toggleSidebar={toggleSidebar}
          onItemClick={closeSidebar}
        />
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}