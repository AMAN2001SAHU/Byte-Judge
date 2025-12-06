// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; 
import { UIProvider } from './context/UIProvider.tsx';
import AppRoutes from './routes/AppRoutes.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UIProvider>
      <AppRoutes />
    </UIProvider>
  </BrowserRouter>
);
