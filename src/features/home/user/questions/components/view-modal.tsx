"use client"

import { MessageCircleQuestion } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { useUserQuestionView } from "@/hooks/use-question";

export const UserQuestionViewModal = () => {
    const { question, isOpen, onClose, answers } = useUserQuestionView();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Question</DialogTitle>
                    <DialogDescription>Question Details</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                            <MessageCircleQuestion className="w-4 h-4 text-primary" />
                        </div>
                        <p>{question}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Answers</p>
                        {answers?.map((answer, index) => (
                            <div className="flex items-center gap-x-2" key={index}>
                                <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                                    {index + 1}
                                </div>
                                <p>{answer.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}