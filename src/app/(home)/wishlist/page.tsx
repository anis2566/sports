import { Metadata } from "next";

import { WishlistPage } from "@/features/home/wishlist/components/wishlist";

export const metadata: Metadata = {
    title: "TomarSports | Wishlist",
    description: "Wishlist page.",
};

const Wishlist = () => {
    return <WishlistPage />
}

export default Wishlist