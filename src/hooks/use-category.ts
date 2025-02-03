import { create } from "zustand";

import { CATEGORY_GENRE } from "@/constant";

interface DeleteCategoryState {
  isOpen: boolean;
  categoryId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteCategory = create<DeleteCategoryState>((set) => ({
  isOpen: false,
  categoryId: "",
  onOpen: (id: string) => set({ isOpen: true, categoryId: id }),
  onClose: () => set({ isOpen: false, categoryId: "" }),
}));


interface ChangeGenreState {
  isOpen: boolean;
  categoryId: string;
  genre: CATEGORY_GENRE[];
  onOpen: (id: string, genre: CATEGORY_GENRE[]) => void;
  onClose: () => void;
}

export const useChangeGenre = create<ChangeGenreState>((set) => ({
  isOpen: false,
  categoryId: "",
  genre: [],
  onOpen: (id: string, genre: CATEGORY_GENRE[]) => set({ isOpen: true, categoryId: id, genre }),
  onClose: () => set({ isOpen: false, categoryId: "", genre: [] }),
}));