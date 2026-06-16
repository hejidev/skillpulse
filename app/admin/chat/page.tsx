"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Bot,
  Search,
  User,
  Zap,
  Phone,
  Mail,
  Clock,
  Send,
  Sparkles,
  Shield,
} from "lucide-react";

/* ================= MOCK CONVERSATIONS ================= */
const conversations = [
  {
    id: "C-1001",
    user: "John Doe",
    email: "john@email.com",
    status: "active",
    messages: [
      { sender: "user", text: "My account is locked" },
      { sender: "agent", text: "Checking your account now..." },
    ],
  },
  {
    id: "C-1002",
    user: "Sarah Johnson",
    email: "sarah@email.com",
    status: "waiting",
    messages: [{ sender: "user", text: "Payment failed again" }],
  },
];

export default function LiveChatOS() {
  const [convos] = useState(conversations);
  const [active, setActive] = useState(conversations[0]);
  const [reply, setReply] = useState("");

  const sendMessage = () => {
    if (!reply) return;

    setActive({
      ...active,
      messages: [
        ...active.messages,
        { sender: "agent", text: reply },
      ],
    });

    setReply("");
  };

  return (
    <div className="h-[90vh] grid grid-cols-12 gap-4">

      {/* ================= LEFT: INBOX ================= */}
      <Card className="col-span-3 p-4 bg-card/40 backdrop-blur-xl flex flex-col">

        {/* SEARCH */}
        <div className="flex items-center gap-2 mb-4">
          <Search size={16} />
          <Input placeholder="Search conversations..." />
        </div>

        {/* CONVERSATIONS */}
        <div className="space-y-3 overflow-auto flex-1">

          {convos.map((c) => (
            <div
              key={c.id}
              onClick={() => setActive(c)}
              className="p-3 rounded-xl border cursor-pointer hover:bg-accent transition"
            >

              <div className="flex justify-between">
                <p className="font-medium text-sm">{c.user}</p>
                <Badge variant="outline">{c.status}</Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                {c.email}
              </p>

              <p className="text-xs mt-2 text-muted-foreground">
                {c.messages[c.messages.length - 1].text}
              </p>

            </div>
          ))}

        </div>

      </Card>

      {/* ================= CENTER: CHAT ================= */}
      <Card className="col-span-6 flex flex-col bg-card/40 backdrop-blur-xl">

        {/* HEADER */}
        <div className="p-4 border-b border-border flex justify-between items-center">

          <div>
            <h2 className="font-semibold">{active.user}</h2>
            <p className="text-xs text-muted-foreground">
              {active.email}
            </p>
          </div>

          <Badge className="bg-primary/10 text-primary">
            Live Chat
          </Badge>

        </div>

        {/* CHAT STREAM */}
        <div className="flex-1 p-4 space-y-3 overflow-auto">

          {active.messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.sender === "agent"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl text-sm max-w-[70%] ${
                  m.sender === "agent"
                    ? "bg-primary text-white"
                    : "bg-background border"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-border flex gap-2">

          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a message..."
          />

          <Button onClick={sendMessage}>
            <Send size={16} />
          </Button>

        </div>

      </Card>

      {/* ================= RIGHT: INTELLIGENCE PANEL ================= */}
      <div className="col-span-3 space-y-4">

        {/* CUSTOMER PROFILE */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl">

          <div className="flex items-center gap-2">
            <User size={16} />
            <h3 className="font-semibold">Customer Profile</h3>
          </div>

          <div className="mt-3 space-y-2 text-sm text-muted-foreground">

            <p>👤 {active.user}</p>
            <p>📧 {active.email}</p>
            <p>📦 Plan: Premium User</p>
            <p>📍 Location: Nigeria</p>

          </div>

        </Card>

        {/* AI COPILOT */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl">

          <div className="flex items-center gap-2">
            <Bot className="text-primary" />
            <h3 className="font-semibold">AI Copilot</h3>
          </div>

          <div className="mt-3 p-3 bg-background border rounded-xl text-sm">
            “Customer is experiencing authentication issues.
            Suggest password reset or token refresh.”
          </div>

          <Button className="w-full mt-3" variant="outline">
            Insert AI Reply
          </Button>

        </Card>

        {/* ACTIONS */}
        <Card className="p-4 space-y-2 bg-card/40 backdrop-blur-xl">

          <h3 className="font-semibold">Actions</h3>

          <Button className="w-full" variant="outline">
            Assign Agent
          </Button>

          <Button className="w-full" variant="outline">
            Convert to Ticket
          </Button>

          <Button className="w-full" variant="outline">
            Mark Resolved
          </Button>

        </Card>

        {/* LIVE STATUS */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl">

          <div className="flex items-center gap-2 text-green-400">
            <Zap size={14} />
            <p className="text-sm">Realtime Socket Active</p>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Messages syncing instantly
          </p>

        </Card>

      </div>

    </div>
  );
}