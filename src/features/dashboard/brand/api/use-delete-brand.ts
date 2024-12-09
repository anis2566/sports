import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { DELETE_BRAND_ACTION } from "../server/action";

interface UseDeleteBrandProps {
  onClose: () => void;
}

export const useDeleteBrand = ({ onClose }: UseDeleteBrandProps) => {
  return useMutation({
    mutationFn: DELETE_BRAND_ACTION,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success, { duration: 5000 });
        onClose();
      }

      if (data.error) {
        toast.error(data.error, { duration: 5000 });
      }
    },
    onError: (error) => {
      toast.error(error.message, { duration: 5000 });
    },
  });
};
