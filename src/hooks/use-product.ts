import { GENRE } from "@/constant";
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


interface ChangeGenreState {
    isOpen: boolean;
    productId: string;
    genre: GENRE[];
    onOpen: (id: string, genre: GENRE[]) => void;
    onClose: () => void;
}

export const useChangeGenre = create<ChangeGenreState>((set) => ({
    isOpen: false,
    productId: "",
    genre: [],
    onOpen: (id: string, genre: GENRE[]) => set({ isOpen: true, productId: id, genre }),
    onClose: () => set({ isOpen: false, productId: "", genre: [] }),
}));
