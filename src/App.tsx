import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Cadets from '@/pages/Cadets';
import CadetProfile from '@/pages/CadetProfile';
import Attendance from '@/pages/Attendance';
import FitnessTests from '@/pages/FitnessTests';
import TrainingPlan from '@/pages/TrainingPlan';
import WeekendMissions from '@/pages/WeekendMissions';
import Scoreboard from '@/pages/Scoreboard';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cadets" element={<Cadets />} />
          <Route path="/cadets/:id" element={<CadetProfile />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/fitness-tests" element={<FitnessTests />} />
          <Route path="/training-plan" element={<TrainingPlan />} />
          <Route path="/weekend-missions" element={<WeekendMissions />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
