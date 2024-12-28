import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { ReviewList } from "@/features/dashboard/review/components/review-list"

export const metadata: Metadata = {
    title: "Dashboard | Review",
    description: "Review Page",
}

const Review = async () => {
    return (
        <ContentLayout title="Review">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Review</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading</div>}>
                <ReviewList />
            </Suspense>
        </ContentLayout>
    )
}

export default Review
