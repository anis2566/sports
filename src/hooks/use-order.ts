import { create } from "zustand";

import { ORDER_STATUS } from "@/constant";

interface OrderStatusState {
    isOpen: boolean;
    orderId: string;
    status: ORDER_STATUS | null;
    onOpen: (id: string, status: ORDER_STATUS) => void;
    onClose: () => void;
}

export const useOrderStatus = create<OrderStatusState>((set) => ({
    isOpen: false,
    orderId: "",
    status: null,
    onOpen: (id: string, status: ORDER_STATUS) => set({ isOpen: true, orderId: id, status }),
    onClose: () => set({ isOpen: false, orderId: "", status: null }),
}));


interface DeleteOrderState {
    isOpen: boolean;
    orderId: string;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeleteOrder = create<DeleteOrderState>((set) => ({
    isOpen: false,
    orderId: "",
    onOpen: (id: string) => set({ isOpen: true, orderId: id }),
    onClose: () => set({ isOpen: false, orderId: "" }),
}));
