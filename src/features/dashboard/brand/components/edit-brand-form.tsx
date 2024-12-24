"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { Send, Trash2 } from "lucide-react"
import { Brand } from "@prisma/client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { LoadingButton } from "@/components/loading-button"
import { BrandSchema, BrandSchemaType } from "../schemas"
import { useUpdateBrand } from "../api/use-update-brand"
import { ImageUploader } from "@/components/ui/image-uploader"

interface Props {
    brand: Brand
}

export const EditBrandForm = ({ brand }: Props) => {
    const { mutate, isPending } = useUpdateBrand()

    const form = useForm<BrandSchemaType>({
        resolver: zodResolver(BrandSchema),
        defaultValues: {
            name: brand.name,
            imageUrl: brand.imageUrl || "",
            description: brand.description || "",
        }
    })

    const onSubmit = (values: BrandSchemaType) => {
        mutate({ json: values, param: { id: brand.id } })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Brand</CardTitle>
                <CardDescription>Edit brand to the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    {
                                        form.watch("imageUrl") ? (
                                            <div className="relative">
                                                <div className="relative aspect-square max-h-[100px]">
                                                    <Image src={form.getValues("imageUrl") || ""} alt="Profile" fill className="object-contain rounded-full" />
                                                </div>
                                                <Button type="button" variant="destructive" className="absolute right-0 top-0" onClick={() => form.setValue("imageUrl", "")}>
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <FormControl>
                                                <ImageUploader
                                                    preset="brands"
                                                    onChange={values => {
                                                        field.onChange(values[0])
                                                    }}
                                                />
                                            </FormControl>
                                        )
                                    }
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            isLoading={isPending}
                            title="Update"
                            loadingTitle="Updating..."
                            onClick={form.handleSubmit(onSubmit)}
                            type="submit"
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )

}