import { Variant } from "@prisma/client";
import { Category } from "@prisma/client";
import { Product } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CategoryWithExtended = Omit<Category, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};

export type VariantWithExtended = Omit<Variant, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};

export type ProductWithExtended = Omit<Product, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};

export interface ProductWithRelations extends ProductWithExtended {
    category: CategoryWithExtended;
    variants: VariantWithExtended[];
}

interface CartItem {
    product: ProductWithRelations;
    variant: VariantWithExtended;
    color?: string;
    price: number;
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    incrementQuantity: (productId: string) => void;
    decrementQuantity: (productId: string) => void;
    resetCart: () => void;
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (item: CartItem) => {
                const cart = get().cart;
                const existingItem = cart.find(
                    (cartItem) => cartItem.product.id === item.product.id,
                );

                if (existingItem) {
                    // Update quantity if item already exists in cart
                    set({
                        cart: cart.map((cartItem) =>
                            cartItem.product.id === item.product.id
                                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                                : cartItem,
                        ),
                    });
                } else {
                    // Add new item to cart
                    set({ cart: [...cart, item] });
                }
            },

            removeFromCart: (productId: string) => {
                set({
                    cart: get().cart.filter((cartItem) => cartItem.product.id !== productId),
                });
            },

            incrementQuantity: (productId: string) => {
                set({
                    cart: get().cart.map((cartItem) =>
                        cartItem.product.id === productId
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem,
                    ),
                });
            },

            decrementQuantity: (productId: string) => {
                set({
                    cart: get().cart.map((cartItem) =>
                        cartItem.product.id === productId && cartItem.quantity > 1
                            ? { ...cartItem, quantity: cartItem.quantity - 1 }
                            : cartItem,
                    ),
                });
            },
            resetCart: () => {
                set({ cart: [] });
            },
        }),
        {
            name: "user-cart",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);

interface OpenCartModalState {
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useOpenCartModal = create<OpenCartModalState>()((set) => ({
    open: false,
    onOpen: () => set({ open: true }),
    onClose: () => set({ open: false }),
}));