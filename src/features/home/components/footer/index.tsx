import React from "react";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import { Logo } from "@/components/logo";

export const Footer = () => {
    return (
        <footer id="footer" className="container">
            <div className="bg-background p-10">
                <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-5">
                    <div className="col-span-full xl:col-span-2">
                        <Logo callbackUrl="/" />
                        <p className="text-sm text-muted-foreground pl-12">
                            Nilkhet, Dhaka, Bangladesh
                        </p>
                        <p className="text-sm text-muted-foreground pl-12">
                            01749-198072
                        </p>
                    </div>

                    {/* Courses section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold">Products</h3>
                        <Link href="/products" className="opacity-60 hover:opacity-100">
                            All Products
                        </Link>
                        <Link href="/products?category=67399d09054434037d2ef348" className="opacity-60 hover:opacity-100">
                            Jersy
                        </Link>
                        <Link href="/products?discount=true" className="opacity-60 hover:opacity-100">
                            Discount Products
                        </Link>
                    </div>

                    {/* Seller section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold">Seller</h3>
                        <Link href="/seller" className="opacity-60 hover:opacity-100">
                            Dashboard
                        </Link>
                        <Link href="/seller/register" className="opacity-60 hover:opacity-100">
                            Become a Seller
                        </Link>
                    </div>

                    {/* Support section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold">Support</h3>
                        <Link href="/support" className="opacity-60 hover:opacity-100">
                            Chat
                        </Link>
                        <Link href="/contact" className="opacity-60 hover:opacity-100">
                            Contact Us
                        </Link>
                    </div>
                </div>

                <Separator className="my-6" />
                <section className="">
                    <h3 className="">&copy; {new Date().getFullYear()} TomarSports. All rights reserved.</h3>
                </section>
            </div>
        </footer>
    );
};