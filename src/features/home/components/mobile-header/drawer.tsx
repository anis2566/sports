"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

interface DrawerProps {
    children: React.ReactNode
}

export const Drawer = ({ children }: DrawerProps) => {
    const pathname = usePathname()
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-x-2 -mt-4">
                        <SheetClose asChild>
                            <Logo callbackUrl="/" />
                        </SheetClose>
                    </SheetTitle>
                </SheetHeader>
                <div className="space-y-3">
                    <div className="space-y-1 mt-5">
                        <SheetClose asChild>
                            <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "w-full flex justify-start text-md", pathname === "/" && "bg-muted-foreground text-white")}>Home</Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/products/category" className={cn(buttonVariants({ variant: "ghost" }), "w-full flex justify-start text-md", pathname === "/products/category" && "bg-slate-400 text-white")}>Category</Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/products/brand" className={cn(buttonVariants({ variant: "ghost" }), "w-full flex justify-start text-md", pathname === "/products/brand" && "bg-slate-400 text-white")}>Brand</Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/products?category=6713adf83d27b3f508d0c44e" className={cn(buttonVariants({ variant: "ghost" }), "w-full flex justify-start text-md", pathname === "/products?category=6713adf83d27b3f508d0c44e" && "bg-slate-400 text-white")}>Jacket</Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/products?discount=true" className={cn(buttonVariants({ variant: "ghost" }), "w-full flex justify-start text-md", pathname === "/products?discount=true" && "bg-slate-400 text-white")}>Discount</Link>
                        </SheetClose>
                    </div>

                    <SheetClose asChild>
                        <Button asChild variant="ghost" className="w-full flex justify-start">
                            <Link href="/wishlist">Wishlist</Link>
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button asChild variant="link">
                            <Link href="/seller/register">Become A Seller</Link>
                        </Button>
                    </SheetClose>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="secondary" className="w-full">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}