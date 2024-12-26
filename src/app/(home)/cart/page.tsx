import { Metadata } from "next";

import { CartPage } from "@/features/home/cart/components/cart"

export const metadata: Metadata = {
    title: "TomarSports | Cart",
    description: "Cart page.",
};


const Cart = () => {
    return <CartPage />
}

export default Cart