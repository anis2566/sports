"use client"

import { Separator } from "@/components/ui/separator"

import { Logo } from "@/components/logo"

import { useCurrent } from "@/features/auth/api/use-current"
import { SignInButton } from "./sign-in-button"
import { SellerButton } from "./seller-button"
import { WishlistButton } from "./wishlist-button"
import { CartButton } from "./cart-button"
import { UserButton } from "./user-button"

export const Header = () => {
    const { data } = useCurrent();

    return (
        <div className="hidden md:block w-full py-2 sticky top-0 z-50 bg-background">
            <div className="w-full flex items-center justify-between gap-x-3 px-2">
                <Logo callbackUrl="/" />
                {/* <Search className="flex" /> */}

                <SellerButton className="flex" />
                <Separator className="hidden md:block h-6" orientation="vertical" />
                <div className="flex items-center gap-x-2">
                    <WishlistButton />
                    <CartButton />
                    {/* <Notification /> */}
                    {
                        data?.user?.userId ? (
                            <UserButton />
                        ) : (
                            <>
                                <SignInButton className="hidden md:flex" />
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}