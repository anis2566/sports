"use client"

import { DeleteBrandModal } from "@/features/dashboard/brand/components/delete-modal";
import { DeleteCategoryModal } from "@/features/dashboard/category/components/delete-modal";
import { DeleteProductModal } from "@/features/dashboard/product/components/delete-modal";
import { DeleteBannerModal } from "@/features/dashboard/banner/components/delete-modal";
import { CartModal } from "@/features/home/cart/components/cart-modal";
import { OrderStatusModal } from "@/features/dashboard/order/components/status-modal";
import { DeleteOrderModal } from "@/features/dashboard/order/components/delete-modal";
import { ReviewModal } from "@/features/home/product-details/reveiw-modal";
import { ReviewViewModal } from "@/features/dashboard/review/components/view-modal";
import { DeleteReviewModal } from "@/features/dashboard/review/components/delete-modal";
import { QuestionModal } from "@/features/home/product-details/question-modal";
import { QuestionViewModal } from "@/features/dashboard/question/components/view-modal";
import { DeleteQuestionModal } from "@/features/dashboard/question/components/delete-modal";
import { QuestionReplyModal } from "@/features/dashboard/question/components/reply-modal";
import { UserQuestionViewModal } from "@/features/home/user/questions/components/view-modal";
import { GenreModal } from "@/features/dashboard/product/components/genre-modal";
import { CategoryGenreModal } from "@/features/dashboard/category/components/genre-modal";
import { DeleteSubscriberModal } from "@/features/dashboard/subscriber/components/delete-modal";
import { RegisterSuccessModal } from "@/features/seller/register/components/success-modal";
import { SellerStatusModal } from "@/features/dashboard/seller/request/components/status-modal";
import { DeleteSellerModal } from "@/features/dashboard/seller/request/components/delete-modal";

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
            <ReviewModal />
            <ReviewViewModal />
            <DeleteReviewModal />
            <QuestionModal />
            <QuestionViewModal />
            <DeleteQuestionModal />
            <QuestionReplyModal />
            <UserQuestionViewModal />
            <GenreModal />
            <CategoryGenreModal />
            <DeleteSubscriberModal />
            <RegisterSuccessModal />
            <SellerStatusModal />
            <DeleteSellerModal />
        </>
    )
}