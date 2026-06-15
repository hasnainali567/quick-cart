import React from "react";
import {
  Sheet as BaseSheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SheetProps<T> = {
  data: T;
  children: (data: T) => React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  title: string;
  description: string;
  position?: "left" | "right" | "top" | "bottom";
};

const Sheet = <T,>({
  children,
  open,
  onOpenChange,
  data,
  trigger,
  title,
  description,
  position = "right",
}: SheetProps<T>) => {
  return (
    <BaseSheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent className={cn("gap-0")} side={position}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children(data)}
      </SheetContent>
    </BaseSheet>
  );
};

export default Sheet;
