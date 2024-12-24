import { create } from "zustand";

interface DeleteProductState {
    isOpen: boolean;
    productId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteProduct = create<DeleteProductState>((set) => ({
    isOpen: false,
    productId: "",
    onOpen: (id: string) => set({ isOpen: true, productId: id }),
    onClose: () => set({ isOpen: false, productId: "" }),
}));
