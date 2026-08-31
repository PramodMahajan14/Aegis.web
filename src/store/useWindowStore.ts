import { create } from 'zustand';
import React from 'react';

export interface WindowConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: any; // IconName from Blueprint
  width?: number;
  isOpen: boolean;
}

interface WindowState {
  windows: WindowConfig[];
  openWindow: (config: Omit<WindowConfig, 'id' | 'isOpen'> & { id?: string }) => void;
  closeWindow: (id: string) => void;
  closeAllWindows: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useWindowStore = create<WindowState>((set) => ({
  windows: [],
  openWindow: (config) =>
    set((state) => {
      const id = config.id || generateId();
      // If a window with this ID is already open, replace it or ignore it.
      // Here we'll just replace it to bring it to the top/update it.
      const existingWindows = state.windows.filter((w) => w.id !== id);
      return {
        windows: [...existingWindows, { ...config, id, isOpen: true }],
      };
    }),
  closeWindow: (id) =>
    set((state) => ({
      // We set isOpen to false first so we can animate it out if needed,
      // but standard approach is just to filter it out. Blueprint's <Dialog>
      // handles its own unmount animation if we keep it in the DOM momentarily, 
      // but for simplicity, we'll just toggle isOpen to false and let the Provider clean it up.
      windows: state.windows.map((w) => (w.id === id ? { ...w, isOpen: false } : w)),
    })),
  closeAllWindows: () =>
    set((state) => ({
      windows: state.windows.map((w) => ({ ...w, isOpen: false })),
    })),
}));
