import { createContext } from 'react';

type UIContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const UIContext = createContext<UIContextType | null>(null);
