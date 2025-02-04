import { STATUS } from "@/constant";
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

interface SellerStatusState {
  isOpen: boolean;
  id: string;
  status: STATUS | null;
  onOpen: (id: string, status: STATUS) => void;
  onClose: () => void;
}

export const useSellerStatus = create<SellerStatusState>((set) => ({
  isOpen: false,
  id: "",
  status: null,
  onOpen: (id: string, status: STATUS) => set({ isOpen: true, id, status }),
  onClose: () => set({ isOpen: false, id: "", status: null }),
}));


interface SellerDeleteState {
  isOpen: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useSellerDelete = create<SellerDeleteState>((set) => ({
  isOpen: false,
  id: "",
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: "" }),
}));
