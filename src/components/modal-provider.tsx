"use client"

import { DeleteBrandModal } from "@/features/dashboard/brand/components/delete-modal";
import { DeleteCategoryModal } from "@/features/dashboard/category/components/delete-modal";
import { DeleteProductModal } from "@/features/dashboard/product/components/delete-modal";
import { DeleteBannerModal } from "@/features/dashboard/banner/components/delete-modal";
import { CartModal } from "@/features/home/cart/components/cart-modal";
import { OrderStatusModal } from "@/features/dashboard/order/components/status-modal";
import { DeleteOrderModal } from "@/features/dashboard/order/components/delete-modal";

export const ModalProvider = () => {
    return (
        <>
            <DeleteCategoryModal />
            <DeleteBrandModal />
            <DeleteProductModal />
            <DeleteBannerModal />
            <CartModal />
            <OrderStatusModal />
            <DeleteOrderModal />
        </>
    )
}
