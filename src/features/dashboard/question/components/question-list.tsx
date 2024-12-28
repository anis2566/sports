"use client"

import { Eye, MessageCircleReply, MoreVerticalIcon, Trash2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetQuestionsAdmin } from "../../product/api/use-get-questions-admin";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { Header } from "../../brand/components/header";
import { useViewQuestion, useDeleteQuestion, useAnswerQuestion } from "@/hooks/use-question";

export const QuestionList = () => {
    const { onOpen } = useViewQuestion();
    const { onOpen: onOpenDeleteQuestion } = useDeleteQuestion();
    const { onOpen: onOpenAnswerQuestion } = useAnswerQuestion();

    const { data, isLoading } = useGetQuestionsAdmin();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Question</CardTitle>
                <CardDescription>Question List</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? <QuestionListSkeleton /> :
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>Product</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Answers</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell className="max-w-[200px] truncate">{question.product.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-3">
                                                <Avatar>
                                                    <AvatarImage src={question.user.image || ""} alt={question.user.name || ""} />
                                                    <AvatarFallback>
                                                        {question.user.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p>{question.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {question.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{question.question}</TableCell>
                                        <TableCell>{question.answers.length}</TableCell>
                                        <TableCell>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent side="right" className="p-2 max-w-[180px]">
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full" onClick={() => onOpen({
                                                        productName: question.product.name,
                                                        userName: question.user.name || "",
                                                        question: question.question,
                                                        questionId: question.id
                                                    })}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full" onClick={() => onOpenAnswerQuestion(question.id, question.question)}>
                                                        <MessageCircleReply className="w-4 h-4 mr-2" />
                                                        Answer
                                                    </Button>
                                                    <Button variant="ghost" className="flex items-center justify-start gap-x-2 w-full text-red-500 hover:text-red-400" onClick={() => onOpenDeleteQuestion(question.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                }
                {!isLoading && data?.totalCount === 0 && <EmptyStat title="No reviews found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
};


export const QuestionListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Product</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}