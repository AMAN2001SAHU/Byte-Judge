import { Menu, Moon, Sun } from 'lucide-react';
import { useUI } from '../hooks/useUI';

export default function Navbar() {
  const { toggleSidebar, toggleDarkMode, darkMode } = useUI();
  return (
    <nav className="h-14 border-b px-4 flex items-center justify-between sticky top-0 bg-background z-30">
      {/* Centered Navbar Content */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 flex items-center justify-between h-full">
        {/* MOBILE BURGER ICON */}
        <button
          className="hover:bg-secondary p-2 rounded md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <button className="hover:text-primary">Problems</button>
          <button className="hover:text-primary">Submissions</button>
          <button className="hover:text-primary">Leaderboard</button>
        </div>

        {/* Toggle Dark Mode */}
        <button
          className="hover:bg-secondary p-2 rounded"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
