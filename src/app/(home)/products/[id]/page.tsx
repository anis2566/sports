import { redirect } from "next/navigation"

import { ProductDetails } from "@/features/home/product-details"
import { db } from "@/lib/db"

interface Props {
    params: Promise<{ id: string }>
}

const Product = async ({ params }: Props) => {
    const { id } = (await params)

    const product = await db.product.findUnique({
        where: {
            id: id
        },
        include: {
            category: true,
            variants: true
        }
    })

    if (!product) redirect("/")

    return <ProductDetails product={product} />
}

export default Product