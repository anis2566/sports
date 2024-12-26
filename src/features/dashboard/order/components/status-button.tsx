"use client";

import { ORDER_STATUS } from "@/constant";
import { RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button";

import { useOrderStatus } from "@/hooks/use-order";

interface StatusButtonProps {
    status: ORDER_STATUS;
    id: string;
}

export const StatusButton = ({ status, id }: StatusButtonProps) => {
    const { onOpen: onOpenOrderStatus } = useOrderStatus();

    return (
        <Button variant="outline" disabled={status === ORDER_STATUS.Delivered || status === ORDER_STATUS.Cancelled} className="flex items-center gap-x-3" onClick={() => onOpenOrderStatus(id, status)}>
            <RefreshCcw className="h-4 w-4" />
            <p>Change Status</p>
        </Button>
    )
}