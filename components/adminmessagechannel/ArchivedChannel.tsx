// components/messages/ArchivedChannel.tsx

"use client";

import {
  Archive,
} from "lucide-react";
import MessageCard from "./MessageCard";
import { useEffect, useState } from "react";

interface Props {
  messages: any[];
}

export default function ArchivedChannel({
  messages,
}: Props) {

 const [user, setUser] = useState<any>(null);

useEffect(() => {
  const stored =
    localStorage.getItem("user");

  if (stored) {
    setUser(JSON.parse(stored));
  }
}, []);

const archived = messages.filter(
  (msg) =>
    msg.category === "archived" &&
    msg.archivedBy?.includes(user?._id)
);

  return (
    <div className="space-y-6">

      <div className="bg-background border border-border rounded-3xl p-6 flex items-center gap-4">

        <Archive className="text-cyan-400" />

        <div>

          <h2 className="text-2xl font-black">
            Archived Messages
          </h2>

          <p className="text-muted-foreground text-sm">
            Stored broadcasts and resolved alerts
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {archived.map((item, index) => (
          <MessageCard
            key={`${item._id}-${index}`}
            item={item}
          />
        ))}

      </div>

    </div>
  );
}