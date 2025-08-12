import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Pipelines from "@/pages/Pipelines";
import Leads from "@/pages/Leads";
import Chat from "@/pages/Chat";
import Calendar from "@/pages/Calendar";
import AIAgents from "@/pages/AIAgents";
import Automations from "@/pages/Automations";
import Goals from "@/pages/Goals";
import Settings from "@/pages/Settings";
import Billing from "@/pages/Billing";
import Playbook from "@/pages/Playbook";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/pipelines" element={<Layout><Pipelines /></Layout>} />
          <Route path="/leads" element={<Layout><Leads /></Layout>} />
          <Route path="/chat" element={<Layout><Chat /></Layout>} />
          <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
          <Route path="/ai-agents" element={<Layout><AIAgents /></Layout>} />
          <Route path="/automations" element={<Layout><Automations /></Layout>} />
          <Route path="/goals" element={<Layout><Goals /></Layout>} />
          <Route path="/playbook" element={<Layout><Playbook /></Layout>} />
          <Route path="/billing" element={<Layout><Billing /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;