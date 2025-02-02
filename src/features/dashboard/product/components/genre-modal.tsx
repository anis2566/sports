"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"


import { GENRE } from "@/constant"
import { useChangeGenre } from "@/hooks/use-product"

export const GenreModal = () => {
    const { isOpen, onClose, genre } = useChangeGenre()

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Genre</DialogTitle>
                    <DialogDescription>Change the genre of the product</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4">
                    <div className="">
                        <p className="text-sm font-medium text-green-800">Active Genre</p>
                        {
                            genre.map((genre) => (
                                <div className="flex items-center gap-x-2">
                                    <Switch id={genre} />
                                    <Label htmlFor={genre}>{genre}</Label>
                                </div>
                            ))
                        }
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-red-800">Inactive Genre</p>
                        {
                            Object.values(GENRE).map((genre) => (
                                <div className="flex items-center gap-x-2" key={genre}>
                                    <Switch id={genre} />
                                    <Label htmlFor={genre}>{genre}</Label>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}