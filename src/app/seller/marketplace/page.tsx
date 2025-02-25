import Link from "next/link"
import { Suspense } from "react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/seller/components/content-layout"
import { MarketplacePage } from "@/features/seller/products/components/marketplace-page"

const MarketPlace = () => {
    return (
        <ContentLayout title="Marketplace">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/seller">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Marketplace</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        
            <Suspense fallback={<div>Loading...</div>}>
                <MarketplacePage />
            </Suspense>
        </ContentLayout>
    )
}

export default MarketPlace