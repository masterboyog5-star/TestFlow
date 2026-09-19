export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
}

export interface Paragraph {
  id: string;
  title: string;
  text: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  wordCount: number;
  characterCount: number;
  createdAt: number;
}

export interface Preset {
  id: string;
  userId: string;
  name: string;
  mode: 'Time' | 'Paragraph' | 'Round' | 'Practice' | 'Accuracy' | 'Speed';
  settings: Partial<UserSettings>;
}

export interface RoundResult {
  id: string;
  testSessionId: string;
  roundNumber: number;
  paragraphId: string;
  duration: number; // in seconds
  wpm: number;
  accuracy: number;
  cpm: number;
  mistakes: number;
  correctCharacters: number;
  incorrectCharacters: number;
}

export interface TestSession {
  id: string;
  userId?: string;
  presetId?: string;
  startedAt: number;
  completedAt: number | null;
  totalRounds: number;
  averageWpm: number;
  averageAccuracy: number;
  averageCpm: number;
  totalMistakes: number;
  totalDuration: number;
  rounds: RoundResult[];
}

export interface UserSettings {
  userId?: string;
  theme: 'Dark Navy' | 'Light'; // Just supporting dark for now based on prompt
  typingSettings: {
    caseSensitivity: boolean;
    punctuation: boolean;
    numbers: boolean;
    backspace: 'Allowed' | 'Disabled' | 'Correction only';
    errorBehavior: 'Continue after error' | 'Require correction';
    errorHighlight: 'Red' | 'Red + underline';
    caret: 'Line' | 'Block' | 'Underline';
    smoothCaret: boolean;
    spaceHandling: 'Normal' | 'Strict';
  };
  displaySettings: {
    fontFamily: string;
    fontSize: number;
    textWidth: string;
    lineHeight: number;
    showWpm: boolean;
    showAccuracy: boolean;
    showCpm: boolean;
    showMistakes: boolean;
    showTime: boolean;
  };
  soundSettings: {
    keypress: boolean;
    error: boolean;
    countdown: boolean;
    roundCompletion: boolean;
    testCompletion: boolean;
    volume: number;
  };
  testSettings: {
    mode: 'Time' | 'Paragraph' | 'Round' | 'Practice' | 'Accuracy' | 'Speed';
    timerStart: 'First character' | 'Manual';
    countdown: number; // 0, 3, 5
    autoNextRound: boolean;
  };
}

export interface RoundConfig {
  id: string;
  paragraphId: string; // 'custom' for custom text
  customText?: string;
  timerSeconds: number; // e.g. 60
}
