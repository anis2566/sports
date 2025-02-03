"use client"

import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"

import { useLogout } from "@/features/auth/api/use-logout";
import { useSellerRegisterSuccess } from "@/hooks/use-seller";

export const RegisterSuccessModal = () => {
    const { isOpen, onClose } = useSellerRegisterSuccess();

    const { mutate: logout, isPending } = useLogout("/seller?callbackUrl=/seller");

    const handleClick = () => {
        logout();
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 text-emerald-500 animate-success-bounce">
                        <CheckCircle size={48} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Registration Successful!
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Thank you for joining us! You need login to switch your access.
                    </p>

                    <Button className="w-full" onClick={handleClick} disabled={isPending}>Switch Access</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}