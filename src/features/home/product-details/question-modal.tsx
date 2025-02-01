"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { LoadingButton } from "@/components/loading-button";
import { useAddQuestion } from "@/hooks/use-question";
import { QuestionSchema } from "../products/schemas";
import { QuestionSchemaType } from "../products/schemas";
import { useCreateQuestion } from "./api/use-create-question";

export const QuestionModal = () => {
    const { isOpen, productId, onClose } = useAddQuestion();

    useEffect(() => {
        if (isOpen) {
            form.reset({
                question: "",
                productId: productId,
            });
        }
    }, [isOpen]);

    const form = useForm<QuestionSchemaType>({
        resolver: zodResolver(QuestionSchema),
        defaultValues: {
            question: "",
            productId: productId,
        },
    });

    const { mutate: createQuestion, isPending } = useCreateQuestion({ onClose, form });

    const onSubmit = (values: QuestionSchemaType) => {
        createQuestion({
            json: values,
            param: { id: productId },
        });
    }

    return (
        <Dialog open={isOpen || !!productId} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ask a question</DialogTitle>
                    <DialogDescription>
                        Ask a question about this product
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Ask a question about this book" rows={5} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            className="w-full"
                            isLoading={isPending}
                            title="Submit"
                            loadingTitle="Submitting..."
                            onClick={form.handleSubmit(onSubmit)}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};