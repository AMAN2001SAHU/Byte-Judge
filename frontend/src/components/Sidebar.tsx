import { useUI } from '../hooks/useUI';
import { ArrowLeft } from 'lucide-react';

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUI();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-secondary border-r p-4
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}
    >
      {/* Close button */}
      <button
        className="mb-4 hover:bg-accent p-2 rounded"
        onClick={toggleSidebar}
      >
        <ArrowLeft size={20} />
      </button>

      <h1 className="font-bold text-xl mb-4">Byte Judge</h1>

      <nav className="flex flex-col space-y-2">
        <button className="text-left hover:bg-accent p-2 rounded">
          Problems
        </button>
        <button className="text-left hover:bg-accent p-2 rounded">
          Submissions
        </button>
        <button className="text-left hover:bg-accent p-2 rounded">
          Leaderboard
        </button>
      </nav>
    </aside>
  );
}
