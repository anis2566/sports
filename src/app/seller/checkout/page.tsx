import Link from "next/link"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/seller/components/content-layout"
import { CheckoutForm } from "@/features/seller/checkout/components/checkout-page"

const Checkout = () => {
    return (
        <ContentLayout title="Checkout">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/seller">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Checkout</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CheckoutForm />
        </ContentLayout>
    )
}

export default Checkout