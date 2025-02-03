"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Store, Trash, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { UploadButton } from "@/components/uploadthing"
import { LoadingButton } from "@/components/loading-button"

import { SellerSchema, SellerSchemaType } from "../schema"
import { useRegisterSeller } from "../api/use-register-seller"

export const RegisterForm = () => {
    const { mutate: registerSeller, isPending } = useRegisterSeller();

    const form = useForm<SellerSchemaType>({
        resolver: zodResolver(SellerSchema),
        defaultValues: {
            name: "",
            businessName: "",
            phone: "",
            email: "",
            address: "",
            documentUrl: "",
            imageUrl: "",
            bio: "",
        },
    })

    const onSubmit = (data: SellerSchemaType) => {
        registerSeller(data);
    }

    return (
        <Card className="w-full max-w-3xl">
            <CardContent className="p-8">
                <div className="flex items-center justify-center mb-4">
                    <Store className="h-12 w-12 text-primary" />
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                    Seller Registration
                </h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
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
                            control={form.control}
                            name="businessName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
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
                                                    <Image src={form.getValues("imageUrl")} alt="Profile" fill className="object-contain rounded-full" />
                                                </div>
                                                <Button type="button" variant="destructive" className="absolute right-0 top-0" onClick={() => form.setValue("imageUrl", "")}>
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <FormControl>
                                                <UploadButton
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        field.onChange(res[0].url);
                                                        toast.success("Image uploaded");
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error("Image upload failed");
                                                    }}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                        )
                                    }
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="documentUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Attachment</FormLabel>
                                    <FormControl>
                                        {field.value ? (
                                            <div className="flex items-center gap-x-3">
                                                <Link href={field.value} target="_blank" className="hover:underline">
                                                    View File
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => form.setValue("documentUrl", "")}
                                                    type="button"
                                                    disabled={isPending}
                                                >
                                                    <Trash className="text-rose-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <UploadButton
                                                endpoint="pdfUploader"
                                                onClientUploadComplete={(res) => {
                                                    field.onChange(res[0].url);
                                                    toast.success("Attachment uploaded");
                                                }}
                                                onUploadError={() => {
                                                    toast.error("Attachment upload failed");
                                                }}
                                                disabled={isPending}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Register"
                            loadingTitle="Registering..."
                            onClick={form.handleSubmit(onSubmit)}
                            className="w-full"
                            isLoading={isPending}
                            variant="default"
                            icon={ArrowRight}
                        />

                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
