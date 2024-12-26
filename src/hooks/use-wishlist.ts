import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ProductWithRelations } from "./use-cart";

interface WishlistState {
    wishlist: ProductWithRelations[];
    addToWishlist: (product: ProductWithRelations) => void;
    removeFromWishlist: (productId: string) => void;
}

export const useWishlist = create<WishlistState>()(
    persist(
        (set) => ({
            wishlist: [],
            addToWishlist: (product) => {
                set((state) => {
                    const wishlistIndex = state.wishlist.findIndex(
                        (item) => item.id === product.id,
                    );

                    if (wishlistIndex > -1) {
                        return state;
                    } else {
                        return {
                            ...state,
                            wishlist: [
                                ...state.wishlist,
                                {
                                    ...product,
                                },
                            ],
                        };
                    }
                });
            },
            removeFromWishlist: (productId: string) => {
                set((state) => ({
                    ...state,
                    wishlist: state.wishlist.filter((item) => item.id !== productId),
                }));
            },
        }),
        {
            name: "user-wishlist",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);