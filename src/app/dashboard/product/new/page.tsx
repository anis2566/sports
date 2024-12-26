import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { ProductForm } from "@/features/dashboard/product/components/product-form";

export const metadata: Metadata = {
    title: "Dashboard | Product | New",
    description: "Dashboard | Product | New",
};

const ProductNew = () => {
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
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/product">Product</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>New</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <ProductForm />
            </Suspense>
        </ContentLayout>
    )
}

export default ProductNew;