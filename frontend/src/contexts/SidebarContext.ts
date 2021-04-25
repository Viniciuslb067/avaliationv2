import { createContext } from "react";

interface SidebarContextData {
  isOpen: boolean;
  closeSidebar: (value) => void;
  openSidebar: (value) => void;
}

export const SidebarContext = createContext({} as SidebarContextData);