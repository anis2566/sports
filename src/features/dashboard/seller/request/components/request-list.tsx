"use client"

import { MoreVerticalIcon, Eye, Trash2, RefreshCcw } from "lucide-react";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { useGetSellerRequest } from "../api/use-get-seller-request";
import { EmptyStat } from "@/components/empty-stat";
import { CustomPagination } from "@/components/custom-pagination";
import { STATUS } from "@/constant";
import { useSellerDelete, useSellerStatus } from "@/hooks/use-seller";
import { Header } from "@/features/dashboard/subscriber/components/header";

export const RequestList = () => {
    const { onOpen } = useSellerStatus();
    const { onOpen: onOpenDelete } = useSellerDelete();

    const { data, isLoading } = useGetSellerRequest();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Seller Request</CardTitle>
                <CardDescription>Manage your seller request here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? <SellerRequestSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>User</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Business Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.sellers.map((seller) => (
                                    <TableRow key={seller.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-x-3">
                                                <Avatar>
                                                    <AvatarImage src={seller.user.image || ""} alt={seller.user.name || ""} />
                                                    <AvatarFallback>
                                                        {seller.user.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p>{seller.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {seller.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={seller.imageUrl} />
                                                <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{seller.name}</TableCell>
                                        <TableCell>{seller.businessName}</TableCell>
                                        <TableCell>{seller.phone}</TableCell>
                                        <TableCell>{seller.email}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{seller.address}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className="rounded-full" variant={seller.status === STATUS.Pending ? "outline" : seller.status === STATUS.Active ? "default" : "destructive"}>{seller.status}</Badge>
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
                                                        <Link href={`/dashboard/seller/${seller.id}`} >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full" onClick={() => onOpen(seller.id, seller.status as STATUS)}>
                                                        <RefreshCcw className="w-4 h-4 mr-2" />
                                                        Change Status
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full text-red-500 hover:text-red-400" onClick={() => onOpenDelete(seller.id)}>
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
                {!isLoading && data?.sellers.length === 0 && <EmptyStat title="No seller request found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


export const SellerRequestSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>User</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Address</TableHead>
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}