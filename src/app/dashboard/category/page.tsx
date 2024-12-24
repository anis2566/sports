import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { CategoryList } from "@/features/dashboard/category/components/category-list"

export const metadata: Metadata = {
    title: "Dashboard | Category",
    description: "Category",
}

const Category = async () => {

    return (
        <ContentLayout title="Category">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Category</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <CategoryList />
            </Suspense>
        </ContentLayout>
    )
}

export default Category
