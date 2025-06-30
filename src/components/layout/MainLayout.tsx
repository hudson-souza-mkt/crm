import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!session) {
    return null; // Ou um componente de loading
  }

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