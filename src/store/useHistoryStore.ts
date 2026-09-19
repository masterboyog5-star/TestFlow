import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TestSession } from '../types';

interface HistoryState {
  sessions: TestSession[];
  addSession: (session: TestSession) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
      clearHistory: () => set({ sessions: [] }),
    }),
    {
      name: 'typeflow-history',
    }
  )
);
