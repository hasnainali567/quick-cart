import { Button } from "@/components/ui/button";
import type { StoreOrder } from "@/types/order.types";

type Props = {
  orderId: string;
  status: StoreOrder["status"];
  onAccept: () => void;
  onReject: () => void;
  onMarkPrepared: () => void;
  isAccepting: boolean;
  isRejecting: boolean;
  isMarkingPrepared: boolean;
};

const OrderActions = ({
  status,
  onAccept,
  onReject,
  onMarkPrepared,
  isAccepting,
  isRejecting,
  isMarkingPrepared,
}: Props) => {
  const isLoading = isAccepting || isRejecting || isMarkingPrepared;

  // Show Accept/Reject for PENDING orders
  if (status === "PENDING") {
    return (
      <div className="sticky bottom-0 w-full flex flex-col gap-2 p-4 bg-background border-t">
        <Button
          className="w-full"
          onClick={onAccept}
          disabled={isLoading}
        >
          {isAccepting ? "Accepting..." : "Accept Order"}
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={onReject}
          disabled={isLoading}
        >
          {isRejecting ? "Rejecting..." : "Reject Order"}
        </Button>
      </div>
    );
  }

  // Show Mark as Prepared for APPROVED orders
  if (status === "APPROVED" || status === "PREPARING") {
    return (
      <div className="sticky bottom-0 w-full flex flex-col gap-2 p-4 bg-background border-t">
        <Button
          className="w-full"
          onClick={onMarkPrepared}
          disabled={isLoading}
        >
          {isMarkingPrepared ? "Updating..." : "Mark as Prepared"}
        </Button>
      </div>
    );
  }

  // For other statuses, just show the status
  return (
    <div className="sticky bottom-0 w-full p-4 bg-background border-t">
      <p className="text-sm text-center text-muted-foreground">
        Order status: <span className="font-semibold">{status}</span>
      </p>
    </div>
  );
};

export default OrderActions;
