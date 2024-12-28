"use client"

import { MessageCircleQuestion, Package, User } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useViewQuestion, useAnswerQuestion } from "@/hooks/use-question";

export const QuestionViewModal = () => {
    const { question, isOpen, onClose } = useViewQuestion();
    const { onOpen } = useAnswerQuestion();

    const handleReply = () => {
        onClose();
        onOpen(question?.questionId || "", question?.question || "")
    }

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
                            <Package className="w-4 h-4 text-primary" />
                        </div>
                        <p>{question?.productName}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        <p>{question?.userName}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                            <MessageCircleQuestion className="w-4 h-4 text-primary" />
                        </div>
                        <p>{question?.question}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleReply}>
                        <MessageCircleQuestion className="w-4 h-4" />
                        Reply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}