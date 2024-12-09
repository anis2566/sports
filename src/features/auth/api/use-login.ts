import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { SIGN_IN_USER_ACTION } from "../server/action";

interface UseLoginProps {
  callbackUrl: string;
}

export function useLogin({ callbackUrl }: UseLoginProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: SIGN_IN_USER_ACTION,
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error, {
          duration: 5000,
        });
      }

      if (data?.success) {
        toast.success(data.success, {
          duration: 5000,
        });
        router.push(`/redirect?redirectUrl=${callbackUrl}`);
      }
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 5000,
      });
    },
  });

  return mutation;
}
