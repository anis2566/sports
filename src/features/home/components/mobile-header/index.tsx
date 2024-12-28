import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"

import { CartButton } from "../header/cart-button"
import { UserButton } from "../header/user-button"
import { Search } from "../header/search"
import { SignInButton } from "../header/sign-in-button"
import { getCurrent } from "@/features/auth/server/action"
import { Drawer } from "./drawer"

export const MobileHeader = async () => {
    const user = await getCurrent();

    return (
        <div className="md:hidden w-full py-2 z-50 bg-background px-3 md:px-0 space-y-3 fixed top-0 left-0 right-0">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Drawer>
                        <Button variant="ghost" size="icon">
                            <Menu />
                        </Button>
                    </Drawer>
                    <Link href="/">
                        <Image src="/logo.svg" alt="logo" width={30} height={30} />
                    </Link>
                </div>
                <div className="flex items-center gap-x-2">
                    {/* {
                        session?.userId ? (
                            // <Notification />
                        ) : null
                    } */}
                    <CartButton />
                    {
                        user?.userId ? (
                            <UserButton />
                        ) : <SignInButton />
                    }
                </div>
            </div>
            <Search />
        </div>
    )
}