"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { socket, socketService } from "@/lib/socket";

import {
  getAllTickets,
  replyTicket,
  resolveTicket,
} from "@/lib/api/tickets";


import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Search,
  Bot,
  Zap,
  AlertTriangle,
  Clock,
  Inbox,
  CheckCircle2,
} from "lucide-react";

/* ================= TYPES ================= */
type TicketStatus = "open" | "pending" | "resolved";
type Priority = "low" | "medium" | "high" | "urgent";

interface Message {
  sender: "user" | "admin";
  message: string;
  createdAt?: string;
}

interface Ticket {
  _id: string;
  name: string;
  email: string;
  subject: string;
  status: TicketStatus;
  priority: Priority;
  category?: string;
  messages: Message[];
  createdAt?: string;
}

/* ================= MAIN ================= */
export default function TicketOS() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeId, setActiveId] = useState("");
  const [reply, setReply] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [typing, setTyping] = useState(false);
  const typingTimeout = useRef<any>(null);


  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ================= ACTIVE TICKET ================= */
  const active = useMemo(
    () => tickets.find((t) => t._id === activeId),
    [activeId, tickets]
  );

  /* ================= LOAD TICKETS ================= */
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token") || "";

        const res = await getAllTickets(token);

        if (res.success) {
          setTickets(res.tickets || []);

          if (res.tickets?.length > 0) {
            setActiveId(res.tickets[0]._id);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  /* ================= SOCKET CONNECTION ================= */
  useEffect(() => {
    if (!activeId) return;

    socketService.connect();

    socket.emit("joinTicket", activeId);

    console.log("ADMIN JOINED:", activeId);

    return () => {
      socket.emit("leaveTicket", activeId);
    };
  }, [activeId]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socketService.connect();

    const handleConnect = () => {
      console.log("ADMIN SOCKET:", socket.id);
    };

    const handleTicketUpdated = (
      updatedTicket: Ticket
    ) => {
      setTickets((prev) => {
        const exists = prev.find(
          (t) => t._id === updatedTicket._id
        );

        if (!exists) {
          return [updatedTicket, ...prev];
        }

        return prev.map((ticket) =>
          ticket._id === updatedTicket._id
            ? updatedTicket
            : ticket
        );
      });
    };

    const handleTicketCreated = (
      newTicket: Ticket
    ) => {
      setTickets((prev) => {
        const exists = prev.find(
          (t) => t._id === newTicket._id
        );

        if (exists) return prev;

        return [newTicket, ...prev];
      });
    };

    socket.on("connect", handleConnect);

    socket.on(
      "ticketUpdated",
      handleTicketUpdated
    );

    socket.on(
      "ticketCreated",
      handleTicketCreated
    );

    return () => {
      socket.off("connect", handleConnect);

      socket.off(
        "ticketUpdated",
        handleTicketUpdated
      );

      socket.off(
        "ticketCreated",
        handleTicketCreated
      );
    };
  }, []);

  /* ================= TYPING ================= */
  const handleTyping = (value: string) => {
    setReply(value);

    socket.emit("typing", {
      ticketId: activeId,
      sender: "user",
    });

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        ticketId: activeId,
      });
    }, 800);
  };

  useEffect(() => {
    socket.on("typing", () => setTyping(true));
    socket.on("stopTyping", () => setTyping(false));

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  /* ================= SEND REPLY ================= */
  const sendReply = async () => {
    if (!reply.trim()) return;
    if (!activeId) return;

    try {
      const token = localStorage.getItem("token") || "";

      const res = await replyTicket({
        ticketId: activeId,
        message: reply,
        token,
      });

      if (res.success) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === res.ticket._id
              ? res.ticket
              : ticket
          )
        );

        setReply("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= RESOLVE ================= */
  const handleResolve = async () => {
    if (!activeId) return;

    try {
      const token = localStorage.getItem("token") || "";

      const res = await resolveTicket(activeId, token);

      if (res.success) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === activeId
              ? { ...ticket, status: "resolved" }
              : ticket
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= FILTER ================= */
  const filtered = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t._id.toLowerCase().includes(query.toLowerCase())
  );

  /* ================= STATS ================= */
  const openCount = tickets.filter(
    (t) => t.status === "open"
  ).length;

  const pendingCount = tickets.filter(
    (t) => t.status === "pending"
  ).length;

  const urgentCount = tickets.filter(
    (t) => t.priority === "urgent"
  ).length;


  /* ================= AI COMPILOT ================= */
  const lastUserMessage = active?.messages
    ?.filter((m) => m.sender === "user")
    ?.slice(-1)[0];

  /* ============= SLA ============== */
  const createdTime = active?.createdAt
    ? new Date(active.createdAt).getTime()
    : Date.now();

  const now = Date.now();

  const hoursOpen = Math.floor((now - createdTime) / (1000 * 60 * 60));

  const responseSLA = Math.max(100 - hoursOpen * 10, 10);
  const resolutionSLA =
    active?.status === "resolved" ? 100 : Math.max(100 - hoursOpen * 8, 20);

  return (
    <div className="grid grid-cols-12 gap-4">

      {/* ================= QUEUE PANEL ================= */}
      <Card className="col-span-3 p-4 flex flex-col bg-card/40 backdrop-blur-xl border overflow-hidden h-[88vh]">

        {/* SEARCH */}
        <div className="flex items-center gap-2 mb-3">
          <Search size={16} />

          <Input
            placeholder="Search tickets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-3 text-xs mb-4">

          <Stat
            label="Open"
            value={openCount}
            icon={<Inbox size={15} />}
          />

          <Stat
            label="Pending"
            value={pendingCount}
            icon={<Clock size={15} />}
          />

          <Stat
            label="Urgent"
            value={urgentCount}
            icon={<AlertTriangle size={15} />}
          />

        </div>

        {/* LIST */}
        <div className="flex-1 overflow-auto space-y-2 pr-1">

          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading tickets...
            </p>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tickets found
            </p>
          )}

          {filtered.map((t) => (
            <div
              key={t._id}
              onClick={() => setActiveId(t._id)}
              className={`p-3 rounded-xl border cursor-pointer transition hover:bg-accent ${activeId === t._id
                ? "border-primary bg-primary/10"
                : ""
                }`}
            >

              <div className="flex justify-between items-start gap-2">

                <div>
                  <p className="text-sm font-medium line-clamp-1">
                    {t.subject}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {t.name}
                  </p>
                </div>

                <PriorityDot level={t.priority} />

              </div>

              <div className="flex gap-2 mt-3 flex-wrap">

                <Badge variant="outline">
                  {t.status}
                </Badge>

                {t.category && (
                  <Badge variant="secondary">
                    {t.category}
                  </Badge>
                )}

              </div>

            </div>
          ))}

        </div>

      </Card>

      {/* ================= CHAT WORKSPACE ================= */}
      <Card className="col-span-6 flex flex-col bg-card/40 backdrop-blur-xl border h-[88vh]">

        {/* HEADER */}
        {active && (
          <div className="p-4 border-b flex justify-between items-center">

            <div>
              <h2 className="font-semibold">
                {active.subject}
              </h2>

              <p className="text-xs text-muted-foreground">
                {active.name} • {active.email}
              </p>
            </div>

            <div className="flex gap-2">

              <Badge>
                {active.status}
              </Badge>

              <Badge variant="outline">
                {active.priority}
              </Badge>

            </div>

          </div>
        )}

        {/* CHAT */}
        <Card className="flex-1 overflow-auto p-4 space-y-4">
          <div className="p-3 border-b">
            <h2 className="font-bold">{active?.subject}</h2>
          </div>

          {active?.messages?.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "admin"
                ? "justify-end"
                : "justify-start"
                }`}
            >

              <Card
                className={`px-4 py-3 rounded-2xl text-sm max-w-[75%] ${m.sender === "admin"
                  ? "bg-brand text-card/90 font-semibold"
                  : "bg-background border"
                  }`}
              >

                <div className=" rounded">
                  {m.message}
                </div>

                <p
                  className={`text-[10px] mt-2 ${m.sender === "admin"
                    ? "text-white/70"
                    : "text-muted-foreground"
                    }`}
                >
                  {m.createdAt
                    ? new Date(
                      m.createdAt
                    ).toLocaleString()
                    : ""}
                </p>

              </Card>
              <div ref={bottomRef} />

            </div>
          ))}

        </Card>

        {/* REPLY */}
        <div className="p-4 border-t flex gap-3">

          {typing && (
            <p className="text-xs text-gray-400">
              user typing...
            </p>
          )}

          <Textarea
            value={reply}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type response..."
            className="min-h-20"
          />

          <div className="flex flex-col gap-2">

            <Button onClick={sendReply}>
              Send
            </Button>

            <Button
              variant="outline"
              onClick={handleResolve}
            >
              <CheckCircle2 size={16} />
            </Button>

          </div>

        </div>

      </Card>

      {/* ================= RIGHT PANEL ================= */}
      <div className="col-span-3 space-y-4">

        {/* AI */}
        <Card className="p-4 bg-card/40 backdrop-blur-xl">

          <div className="flex items-center gap-2">
            <Bot className="text-primary" />
            <h3 className="font-semibold">
              AI Copilot
            </h3>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Suggested response:
          </div>

          <div className="mt-2 p-3 bg-background border rounded-xl text-sm">

            {active ? (
              lastUserMessage ? (
                <>
                  “Thanks for contacting us regarding:{" "}
                  <b>{active.subject}</b>. We’re currently reviewing:
                  <br /><br />
                  <i>"{lastUserMessage.message}"</i>
                  <br /><br />
                  We’ll get back to you shortly with a resolution.”
                </>
              ) : (
                "We’ve received your request and are reviewing it."
              )
            ) : (
              "Select a ticket to see AI suggestions"
            )}

          </div>

          <Button
            className="w-full mt-3"
            variant="outline"
            onClick={() =>
              setReply(
                lastUserMessage
                  ? `Thanks for contacting us regarding ${active?.subject}. We are looking into: "${lastUserMessage.message}"`
                  : "We’ve identified the issue and are resolving it now."
              )
            }
          >
            Insert Suggestion
          </Button>

        </Card>

        {/* SLA */}
        <Card className="p-4 space-y-2">

          <h3 className="font-semibold">
            SLA Status
          </h3>

          <SlaProgress
            label="Response SLA"
            value={responseSLA}
          />
          <SlaProgress
            label="Resolution SLA"
            value={resolutionSLA}
          />
        </Card>

        {/* ACTIONS */}
        <Card className="p-4 space-y-2">
          <h3 className="font-semibold">
            Actions
          </h3>
          <Button
            className="w-full"
            variant="outline"
            onClick={() =>
              setReply("Hi, we’re currently reviewing your issue and will respond shortly.")
            }
          >
            Auto Reply
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleResolve}
          >
            Resolve Ticket
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={() =>
              setReply("This issue has been escalated to a senior support agent.")
            }
          >
            Escalate Ticket
          </Button>
        </Card>

        {/* SYSTEM */}
        <Card className="p-4">

          <div className="flex items-center gap-2 text-green-400">
            <Zap size={14} />
            <p className="text-sm">
              Real-time Connected
            </p>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            WebSocket active • Syncing live tickets
          </p>

        </Card>

      </div>

    </div>
  );
}

/* ================= HELPERS ================= */

function Stat({ label, value, icon }: any) {
  return (
    <div className="text-center">
      <div className="text-primary flex justify-center">
        {icon}
      </div>

      <p className="text-sm font-bold">
        {value}
      </p>

      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function PriorityDot({
  level,
}: {
  level: Priority;
}) {
  const color =
    level === "urgent"
      ? "bg-red-500"
      : level === "high"
        ? "bg-orange-400"
        : level === "medium"
          ? "bg-yellow-400"
          : "bg-green-400";

  return (
    <span
      className={`w-2 h-2 rounded-full ${color}`}
    />
  );
}

function SlaProgress({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="space-y-1">

      <div className="flex items-center justify-between text-xs">

        <span className="text-muted-foreground">
          {label}
        </span>

        <span
          className={`font-medium ${value >= 80
            ? "text-green-400"
            : value >= 50
              ? "text-orange-400"
              : "text-red-400"
            }`}
        >
          {value}%
        </span>

      </div>

      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">

        <div
          className={`h-full transition-all duration-500 ${value >= 80
            ? "bg-green-500"
            : value >= 50
              ? "bg-orange-400"
              : "bg-red-500"
            }`}
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  );
}