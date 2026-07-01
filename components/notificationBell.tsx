"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2 } from "lucide-react";

import { useNotifications } from "@/lib/notifications/useNotifications";

export default function NotificationBell() {
  const {
    notifications,
    unread,
    deleteNotification,
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell/>

          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 text-xs w-4 h-4">
              {unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 p-0">
        <div className="p-3 font-semibold">Notifications</div>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            notifications.map((n: any) => (
              <div
                key={n._id}
                className="p-3 flex justify-between hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteNotification(n._id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}