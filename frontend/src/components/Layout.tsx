import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUI } from '../hooks/useUI';
import { Outlet, useMatch } from 'react-router-dom';

export default function Layout() {
  const { darkMode, sidebarOpen, toggleSidebar } = useUI();

  const isProblemPage = useMatch("/problems/:id");

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen w-full bg-background text-foreground relative">
        <Navbar />

        {/* Sidebar Drawer */}
        <Sidebar />

        {/* Mobile Dark Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-20"
            onClick={toggleSidebar}
          />
        )}

        <main className={isProblemPage ? "w-full h-[calc(100vh-3.5rem)] overflow-hidden" : "px-4 md:px-6 py-6 max-w-6xl mx-auto w-full"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
