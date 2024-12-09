import { create } from "zustand";

interface DeleteBrandState {
  isOpen: boolean;
  brandId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteBrand = create<DeleteBrandState>((set) => ({
  isOpen: false,
  brandId: "",
  onOpen: (id: string) => set({ isOpen: true, brandId: id }),
  onClose: () => set({ isOpen: false, brandId: "" }),
}));
