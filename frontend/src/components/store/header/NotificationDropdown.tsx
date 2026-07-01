import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";
import { mockNotifications, typeIcon, timeAgo } from "@/lib/notifications";

const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
const recent = mockNotifications.slice(0, 5);

const NotificationDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="aspect-square p-2 h-full relative"
        >
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 min-w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
          <HugeiconsIcon className="size-5" icon={Bell} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
      >
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} unread
            </span>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {recent.map((notif) => (
            <div
              key={notif.id}
              className={`flex gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50 cursor-pointer ${
                !notif.isRead ? "bg-muted/30" : ""
              }`}
            >
              <div
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                  !notif.isRead
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <HugeiconsIcon icon={typeIcon[notif.type]} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      !notif.isRead ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {notif.body}
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                  {timeAgo(notif.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <DropdownMenuSeparator />
        <Button
          variant="ghost"
          className="w-full rounded-none text-sm text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/store/notifications">See All Notifications</Link>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
