import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { QuestionSchema } from "@/features/home/products/schemas";

type ResponseType = InferResponseType<
    (typeof client.api.question)[":id"]["$post"]
>;
type RequestType = InferRequestType<
    (typeof client.api.question)[":id"]["$post"]
>;

interface UseCreateQuestionProps {
    onClose: () => void;
    form: UseFormReturn<z.infer<typeof QuestionSchema>>;
}

export const useCreateQuestion = ({ onClose, form }: UseCreateQuestionProps) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.question[":id"]["$post"]({
                json: json,
                param: { id: param.id },
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                queryClient.invalidateQueries({ queryKey: ["questions"] });
                form.reset({
                    question: "",
                    productId: "",
                });
                onClose();
                router.refresh();
            }

            if ("error" in data) {
                toast.error(data.error, {
                    duration: 5000,
                });
            }
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message, {
                duration: 5000,
            });
        },
    });

    return mutation;
};
