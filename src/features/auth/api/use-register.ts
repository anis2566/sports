import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { REGISTER_USER_ACTION } from "../server/action";

interface UseRegisterProps {
  redirectUrl?: string;
}

export function useRegister({ redirectUrl }: UseRegisterProps) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: REGISTER_USER_ACTION,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success, {
          duration: 5000,
        });

        if (redirectUrl) {
          router.push(`/redirect?redirectUrl=${redirectUrl}`);
        } else {
          router.push("/");
        }
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

  return mutation;
}
