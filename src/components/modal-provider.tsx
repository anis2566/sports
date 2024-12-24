"use client"

import { DeleteBrandModal } from "@/features/dashboard/brand/components/delete-modal";
import { DeleteCategoryModal } from "@/features/dashboard/category/components/delete-modal";
import { DeleteProductModal } from "@/features/dashboard/product/components/delete-modal";

export const ModalProvider = () => {
    return (
        <>
            <DeleteCategoryModal />
            <DeleteBrandModal />
            <DeleteProductModal />
        </>
    )
}
