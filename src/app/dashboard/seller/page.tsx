import Link from "next/link"
import { Suspense } from "react"
import { Metadata } from "next"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { SellerList } from "@/features/seller/components/seller-list"

export const metadata: Metadata = {
    title: "Dashboard | Seller",
    description: "Seller Page",
}

const Sellers = () => {
    return (
        <ContentLayout title="Seller">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Sellers</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading</div>}>
                <SellerList />
            </Suspense>
        </ContentLayout>
    )
}

export default Sellers;