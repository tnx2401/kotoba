import { UserStore } from "@/model/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
