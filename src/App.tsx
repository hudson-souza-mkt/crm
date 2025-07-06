import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Pipelines from "./pages/Pipelines";
import Chat from "./pages/Chat";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import Automations from "./pages/Automations";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { supabase } from "./integrations/supabase/client";
import { SessionContextProvider } from "@supabase/auth-ui-react";

const queryClient = new QueryClient();

const App = () => (
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pipelines" element={<Pipelines />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SessionContextProvider>
);

export default App;