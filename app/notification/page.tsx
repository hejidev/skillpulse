"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCheck } from "lucide-react";

import { useNotifications } from "@/lib/notifications/useNotifications";

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    unread,
    deleteNotification,
    clearAll,
    markAllRead,
  } = useNotifications();

  if (loading) {
    return (
      <div className="p-10">
        <Card>
          <CardContent>Loading notifications...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 space-y-4 p-4">

      {/* HEADER */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Notifications
            <Badge variant="secondary">{unread} unread</Badge>
          </CardTitle>

          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all
            </Button>

            <Button variant="destructive" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* LIST */}
      <Card>
        <CardContent>
          <ScrollArea className="h-125 pr-3">

            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                No notifications yet
              </p>
            ) : (
              <div className="space-y-3">

                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`flex items-start justify-between p-4 rounded-lg border ${
                      n.read ? "opacity-60" : "bg-muted/40"
                    }`}
                  >

                    <div>
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNotification(n._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>

                  </div>
                ))}

              </div>
            )}

          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}