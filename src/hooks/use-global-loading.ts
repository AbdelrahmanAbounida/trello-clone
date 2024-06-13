import { create } from "zustand";

type globaLoadingStore = {
  isGlobalLoading: boolean;
  setIsGlobalLoading: (newVal: boolean) => void;
};

export const useGlobalLoading = create<globaLoadingStore>((set) => ({
  isGlobalLoading: false,
  setIsGlobalLoading(newVal) {
    set({ isGlobalLoading: newVal });
  },
}));
