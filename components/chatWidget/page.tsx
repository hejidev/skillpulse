"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
      >
        <MessageCircle />
      </button>

      {/* CHAT PANEL */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80">

          <Card className="p-4 bg-card/80 backdrop-blur-xl space-y-3">

            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Support Chat</h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="h-64 overflow-y-auto text-sm text-muted-foreground">
              <p>👋 Hello! How can we help you today?</p>
            </div>

            <div className="flex gap-2">
              <Input placeholder="Type message..." />
              <Button>Send</Button>
            </div>

          </Card>

        </div>
      )}
    </>
  );
}