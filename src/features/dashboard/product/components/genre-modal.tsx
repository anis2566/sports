"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { GENRE } from "@/constant"
import { useChangeGenre } from "@/hooks/use-product"
import { useToggleGenre } from "../api/use-toggle-genre"

export const GenreModal = () => {
    const { isOpen, onClose, genre, productId } = useChangeGenre()

    const { mutate: toggleGenre, isPending } = useToggleGenre({ onClose })

    const handleToggleGenre = (genre: string, status: boolean) => {
        toggleGenre({ param: { id: productId }, json: { genre, status } })
    }

    const inactiveGenre = Object.values(GENRE).filter((g) => !genre.includes(g))

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Genre</DialogTitle>
                    <DialogDescription>Change the genre of the product</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4">
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-green-800">Active Genre</p>
                        {
                            genre.map((genre, index) => (
                                <div className="flex items-center gap-x-2" key={index}>
                                    <Switch disabled={isPending} id={genre} checked={true} onCheckedChange={(checked) => handleToggleGenre(genre, checked)} />
                                    <Label htmlFor={genre}>{genre}</Label>
                                </div>
                            ))
                        }
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-red-800">Inactive Genre</p>
                        {
                            inactiveGenre.map((genre, index) => (
                                <div className="flex items-center gap-x-2" key={index}>
                                    <Switch disabled={isPending} id={genre} checked={false} onCheckedChange={(checked) => handleToggleGenre(genre, checked)} />
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