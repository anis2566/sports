"use client"

import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useAddQuestion } from "@/hooks/use-question";
import { useGetQuestions } from "./api/use-get-questions";

interface QuestionsProps {
    productId: string;
}

export const Questions = ({ productId }: QuestionsProps) => {
    const { onOpen } = useAddQuestion();

    const { questions, fetchNextPage, hasNextPage, isFetching, status } = useGetQuestions(productId);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <p className="text-xl font-bold">Question & Answer</p>
                    <Button variant="outline" onClick={() => onOpen(productId)}>
                        Ask Question
                    </Button>
                </CardTitle>
                <CardDescription>Ask a question about this book</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    {hasNextPage && (
                        <Button
                            variant="link"
                            className="mx-auto block"
                            disabled={isFetching}
                            onClick={() => fetchNextPage()}
                        >
                            Load previous
                        </Button>
                    )}
                    {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
                    {status === "success" && !questions.length && (
                        <p className="text-center text-muted-foreground">
                            No questions yet.
                        </p>
                    )}
                    {status === "error" && (
                        <p className="text-center text-destructive">
                            An error occurred while loading questions.
                        </p>
                    )}
                    <div className="space-y-4">
                        {questions.map((question) => (
                            <div key={question.id} className="space-y-2">
                                <div className="flex space-x-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={question.user.image || ""}
                                            alt={question.user.name || ""}
                                        />
                                        <AvatarFallback>
                                            {question.user.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{question.user.name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(question.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-700">{question.question}</p>
                                    </div>
                                </div>
                                {question.answers.map((answer) => (
                                    <div className="ml-12 space-y-4" key={answer.id}>
                                        <div className="flex space-x-4">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={answer.user.image || ""}
                                                    alt={answer.user.name || ""}
                                                />
                                                <AvatarFallback>
                                                    {answer.user.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold">{answer.user.name}</h4>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDistanceToNow(new Date(answer.createdAt), {
                                                            addSuffix: true,
                                                        })}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-700">{answer.answer}</p>
                                                <div className="flex items-center space-x-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}