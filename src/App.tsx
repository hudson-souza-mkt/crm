import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AttendanceModule } from './components/attendance/AttendanceModule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AttendanceModule />} />
        {/* Outras rotas aqui */}
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;