"use client"

import { DeleteBrandModal } from "@/features/dashboard/brand/components/delete-modal";
import { DeleteCategoryModal } from "@/features/dashboard/category/components/delete-modal";
import { DeleteProductModal } from "@/features/dashboard/product/components/delete-modal";
import { DeleteBannerModal } from "@/features/dashboard/banner/components/delete-modal";
import { CartModal } from "@/features/home/cart/components/cart-modal";
import { OrderStatusModal } from "@/features/dashboard/order/components/status-modal";
import { DeleteOrderModal } from "@/features/dashboard/order/components/delete-modal";
import { ReveiwModal } from "@/features/home/product-details/reveiw-modal";
import { ReviewViewModal } from "@/features/dashboard/review/components/view-modal";
import { DeleteReviewModal } from "@/features/dashboard/review/components/delete-modal";
import { QuestionModal } from "@/features/home/product-details/question-modal";
import { QuestionViewModal } from "@/features/dashboard/question/components/view-modal";
import { DeleteQuestionModal } from "@/features/dashboard/question/components/delete-modal";
import { QuestionReplyModal } from "@/features/dashboard/question/components/reply-modal";
import { UserQuestionViewModal } from "@/features/home/user/questions/components/view-modal";

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
            <ReveiwModal />
            <ReviewViewModal />
            <DeleteReviewModal />
            <QuestionModal />
            <QuestionViewModal />
            <DeleteQuestionModal />
            <QuestionReplyModal />
            <UserQuestionViewModal />
        </>
    )
}
