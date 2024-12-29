"use client"

import { Edit, MoreVerticalIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { EmptyStat } from "@/components/empty-stat"
import { useDeleteProduct } from "@/hooks/use-product"
import { useGetProducts } from "../api/use-get-products"
import { CustomPagination } from "@/components/custom-pagination"
import { PRODUCT_STATUS } from "@/constant"
import { Header } from "./header"

export const ProductList = () => {
    const { onOpen } = useDeleteProduct()

    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { data, isLoading } = useGetProducts()

    return (
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
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVerticalIcon className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/product/edit/${product.id}`} className="flex items-center gap-x-3">
                                                        <Edit className="w-5 h-5" />
                                                        <p>Edit</p>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(product.id)}>
                                                    <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                                                    <p className="group-hover:text-rose-600">Delete</p>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
