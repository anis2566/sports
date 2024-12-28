import { Metadata } from "next";
import { Suspense } from "react";

import { ProductPage } from "@/features/home/products/components/product-page";

export const metadata: Metadata = {
    title: "TomarSports | Products",
    description: "Products.",
};


const Products = () => {
    return (
        <div className="px-3 md:px-0 mt-4 pb-6">
            <Suspense fallback={<div>Loading...</div>}>
                <ProductPage />
            </Suspense>
        </div>
    )
}

export default Products