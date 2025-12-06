import Layout from '@/components/Layout';
import ProblemDetails from '@/pages/ProblemDetails';
import Problems from '@/pages/Problems';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Problems />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
      </Route>
    </Routes>
  );
}
