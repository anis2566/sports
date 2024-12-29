import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { EditProductForm } from "@/features/dashboard/product/components/edit-product-form";
import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "Dashboard | Product | Edit",
    description: "Edit Product",
}

interface Props {
    params: Promise<{ id: string }>
}

const EditProduct = async ({ params }: Props) => {
    const { id } = (await params)

    const product = await db.product.findUnique({
        where: {
            id: id
        },
        include: {
            variants: true
        }
    })

    if (!product) redirect("/dashboard/product")

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
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditProductForm product={product} />
        </ContentLayout>
    )
}

export default EditProduct