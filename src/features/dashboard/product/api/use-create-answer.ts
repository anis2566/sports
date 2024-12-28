import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type Answer = {
    answer: string;
}

type ResponseType = InferResponseType<
    (typeof client.api.product.answer)[":id"]["$post"]
>;
type RequestType = InferRequestType<
    (typeof client.api.product.answer)[":id"]["$post"]
>;

interface UseCreateAnswerProps {
    onClose: () => void;
    form: UseFormReturn<Answer>;
}

export const useCreateAnswer = ({ onClose, form }: UseCreateAnswerProps) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.product.answer[":id"]["$post"]({
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
                queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
                form.reset({
                    answer: "",
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
