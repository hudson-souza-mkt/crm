import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Pipelines from "@/pages/Pipelines";
import Leads from "@/pages/Leads";
import Chat from "@/pages/Chat";
import Automations from "@/pages/Automations";
import Goals from "@/pages/Goals";
import Calendar from "@/pages/Calendar";
import Settings from "@/pages/Settings";
import Index from "@/pages/Index";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pipelines" element={<Pipelines />} />
          <Route path="leads" element={<Leads />} />
          <Route path="chat" element={<Chat />} />
          <Route path="automations" element={<Automations />} />
          <Route path="goals" element={<Goals />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="agenda" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;