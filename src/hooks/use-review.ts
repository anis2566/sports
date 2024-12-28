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


type Review = {
  productName: string;
  userName: string;
  rating: number;
  content: string;
}

interface ViewReviewState {
  isOpen: boolean;
  review: Review | null;
  onOpen: (review: Review) => void;
  onClose: () => void;
}

export const useViewReview = create<ViewReviewState>((set) => ({
  isOpen: false,
  review: null,
  onOpen: (review: Review) => set({ isOpen: true, review }),
  onClose: () => set({ isOpen: false, review: null }),
}));


interface DeleteReviewState {
  isOpen: boolean;
  reviewId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteReview = create<DeleteReviewState>((set) => ({
  isOpen: false,
  reviewId: "",
  onOpen: (id: string) => set({ isOpen: true, reviewId: id }),
  onClose: () => set({ isOpen: false, reviewId: "" }),
}));

