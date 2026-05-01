"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { Bell, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function NotificationBell() {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await API.get("/settings/notifications");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unread = data.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    await API.put(`/settings/notifications/${id}/read`);
    fetchData();
  };

  const archive = async (id: string) => {
    await API.put(`/settings/notifications/${id}/archive`);
    fetchData();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell />

          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 text-xs">
              {unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96 p-0">
        <div className="p-3 font-semibold">Notifications</div>
        <Separator />

        <ScrollArea className="h-80">
          {data.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            data.map((n) => (
              <div
                key={n._id || n.id || `${n.message}-${n.createdAt}`}
                className="p-3 flex justify-between hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!n.read && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => markRead(n._id)}
                    >
                      ✓
                    </Button>
                  )}

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => archive(n._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}