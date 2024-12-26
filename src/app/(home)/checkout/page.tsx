import { Metadata } from "next";

import { CheckoutForm } from "@/features/home/checkout/components/checkout-form";

export const metadata: Metadata = {
    title: "TomarSports | Checkout",
    description: "Checkout.",
};


const Checkout = () => {
    return (
        <div className="px-3 md:px-0 mt-4 pb-6">
            <CheckoutForm />
        </div>
    )
}

export default Checkout