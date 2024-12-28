import { create } from "zustand";

interface AddReviewState {
  isOpen: boolean;
  productId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useAddReview = create<AddReviewState>((set) => ({
  isOpen: false,
  productId: "",
  onOpen: (id: string) => set({ isOpen: true, productId: id }),
  onClose: () => set({ isOpen: false, productId: "" }),
}));
