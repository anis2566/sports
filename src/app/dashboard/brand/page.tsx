import { Metadata } from "next"
import Link from "next/link"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { db } from "@/lib/db"
import { BrandList } from "@/features/dashboard/brand/components/brand-list"
import { CustomPagination } from "@/components/custom-pagination"
import { Header } from "@/features/dashboard/brand/components/header"

export const metadata: Metadata = {
    title: "Dashboard | Brand",
    description: "Brand",
}

type SearchParams = Promise<{
    query?: string;
    sort?: "desc" | "asc";
    page?: string;
    limit?: string;
}>

interface Props {
    searchParams: SearchParams
}

const Brand = async ({ searchParams }: Props) => {
    const { query, sort, page, limit } = await searchParams;

    const pageNumber = parseInt(page || "1");
    const limitNumber = parseInt(limit || "5");

    const [brands, totalCount] = await Promise.all([
        db.brand.findMany({
            where: {
                ...(query && { name: { contains: query, mode: "insensitive" } }),
            },
            orderBy: {
                ...(sort === "desc" ? { createdAt: "desc" } : { createdAt: "asc" }),
            },
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
        }),
        db.brand.count({
            where: {
                ...(query && { name: { contains: query, mode: "insensitive" } }),
            },
        }),
    ]);

    return (
        <ContentLayout title="Brand">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Brand</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card>
                <CardHeader>
                    <CardTitle>Brand</CardTitle>
                    <CardDescription>Manage your brands here</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <BrandList brands={brands} />
                    <CustomPagination pageSize={limitNumber} totalCount={totalCount} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Brand
