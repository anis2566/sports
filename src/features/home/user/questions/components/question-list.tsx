"use client"

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { useGetQuestions } from "@/features/home/user/api/use-get-questions";
import { Header } from "../../reviews/components/header";
import { useUserQuestionView } from "@/hooks/use-question";

export const QuestionList = () => {
    const { onOpen } = useUserQuestionView();

    const { data, isLoading } = useGetQuestions();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                    {data?.questions.length} questions
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {isLoading ? <QuestionListSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>Product</TableHead>
                                <TableHead>Question</TableHead>
                                <TableHead>Answers</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.questions.map((question) => (
                                <TableRow key={question.id}>
                                    <TableCell className="max-w-[200px] truncate">{question.product.name}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">{question.question}</TableCell>
                                    <TableCell>{question.answers.length}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => onOpen(question.question, question.answers.map((answer) => ({ answer: answer.answer, date: answer.createdAt })))}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
                {!isLoading && data?.questions.length === 0 && <EmptyStat title="No questions found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


export const QuestionListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Product</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Answers</TableHead>
                    <TableHead>Actions</TableHead>
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
