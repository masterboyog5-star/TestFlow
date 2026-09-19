import { create } from 'zustand';
import { useSettingsStore } from './useSettingsStore';
import { useParagraphStore } from './useParagraphStore';
import { useHistoryStore } from './useHistoryStore';
import type { RoundConfig, RoundResult, TestSession } from '../types';

export type CharState = 'untyped' | 'correct' | 'incorrect' | 'corrected';

interface TypingState {
  // Session / Multi-round state
  isSessionActive: boolean;
  currentRoundIndex: number;
  roundsCount: number;
  sessionRounds: RoundConfig[];
  roundResults: RoundResult[];
  
  // Current Round State
  paragraphText: string;
  charStates: CharState[];
  currentIndex: number;
  
  // Stats
  startTime: number | null;
  timeLeft: number;
  totalTime: number; // The initial timer value
  
  mistakes: number;
  correctCharacters: number;
  incorrectCharacters: number;
  
  wpm: number;
  accuracy: number;
  cpm: number;

  status: 'idle' | 'typing' | 'round_complete' | 'session_complete';

  // Actions
  startSession: (rounds: RoundConfig[]) => void;
  startNextRound: () => void;
  typeChar: (char: string) => void;
  backspace: () => void;
  tickTimer: () => void;
  completeRound: () => void;
  resetRound: () => void;
  endSession: () => void;
}

const calculateStats = (
  startTime: number | null, 
  correctCharacters: number, 
  totalTypedCount: number, 
  mistakes: number
) => {
  if (!startTime) return { wpm: 0, cpm: 0, accuracy: 100 };
  
  const elapsedMs = Date.now() - startTime;
  const elapsedMinutes = elapsedMs / 60000;
  
  if (elapsedMinutes <= 0) return { wpm: 0, cpm: 0, accuracy: 100 };

  const cpm = Math.round(correctCharacters / elapsedMinutes);
  const wpm = Math.round((correctCharacters / 5) / elapsedMinutes);
  const accuracy = totalTypedCount === 0 ? 100 : Math.round(((totalTypedCount - mistakes) / totalTypedCount) * 100);

  return { wpm, cpm, accuracy: Math.max(0, accuracy) };
};

export const useTypingStore = create<TypingState>((set, get) => ({
  isSessionActive: false,
  currentRoundIndex: 0,
  roundsCount: 0,
  sessionRounds: [],
  roundResults: [],
  
  paragraphText: '',
  charStates: [],
  currentIndex: 0,
  
  startTime: null,
  timeLeft: 0,
  totalTime: 0,
  
  mistakes: 0,
  correctCharacters: 0,
  incorrectCharacters: 0,
  
  wpm: 0,
  accuracy: 100,
  cpm: 0,
  
  status: 'idle',
  
  startSession: (rounds) => {
    if (rounds.length === 0) return;
    set({
      isSessionActive: true,
      sessionRounds: rounds,
      roundsCount: rounds.length,
      currentRoundIndex: 0,
      roundResults: [],
    });
    get().startNextRound();
  },
  
  startNextRound: () => {
    const { sessionRounds, currentRoundIndex } = get();
    const round = sessionRounds[currentRoundIndex];
    if (!round) {
      get().endSession();
      return;
    }
    
    let text = '';
    if (round.paragraphId === 'custom' && round.customText) {
      text = round.customText;
    } else {
      const paragraph = useParagraphStore.getState().getParagraphById(round.paragraphId);
      text = paragraph ? paragraph.text : 'Error loading paragraph.';
    }
    
    set({
      paragraphText: text,
      charStates: new Array(text.length).fill('untyped'),
      currentIndex: 0,
      startTime: null,
      timeLeft: round.timerSeconds,
      totalTime: round.timerSeconds,
      mistakes: 0,
      correctCharacters: 0,
      incorrectCharacters: 0,
      wpm: 0,
      accuracy: 100,
      cpm: 0,
      status: 'idle'
    });
  },
  
  typeChar: (char: string) => {
    const state = get();
    if (state.status === 'round_complete' || state.status === 'session_complete') return;
    
    const settings = useSettingsStore.getState().settings.typingSettings;
    const { paragraphText, currentIndex, charStates, startTime } = state;
    
    if (currentIndex >= paragraphText.length) return;
    
    let isCorrect = false;
    let expectedChar = paragraphText[currentIndex];
    
    if (!settings.caseSensitivity) {
      isCorrect = char.toLowerCase() === expectedChar.toLowerCase();
    } else {
      isCorrect = char === expectedChar;
    }
    
    // Timer starts on first character typed
    const isFirstChar = startTime === null;
    const newStartTime = isFirstChar ? Date.now() : startTime;
    const newStatus = isFirstChar ? 'typing' : state.status;
    
    const newCharStates = [...charStates];
    let newMistakes = state.mistakes;
    let newCorrect = state.correctCharacters;
    let newIncorrect = state.incorrectCharacters;
    
    if (isCorrect) {
      newCharStates[currentIndex] = newCharStates[currentIndex] === 'incorrect' ? 'corrected' : 'correct';
      newCorrect += 1;
    } else {
      newCharStates[currentIndex] = 'incorrect';
      newMistakes += 1;
      newIncorrect += 1;
    }
    
    // Handle Require Correction mode
    if (!isCorrect && settings.errorBehavior === 'Require correction') {
      set({
        startTime: newStartTime,
        status: newStatus,
        charStates: newCharStates,
        mistakes: newMistakes,
        incorrectCharacters: newIncorrect,
        ...calculateStats(newStartTime, newCorrect, newCorrect + newIncorrect, newMistakes)
      });
      return;
    }
    
    const nextIndex = currentIndex + 1;
    const isFinished = nextIndex >= paragraphText.length;
    
    set({
      startTime: newStartTime,
      status: isFinished ? 'round_complete' : newStatus,
      charStates: newCharStates,
      currentIndex: nextIndex,
      mistakes: newMistakes,
      correctCharacters: newCorrect,
      incorrectCharacters: newIncorrect,
      ...calculateStats(newStartTime, newCorrect, newCorrect + newIncorrect, newMistakes)
    });
    
    if (isFinished) {
      get().completeRound();
    }
  },
  
  backspace: () => {
    const state = get();
    if (state.status === 'round_complete' || state.status === 'session_complete') return;
    if (state.currentIndex === 0) return;
    
    const settings = useSettingsStore.getState().settings.typingSettings;
    if (settings.backspace === 'Disabled') return;
    
    const prevIndex = state.currentIndex - 1;
    const newCharStates = [...state.charStates];
    
    if (settings.backspace === 'Correction only' && newCharStates[prevIndex] === 'correct') {
      return; // Cannot backspace correct chars
    }
    
    newCharStates[prevIndex] = 'untyped';
    
    set({
      currentIndex: prevIndex,
      charStates: newCharStates
    });
  },
  
  tickTimer: () => {
    const state = get();
    if (state.status !== 'typing' || state.startTime === null) return;
    
    const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
    const newTimeLeft = Math.max(0, state.totalTime - elapsedSeconds);
    
    const stats = calculateStats(
      state.startTime, 
      state.correctCharacters, 
      state.correctCharacters + state.incorrectCharacters, 
      state.mistakes
    );
    
    if (newTimeLeft === 0) {
      set({ timeLeft: 0, status: 'round_complete', ...stats });
      get().completeRound();
    } else {
      set({ timeLeft: newTimeLeft, ...stats });
    }
  },
  
  completeRound: () => {
    const state = get();
    if (state.status !== 'round_complete') {
        set({ status: 'round_complete' });
    }
    
    const duration = state.totalTime - state.timeLeft;
    const roundResult: RoundResult = {
      id: Math.random().toString(36).substr(2, 9),
      testSessionId: 'temp',
      roundNumber: state.currentRoundIndex + 1,
      paragraphId: state.sessionRounds[state.currentRoundIndex]?.paragraphId || '',
      duration: duration,
      wpm: state.wpm,
      accuracy: state.accuracy,
      cpm: state.cpm,
      mistakes: state.mistakes,
      correctCharacters: state.correctCharacters,
      incorrectCharacters: state.incorrectCharacters
    };
    
    set((s) => ({ roundResults: [...s.roundResults, roundResult] }));
  },
  
  resetRound: () => {
    get().startNextRound();
  },
  
  endSession: () => {
    const state = get();
    const { roundResults, sessionRounds } = state;
    
    // Save to history
    if (roundResults.length > 0) {
      const avgWpm = Math.round(roundResults.reduce((acc, r) => acc + r.wpm, 0) / roundResults.length) || 0;
      const avgAcc = Math.round(roundResults.reduce((acc, r) => acc + r.accuracy, 0) / roundResults.length) || 0;
      const avgCpm = Math.round(roundResults.reduce((acc, r) => acc + r.cpm, 0) / roundResults.length) || 0;
      const totalMistakes = roundResults.reduce((acc, r) => acc + r.mistakes, 0);
      const totalTime = roundResults.reduce((acc, r) => acc + r.duration, 0);
      
      const session: TestSession = {
        id: Math.random().toString(36).substr(2, 9),
        startedAt: Date.now() - (totalTime * 1000),
        completedAt: Date.now(),
        totalRounds: sessionRounds.length,
        averageWpm: avgWpm,
        averageAccuracy: avgAcc,
        averageCpm: avgCpm,
        totalMistakes,
        totalDuration: totalTime,
        rounds: roundResults
      };
      
      useHistoryStore.getState().addSession(session);
    }

    set({
      status: 'session_complete',
      isSessionActive: false
    });
  }
}));
