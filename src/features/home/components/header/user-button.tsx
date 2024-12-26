"use client";

import Link from "next/link";
import { FilePenLine, Gift, LogOut, MessageCircle, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrent } from "@/features/auth/api/use-current";

export function UserButton() {
    const { data } = useCurrent();

    // const handleSignOut = async () => {
    //     await signOut();
    // };

    return (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="relative h-8 w-8 rounded-full"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={data?.user?.image || ""} />
                                    <AvatarFallback className="bg-transparent">
                                        {data?.user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Profile</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {data?.user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {data?.user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link href="/user/profile" className="flex items-center">
                            <User className="mr-3 h-4 w-4 text-muted-foreground" />
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link href="/user/orders" className="flex items-center">
                            <ShoppingBag className="mr-3 h-4 w-4 text-muted-foreground" />
                            Orders
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link href="/user/reviews" className="flex items-center">
                            <FilePenLine className="mr-3 h-4 w-4 text-muted-foreground" />
                            Reviews
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link href="/user/questions" className="flex items-center">
                            <MessageCircle className="mr-3 h-4 w-4 text-muted-foreground" />
                            Questions
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer" asChild>
                        <Link href="/user/points" className="flex items-center">
                            <Gift className="mr-3 h-4 w-4 text-muted-foreground" />
                            Points
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="hover:cursor-pointer"
                // onClick={handleSignOut}
                >
                    <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}