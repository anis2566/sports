"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./sidebar"
import { redirect, usePathname } from "next/navigation";
import { ROLE, STATUS } from "@/constant";
import { PendingAccount } from "@/components/pending-account";

interface SellerLayoutProps {
    children: React.ReactNode;
    role: string;
    status: STATUS;
}

export const SellerLayout = ({ children, role, status }: SellerLayoutProps) => {
    const pathname = usePathname();
    const isNoLayout = pathname.includes("/seller/register");

    if (!isNoLayout && role !== ROLE.Seller) {
        return redirect("/");
    }

    if (role === ROLE.Seller && status === STATUS.Pending) {
        return <PendingAccount />
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                {children}
            </main>
        </SidebarProvider>
    )
}
