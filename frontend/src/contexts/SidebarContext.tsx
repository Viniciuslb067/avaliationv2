import { createContext } from "react";

interface SidebarContextData {
  isOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const SidebarContext = createContext({} as SidebarContextData);