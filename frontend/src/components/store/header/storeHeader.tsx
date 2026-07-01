import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/types";
import {
  Circle,
  CustomerSupportIcon,
  LoaderCircle,
  Search,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";
import Avatar from "./avatar";
import NotificationDropdown from "./NotificationDropdown";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { Store } from "@/types/store.types";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import useUpdateStoreStatus from "@/features/store/hooks/useUpdateStoreStatus";
import { toast } from "sonner";

type Props = {
  user: User;
  store: Store | undefined;
};

const StoreHeader = ({ user, store }: Props) => {
  const { mutate, isPending, isError } = useUpdateStoreStatus();

  if (isError) {
    toast.error("Failed to update store status");
  }

  return (
    <div className="sticky top-0 z-50 backdrop-blur-2xl bg-secondary/20 flex items-center justify-between gap-2 p-2 border-border border-b w-full">
      <div className="flex items-center gap-2 ">
        <SidebarTrigger className="size-8" />
        <Separator orientation="vertical" />
        <h1 className="text-base font-medium">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupAddon>
            <HugeiconsIcon icon={Search} />
          </InputGroupAddon>
          <InputGroupInput type="text" placeholder="Search" />
        </InputGroup>
        {store ? (
          <Select
            value={store?.status}
            onValueChange={() => {
              mutate({ id: store.id });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Store Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Store Status</SelectLabel>
                <SelectItem value={"OPEN"}>
                  {isPending ? (
                    <span className="text-sm">
                      <HugeiconsIcon
                        icon={LoaderCircle}
                        className="animate-spin"
                      />
                    </span>
                  ) : (
                    <span className="text-sm">
                      <HugeiconsIcon icon={Circle} fill={"green"} size={12} />
                    </span>
                  )}
                  OPEN
                </SelectItem>
                <SelectItem value={"CLOSED"}>
                  {isPending ? (
                    <span className="text-sm">
                      <HugeiconsIcon
                        icon={LoaderCircle}
                        className="animate-spin"
                      />
                    </span>
                  ) : (
                    <span className="text-sm">
                      <HugeiconsIcon icon={Circle} fill={"red"} size={12} />
                    </span>
                  )}{" "}
                  CLOSED
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Skeleton className="h-full w-20" />
        )}
        <NotificationDropdown />
        <Button variant={"ghost"} asChild className="aspect-square p-2 h-full">
          <Link to={"/store/dashboard"}>
            <HugeiconsIcon className="size-5" icon={CustomerSupportIcon} />
          </Link>
        </Button>
        <Avatar user={user} />
      </div>
    </div>
  );
};

export default StoreHeader;
