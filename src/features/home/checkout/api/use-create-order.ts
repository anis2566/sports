import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { useCart } from "@/hooks/use-cart";

type ResponseType = InferResponseType<typeof client.api.order.$post>;
type RequestType = InferRequestType<
    typeof client.api.order.$post
>["json"];

export const useCreateOrder = () => {
    const router = useRouter();
    const { resetCart } = useCart()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.order.$post({ json });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                resetCart()
                router.push(`/invoice/${data.id}`);
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
