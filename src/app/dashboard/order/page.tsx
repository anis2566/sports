import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { OrderList } from "@/features/dashboard/order/components/order-list"

export const metadata: Metadata = {
    title: "Dashboard | Order",
    description: "Order",
}

const Order = async () => {
    return (
        <ContentLayout title="Order">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Order</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading</div>}>
                <OrderList />
            </Suspense>
        </ContentLayout>
    )
}

export default Order
