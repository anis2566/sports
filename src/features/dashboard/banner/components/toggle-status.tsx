"use client";

import { Switch } from "@/components/ui/switch"

import { useUpdateBanner } from "../api/use-update-banner";
import { PRODUCT_STATUS } from "@/constant";

interface Props {
    id: string;
    status: PRODUCT_STATUS;
}

export const ToggleStatus = ({ id, status }: Props) => {
    const { mutate, isPending } = useUpdateBanner();

    const handleToggle = () => {
        mutate({ param: { id }, json: { status: status === PRODUCT_STATUS.Active ? PRODUCT_STATUS.Inactive : PRODUCT_STATUS.Active } });
    }

    return (
        <Switch id={id} checked={status === PRODUCT_STATUS.Active} onCheckedChange={handleToggle} disabled={isPending} />
    )
}