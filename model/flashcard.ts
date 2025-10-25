export type LearnStatus = 0 | 1 | 2 | 3;

export interface Word {
  id: number;
  front: string;
  back: string;
  learnStatus: LearnStatus;
  easeFactor: number;
  interval: number;
  nextReview: Date | null;
  repetitions: number;
  lastReview: Date | null;
}

export interface Deck {
  id: number;
  name: string;
  color?: string;
  words: Word[];
  learned: number;
  completed_percentage: number;
}

export interface DeckStore {
  currentDeck: Deck | null;
  setCurrentDeck: (deck: Deck | null) => void;
}

export interface EditData {
  name: string;
  editedWords?: Word[] | null;
}
