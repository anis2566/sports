import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api.category)[":id"]["toggleGenre"]["$put"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.category)[":id"]["toggleGenre"]["$put"]
>;

interface UseToggleGenreProps {
    onClose: () => void;
}

export const useToggleGenre = ({ onClose }: UseToggleGenreProps) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.category[":id"]["toggleGenre"]["$put"]({
                json,
                param: { id: param.id },
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                onClose();
                queryClient.invalidateQueries({ queryKey: ["categories"] });
            }

            if ("error" in data) {
                toast.error(data.error, {
                    duration: 5000,
                });
            }
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 5000,
            });
        },
    });

    return mutation;
};
