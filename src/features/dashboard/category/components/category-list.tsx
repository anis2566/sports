"use client"

import { Edit, MoreVerticalIcon, SquareStack, Trash2 } from "lucide-react"
import Link from "next/link"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import { CATEGORY_GENRE, CATEGORY_STATUS } from "@/constant"
import { EmptyStat } from "@/components/empty-stat"
import { useGetCategories } from "../api/use-get-categories"
import { CustomPagination } from "@/components/custom-pagination"
import { Header } from "./header"
import { useChangeGenre, useDeleteCategory } from "@/hooks/use-category"

export const CategoryList = () => {
    const { onOpen } = useDeleteCategory()
    const { onOpen: onOpenChangeGenre } = useChangeGenre()

    const { data: categories, isLoading } = useGetCategories()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Category</CardTitle>
                <CardDescription>Manage your categories here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? <CategoryListSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Tags</TableHead>
                                    <TableHead>Genre</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories?.categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={category.imageUrl} />
                                                <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.products.length}</TableCell>
                                        <TableCell>
                                            {
                                                category.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="mr-2">{tag}</Badge>
                                                ))
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                category.genre.map((genre) => (
                                                    <Badge key={genre} variant="outline" className="mr-2">{genre}</Badge>
                                                ))
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="rounded-full" variant={category.status === CATEGORY_STATUS.Active ? "default" : "destructive"}>{category.status}</Badge>
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
                                                        <Link href={`/dashboard/category/edit/${category.id}`} >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full" onClick={() => onOpenChangeGenre(category.id, category.genre as CATEGORY_GENRE[])}>
                                                        <SquareStack className="w-4 h-4 mr-2" />
                                                        Change Genre
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full text-red-500 hover:text-red-400" onClick={() => onOpen(category.id)}>
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
                {!isLoading && categories?.categories.length === 0 && <EmptyStat title="No categories found" />}
                <CustomPagination totalCount={categories?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


export const CategoryListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Tags</TableHead>
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}