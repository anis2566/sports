"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { LoadingButton } from "@/components/loading-button"

import { useAnswerQuestion } from "@/hooks/use-question"
import { MessageCircleQuestion } from "lucide-react"
import { useCreateAnswer } from "../../product/api/use-create-answer"

const ReplySchema = z.object({
    answer: z.string().min(1, { message: "Reply is required" })
})


export const QuestionReplyModal = () => {
    const { isOpen, questionId, question, onClose } = useAnswerQuestion()

    const form = useForm<z.infer<typeof ReplySchema>>({
        resolver: zodResolver(ReplySchema),
        defaultValues: {
            answer: ""
        },
    })

    const { mutate: createAnswer, isPending } = useCreateAnswer({
        onClose,
        form,
    })

    function onSubmit(values: z.infer<typeof ReplySchema>) {
        createAnswer({
            json: {
                answer: values.answer,
            },
            param: { id: questionId },
        })
    }

    return (
        <Dialog open={isOpen && !!questionId} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reply Question</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center gap-x-2">
                            <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                                <MessageCircleQuestion className="w-4 h-4 text-primary" />
                            </div>
                            <p>{question}</p>
                        </div>

                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reply</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} placeholder="Enter your reply..." {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            isLoading={isPending}
                            title="Reply"
                            loadingTitle="Replying..."
                            onClick={() => form.handleSubmit(onSubmit)}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}