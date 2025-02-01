import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { ReviewSchema } from "@/features/home/products/schemas";

type ResponseType = InferResponseType<
  (typeof client.api.review)[":productId"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.review)[":productId"]["$post"]
>;

interface UseCreateReviewProps {
  onClose: () => void;
  form: UseFormReturn<z.infer<typeof ReviewSchema>>;
}

export const useCreateReview = ({ onClose, form }: UseCreateReviewProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.review[":productId"]["$post"]({
        json: json,
        param: { productId: param.productId },
      });
      return await res.json();
    },
    onSuccess: (data) => {
      if ("success" in data) {
        toast.success(data.success, {
          duration: 5000,
        });
        queryClient.invalidateQueries({ queryKey: ["reviews"] });
        form.reset({
          rating: 0,
          content: "",
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
