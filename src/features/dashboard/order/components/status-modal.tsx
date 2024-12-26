"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ORDER_STATUS } from "@/constant";
import { useEffect } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { LoadingButton } from "@/components/loading-button";
import { useOrderStatus } from "@/hooks/use-order";
import { useUpdateOrderStatus } from "@/features/dashboard/order/api/use-update-order-status";

const formSchema = z.object({
    status: z.nativeEnum(ORDER_STATUS)
        .refine((val) => Object.values(ORDER_STATUS).includes(val), {
            message: "required",
        }),
});

export const OrderStatusModal = () => {
    const { isOpen, orderId, onClose, status } = useOrderStatus();

    const { mutate, isPending } = useUpdateOrderStatus({ onClose });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: status || undefined,
        },
    });

    useEffect(() => {
        if (status) {
            form.reset({
                status: status,
            });
        }
    }, [status])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        mutate({
            json: {
                status: values.status,
            },
            param: {
                id: orderId,
            },
        });
    };

    return (
        <Dialog open={isOpen && !!orderId} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order Status</DialogTitle>
                    <DialogDescription>Change the status of the order</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        {...field}
                                        onValueChange={(value) => field.onChange(value as ORDER_STATUS)}
                                        defaultValue={field.value}
                                        disabled={isPending}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(ORDER_STATUS).map((status) => (
                                                    <SelectItem value={status} key={status} disabled={status === field.value}>
                                                        {status}
                                                    </SelectItem>
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
                            title="Update"
                            loadingTitle="Updating..."
                            onClick={form.handleSubmit(onSubmit)}
                            type="submit"
                        />

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};