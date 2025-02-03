import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { SetStateAction, Dispatch } from "react";

type ResponseType = InferResponseType<typeof client.api.subscriber.$post>;
type RequestType = InferRequestType<typeof client.api.subscriber.$post>["json"];

interface UseCreateSubscriberProps {
    setIsSubmitted: Dispatch<SetStateAction<boolean>>;
}

export const useCreateSubscriber = ({ setIsSubmitted }: UseCreateSubscriberProps) => {
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.subscriber.$post({ json });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                setIsSubmitted(true);
            }

            if ("error" in data) {
                toast.error(data.error, {
                    duration: 5000,
                });
                setIsSubmitted(false);
            }
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 5000,
            });
            setIsSubmitted(false);
        },
    });

    return mutation;
};
