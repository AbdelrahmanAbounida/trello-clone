import { create } from "zustand";

type WorkspaceModalStore = {
  id?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useWorkspaceModal = create<WorkspaceModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
