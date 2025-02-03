import { create } from "zustand";

interface DeleteSubscriberState {
    isOpen: boolean;
    id: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteSubscriber = create<DeleteSubscriberState>((set) => ({
    isOpen: false,
    id: "",
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: "" }),
}));
