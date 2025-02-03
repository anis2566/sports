import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { useSellerRegisterSuccess } from "@/hooks/use-seller";

type ResponseType = InferResponseType<typeof client.api.seller.register.$post>;
type RequestType = InferRequestType<typeof client.api.seller.register.$post>["json"];

export const useRegisterSeller = () => {
    const { onOpen } = useSellerRegisterSuccess();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.seller.register.$post({ json });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                onOpen();
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
