import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CREATE_BRAND_ACTION } from "../server/action";

export const useCreateBrand = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: CREATE_BRAND_ACTION,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success, {
          duration: 5000,
        });
        router.push("/dashboard/brand");
      }

      if (data.error) {
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
};
