import React from "react";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type DialogProps = {
  /** Element that opens the dialog when clicked */
  trigger?: React.ReactNode;
  /** Dialog heading */
  title: string;
  /** Optional subheading rendered below the title */
  description?: string;
  /** Dialog body content */
  children: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Called when the dialog requests to open/close */
  onOpenChange?: (open: boolean) => void;
  /** Extra className forwarded to DialogContent */
  contentClassName?: string;
};

const Dialog = ({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  contentClassName,
}: DialogProps) => {
  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          <span>{trigger}</span>
        </DialogTrigger>
      )}
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </BaseDialog>
  );
};

export default Dialog;
export type { DialogProps };
