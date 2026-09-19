import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings, RoundConfig } from '../types';

interface SettingsState {
  settings: UserSettings;
  rounds: RoundConfig[];
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateTypingSettings: (newTypingSettings: Partial<UserSettings['typingSettings']>) => void;
  updateDisplaySettings: (newDisplaySettings: Partial<UserSettings['displaySettings']>) => void;
  updateTestSettings: (newTestSettings: Partial<UserSettings['testSettings']>) => void;
  setRounds: (rounds: RoundConfig[]) => void;
  addRound: (round: RoundConfig) => void;
  removeRound: (id: string) => void;
  updateRound: (id: string, updates: Partial<RoundConfig>) => void;
}

const defaultSettings: UserSettings = {
  theme: 'Dark Navy',
  typingSettings: {
    caseSensitivity: true,
    punctuation: true,
    numbers: true,
    backspace: 'Allowed',
    errorBehavior: 'Continue after error',
    errorHighlight: 'Red',
    caret: 'Line',
    smoothCaret: true,
    spaceHandling: 'Normal',
  },
  displaySettings: {
    fontFamily: 'Inter',
    fontSize: 24,
    textWidth: 'max-w-4xl',
    lineHeight: 1.5,
    showWpm: true,
    showAccuracy: true,
    showCpm: true,
    showMistakes: true,
    showTime: true,
  },
  soundSettings: {
    keypress: false,
    error: false,
    countdown: false,
    roundCompletion: false,
    testCompletion: false,
    volume: 50,
  },
  testSettings: {
    mode: 'Round',
    timerStart: 'First character',
    countdown: 0,
    autoNextRound: false,
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      rounds: [
        { id: '1', paragraphId: 'p1', timerSeconds: 60 },
        { id: '2', paragraphId: 'p2', timerSeconds: 60 }
      ],
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      updateTypingSettings: (newTypingSettings) => set((state) => ({ 
        settings: { ...state.settings, typingSettings: { ...state.settings.typingSettings, ...newTypingSettings } } 
      })),
      updateDisplaySettings: (newDisplaySettings) => set((state) => ({
        settings: { ...state.settings, displaySettings: { ...state.settings.displaySettings, ...newDisplaySettings } }
      })),
      updateTestSettings: (newTestSettings) => set((state) => ({
        settings: { ...state.settings, testSettings: { ...state.settings.testSettings, ...newTestSettings } }
      })),
      setRounds: (rounds) => set({ rounds }),
      addRound: (round) => set((state) => ({ rounds: [...state.rounds, round] })),
      removeRound: (id) => set((state) => ({ rounds: state.rounds.filter(r => r.id !== id) })),
      updateRound: (id, updates) => set((state) => ({
        rounds: state.rounds.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
    }),
    {
      name: 'typeflow-settings',
    }
  )
);
