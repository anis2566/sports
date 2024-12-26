"use client"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { LoadingButton } from "@/components/loading-button";
import { useDeleteBanner as useDeleteBannerApi } from "../api/use-delete-banner";
import { useDeleteBanner } from "@/hooks/use-banner";

export const DeleteBannerModal = () => {
    const { isOpen, bannerId, onClose } = useDeleteBanner();

    const { mutate, isPending } = useDeleteBannerApi({ onClose });

    const handleDelete = () => {
        mutate({ param: { id: bannerId } });
    }

    return (
        <AlertDialog open={isOpen && !!bannerId} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your banner
                        and remove your data from servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <LoadingButton
                        isLoading={isPending}
                        title="Delete"
                        loadingTitle="Deleting..."
                        onClick={handleDelete}
                        variant="destructive"
                        type="button"
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}