import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { ProductList } from "@/features/dashboard/product/components/product-list"

export const metadata: Metadata = {
    title: "Dashboard | Product",
    description: "Product",
}

const Product = async () => {
    return (
        <ContentLayout title="Product">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Product</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <ProductList />
            </Suspense>
        </ContentLayout>
    )
}

export default Product
