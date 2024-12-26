import { Metadata } from "next"
import Link from "next/link"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { BannerList } from "@/features/dashboard/banner/components/banner-list"

export const metadata: Metadata = {
    title: "Dashboard | Banner",
    description: "Banner",
}

const Banner = async () => {
    return (
        <ContentLayout title="Banner">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Banner</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <BannerList />
        </ContentLayout>
    )
}

export default Banner
