"use client"

import { Edit, MoreVerticalIcon, Package, SquareStack, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import { EmptyStat } from "@/components/empty-stat"
import { useChangeGenre, useDeleteProduct } from "@/hooks/use-product"
import { useGetProducts } from "../api/use-get-products"
import { CustomPagination } from "@/components/custom-pagination"
import { GENRE, PRODUCT_STATUS } from "@/constant"
import { Header } from "./header"
import { useGetProductStat } from "../api/use-get-product-stat"
import { ProductStat } from "./product-stat"

export const ProductList = () => {
    const { onOpen } = useDeleteProduct()
    const { onOpen: onOpenChangeGenre } = useChangeGenre()

    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { data: productStat, isLoading: isProductStatLoading } = useGetProductStat()
    const { data, isLoading } = useGetProducts()

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ProductStat title="Total Products" isLoading={isProductStatLoading} value={productStat?.totalProduct || 0} icon={Package} />
                <ProductStat title="Active Products" isLoading={isProductStatLoading} value={productStat?.activeProduct || 0} icon={Package} />
                <ProductStat title="Inactive Products" isLoading={isProductStatLoading} value={productStat?.inactiveProduct || 0} icon={Package} />
                <ProductStat title="Out of Stock Products" isLoading={isProductStatLoading} value={productStat?.outOfStockProduct || 0} icon={Package} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Product</CardTitle>
                    <CardDescription>Manage your products here</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    {isLoading ? <ProductListSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Discount Price</TableHead>
                                    <TableHead>Seller Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Variants</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={product.variants[0].images[0] || ""} />
                                                <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="truncate max-w-[200px]">{product.name}</TableCell>
                                        <TableCell>{product.category.name}</TableCell>
                                        <TableCell>{product.brand.name}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.discountPrice}</TableCell>
                                        <TableCell>{product.sellerPrice}</TableCell>
                                        <TableCell>{product.totalStock}</TableCell>
                                        <TableCell>{product.variants.length}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.status === PRODUCT_STATUS.Active ? "default" : "destructive"} className="rounded-full">
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent side="right" className="p-2 max-w-[180px]">
                                                    <Button asChild variant="ghost" className="flex items-center justify-start gap-x-2 w-full">
                                                        <Link href={`/dashboard/product/edit/${product.id}`} >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full" onClick={() => onOpenChangeGenre(product.id, product.genre as GENRE[])}>
                                                        <SquareStack className="w-4 h-4 mr-2" />
                                                        Change Genre
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full text-red-500 hover:text-red-400" onClick={() => onOpen(product.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {!isLoading && data?.products.length === 0 && <EmptyStat title="No products found" />}
                    <CustomPagination pageSize={limit} totalCount={data?.totalCount || 0} />
                </CardContent>
            </Card>
        </div>
    )
}


export const ProductListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount Price</TableHead>
                    <TableHead>Seller Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
