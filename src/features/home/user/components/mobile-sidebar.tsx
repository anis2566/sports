"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";

import { userSidebarNavs } from "@/constant";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const MobileSidebar = () => {
    const pathname = usePathname();
    return <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden shadow-md px-5 py-2 bg-gray-100/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
            {userSidebarNavs.slice(0, 4).map((nav) => {
                const isActive = nav.href
                    ? pathname === nav.href
                    : pathname.includes(nav.href);
                return (
                    <Link
                        href={nav.href}
                        key={nav.href}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "flex flex-col justify-center items-center w-full gap-y-1 h-14",
                            isActive && "bg-accent text-primary",
                        )}
                    >
                        <nav.icon className="h-4 w-4" />
                        <p className="text-xs">{nav.label}</p>
                    </Link>
                );
            })}
        </div>
    </div>
}
