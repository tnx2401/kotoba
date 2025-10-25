//? Create a store to store deck's name in flashcards

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DeckStore } from "@/model/flashcard";

const useDeckStore = create<DeckStore>()(
  persist(
    (set) => ({
      currentDeck: null,
      setCurrentDeck: (deck) => set({ currentDeck: deck }),
    }),
    {
      name: "deck-storage",
    }
  )
);
export default useDeckStore;
