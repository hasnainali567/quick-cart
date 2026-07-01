import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { mockNotifications, typeIcon, timeAgo } from "@/lib/notifications";
import type { Notification as NotificationType } from "@/types/notification.types";

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: !n.isRead } : n
      )
    );
  };

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Stay updated with your store activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-sm transition-colors ${
                filter === "unread"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="mr-1.5" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-1">
          {filtered.map((notif, i) => (
            <NotificationRow
              key={notif.id}
              notif={notif}
              onToggleRead={toggleRead}
              showBorder={i < filtered.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type RowProps = {
  notif: NotificationType;
  onToggleRead: (id: string) => void;
  showBorder: boolean;
};

const NotificationRow = ({ notif, onToggleRead, showBorder }: RowProps) => {
  return (
    <div
      onClick={() => onToggleRead(notif.id)}
      className={`flex gap-3 px-4 py-3.5 rounded-lg transition-colors cursor-pointer hover:bg-muted/50 ${
        !notif.isRead ? "bg-muted/20" : ""
      } ${showBorder ? "border-b border-border/50" : ""}`}
    >
      <div
        className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${
          !notif.isRead
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <HugeiconsIcon icon={typeIcon[notif.type]} size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm ${
              !notif.isRead ? "font-semibold" : "font-medium"
            }`}
          >
            {notif.title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground/60">
              {timeAgo(notif.createdAt)}
            </span>
            {!notif.isRead && (
              <span className="size-2 shrink-0 rounded-full bg-primary" />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {notif.body}
        </p>
      </div>
    </div>
  );
};

export default Notifications;
