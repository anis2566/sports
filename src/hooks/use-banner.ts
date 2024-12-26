import { create } from "zustand";

interface DeleteBannerState {
  isOpen: boolean;
  bannerId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteBanner = create<DeleteBannerState>((set) => ({
  isOpen: false,
  bannerId: "",
  onOpen: (id: string) => set({ isOpen: true, bannerId: id }),
  onClose: () => set({ isOpen: false, bannerId: "" }),
}));
