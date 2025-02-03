import { create } from "zustand";

interface SellerRegisterState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSellerRegisterSuccess = create<SellerRegisterState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

