import { create } from "zustand";

type activeWorkspace = {
  activeWsId: string;
  setActiveWs: (newactiveWsId: string) => void;
};

export const useActiveWorkspace = create<activeWorkspace>((set) => ({
  activeWsId: "",
  setActiveWs(newactiveWsId) {
    set({ activeWsId: newactiveWsId });
  },
}));
