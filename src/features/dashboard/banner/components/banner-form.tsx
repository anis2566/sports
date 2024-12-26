"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { PRODUCT_STATUS } from "@/constant";
import { BannerSchema, BannerSchemaType } from "@/features/dashboard/banner/schema";
import { LoadingButton } from "@/components/loading-button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { useCreateBanner } from "../api/use-create-banner";

export const BannerForm = () => {

    const { mutate, isPending } = useCreateBanner();

    const form = useForm<BannerSchemaType>({
        resolver: zodResolver(BannerSchema),
        defaultValues: {
            imageUrl: "",
            status: undefined,
        },
    });

    const onSubmit = (values: BannerSchemaType) => {
        mutate(values);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Banner</CardTitle>
                <CardDescription>Add new banner to the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        {form.getValues("imageUrl") ? (
                                            <div className="relative aspect-video max-h-[200px]">
                                                <Image
                                                    alt="Upload"
                                                    fill
                                                    className="object-cover"
                                                    src={form.getValues("imageUrl")}
                                                />
                                                <Button
                                                    className="absolute right-0 top-0"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => form.setValue("imageUrl", "")}
                                                    type="button"
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="text-rose-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <ImageUploader
                                                preset="banner"
                                                onChange={values => {
                                                    field.onChange(values[0])
                                                }}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(PRODUCT_STATUS).map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            isLoading={isPending}
                            title="Create"
                            loadingTitle="Creating..."
                            type="submit"
                            onClick={() => form.handleSubmit(onSubmit)}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
};