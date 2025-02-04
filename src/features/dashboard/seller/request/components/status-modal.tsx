"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useSellerStatus } from "@/hooks/use-seller";
import { STATUS } from "@/constant";
import { LoadingButton } from "@/components/loading-button";
import { useUpdateSellerStatus } from "../../api/use-update-status";

const formSchema = z.object({
    status: z.nativeEnum(STATUS)
        .refine((val) => Object.values(STATUS).includes(val), {
            message: "required",
        }),
});

type FormSchema = z.infer<typeof formSchema>;

export const SellerStatusModal = () => {
    const { isOpen, id, status, onClose } = useSellerStatus();

    const { mutate: updateStatus, isPending } = useUpdateSellerStatus({ onClose });

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: status || undefined,
        },
    });

    useEffect(() => {
        form.reset({
            status: status || undefined,
        });
    }, [status, isOpen]);

    const onSubmit = (data: FormSchema) => {
        updateStatus({
            json: { status: data.status },
            param: { id },
        });
    }

    return (
        <Dialog open={isOpen && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Seller Status</DialogTitle>
                    <DialogDescription>Manage seller status</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(STATUS).map((status) => (
                                                    <SelectItem key={status} value={status} disabled={status === STATUS.Pending}>{status}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Update"
                            loadingTitle="Updating..."
                            onClick={form.handleSubmit(onSubmit)}
                            isLoading={isPending}
                            className="w-full"
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}