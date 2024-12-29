"use client"

import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

import { Sort } from "./sort-filter"

interface SortDrawerProps {
    children: React.ReactNode
}

export const SortDrawer = ({ children }: SortDrawerProps) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="flex justify-center items-center relative">
                        <span>Sort</span>
                        <DrawerClose asChild>
                            <Button variant="secondary" size="icon" className="absolute right-0">
                                <XIcon className="w-4 h-4 text-rose-500" />
                            </Button>
                        </DrawerClose>
                    </DrawerTitle>
                </DrawerHeader>
                <Separator />
                <div className="p-4">
                    <Sort />
                </div>
            </DrawerContent>
        </Drawer>
    )
}