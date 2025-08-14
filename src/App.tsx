import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from './components/layout/MainLayout';
import { AttendanceModule } from './components/attendance/AttendanceModule';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Rota principal para o módulo de atendimento */}
          <Route path="/" element={<AttendanceModule />} />
          
          {/* Rotas específicas para cada seção */}
          <Route path="/dashboard" element={<div className="p-6">Dashboard em construção</div>} />
          <Route path="/pipelines" element={<div className="p-6">Pipelines em construção</div>} />
          <Route path="/leads" element={<div className="p-6">Leads/Clientes em construção</div>} />
          <Route path="/chat" element={<AttendanceModule />} />
          <Route path="/calendar" element={<div className="p-6">Agenda em construção</div>} />
          <Route path="/ai-agents" element={<div className="p-6">Agentes de IA em construção</div>} />
          <Route path="/playbook" element={<div className="p-6">Playbook de Vendas em construção</div>} />
          <Route path="/automations" element={<div className="p-6">Automações em construção</div>} />
          <Route path="/goals" element={<div className="p-6">Metas em construção</div>} />
          <Route path="/billing" element={<div className="p-6">Billing & Créditos em construção</div>} />
          <Route path="/settings" element={<div className="p-6">Configurações em construção</div>} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;