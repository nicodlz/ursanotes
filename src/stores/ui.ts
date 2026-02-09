import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    }),
    { name: "ui-store" }
  )
);
