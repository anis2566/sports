"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { userSidebarNavs } from "@/constant";

export const SidebarNavs = () => {
    const pathname = usePathname();

    return (
        <div className="space-y-2">
            {userSidebarNavs.map((nav) => {
                const isActive = nav.href
                    ? pathname === nav.href
                    : pathname.includes(nav.href);
                return (
                    <Link
                        href={nav.href}
                        key={nav.href}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "flex w-full justify-start gap-x-3",
                            isActive && "bg-accent text-accent-foreground",
                        )}
                    >
                        <nav.icon className="h-4 w-4" />
                        {nav.label}
                    </Link>
                );
            })}

            <Button variant="ghost" className="flex w-full justify-start gap-x-3">
                <LogOutIcon className="h-4 w-4" />
                Logout
            </Button>
        </div>
    );
};