import { useState } from 'react';
import { UIContext } from './UIContext';

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <UIContext.Provider
      value={{ darkMode, toggleDarkMode, sidebarOpen, toggleSidebar }}
    >
      {children}
    </UIContext.Provider>
  );
}
