import { create } from "zustand";

type createTaskStore = {
  showTask: boolean;
  setShowTaks: (newVal: boolean) => void;
};

export const useCreateTask = create<createTaskStore>((set) => ({
  showTask: false,
  setShowTaks(newVal) {
    set({
      showTask: newVal,
    });
  },
}));
