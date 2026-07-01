import { useGetStoreOrdersById } from "@/hooks/use-query";
import { useAcceptOrder, useRejectOrder, useMarkOrderPrepared } from "../api/mutations";

export const useOrderSheet = (orderId: string, onClose: () => void) => {
  const { data: order, isLoading } = useGetStoreOrdersById(orderId);
  const { mutate: acceptOrder, isPending: isAccepting } = useAcceptOrder();
  const { mutate: rejectOrder, isPending: isRejecting } = useRejectOrder();
  const { mutate: markOrderPrepared, isPending: isMarkingPrepared } = useMarkOrderPrepared();

  const handleAccept = () => {
    acceptOrder(orderId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleReject = () => {
    rejectOrder(orderId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleMarkPrepared = () => {
    markOrderPrepared(orderId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return {
    order,
    isLoading,
    isAccepting,
    isRejecting,
    isMarkingPrepared,
    handleAccept,
    handleReject,
    handleMarkPrepared,
  };
};
