// components/adminmessagechannel/InboxChannel.tsx

"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Sparkles,
  Bot,
  User2,
} from "lucide-react";

import { socket, socketService } from "@/lib/socket";

import {
  getAllTickets,
  replyTicket,
  resolveTicket,
} from "@/lib/api/tickets";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type TicketStatus =
  | "open"
  | "pending"
  | "resolved";

type Priority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

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
  createdAt?: string;
  messages: Message[];
}

/* ================= MAIN ================= */

export default function InboxChannel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [activeId, setActiveId] =
    useState("");

  const [query, setQuery] = useState("");

  const [reply, setReply] = useState("");

  const [typing, setTyping] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const typingTimeout = useRef<any>(null);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  /* ================= ACTIVE ================= */

  const activeTicket = useMemo(
    () =>
      tickets.find(
        (ticket) =>
          ticket._id === activeId
      ),
    [tickets, activeId]
  );

  /* ================= LOAD ================= */

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token") ||
          "";

        const res = await getAllTickets(
          token
        );

        if (res.success) {
          setTickets(res.tickets || []);

          if (
            res.tickets &&
            res.tickets.length > 0
          ) {
            setActiveId(
              res.tickets[0]._id
            );
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  /* ================= SOCKET ================= */

  useEffect(() => {
    socketService.connect();

    socket.on(
      "ticketUpdated",
      (updatedTicket: Ticket) => {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id ===
            updatedTicket._id
              ? updatedTicket
              : ticket
          )
        );
      }
    );

    socket.on(
      "ticketCreated",
      (newTicket: Ticket) => {
        setTickets((prev) => {
          const exists = prev.find(
            (ticket) =>
              ticket._id ===
              newTicket._id
          );

          if (exists) return prev;

          return [newTicket, ...prev];
        });
      }
    );

    socket.on("typing", () =>
      setTyping(true)
    );

    socket.on("stopTyping", () =>
      setTyping(false)
    );

    return () => {
      socket.off("ticketUpdated");

      socket.off("ticketCreated");

      socket.off("typing");

      socket.off("stopTyping");
    };
  }, []);

  /* ================= JOIN ROOM ================= */

  useEffect(() => {
    if (!activeId) return;

    socket.emit("joinTicket", activeId);

    return () => {
      socket.emit(
        "leaveTicket",
        activeId
      );
    };
  }, [activeId]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeTicket?.messages]);

  /* ================= FILTER ================= */

  const filteredTickets =
    tickets.filter(
      (ticket) =>
        ticket.subject
          .toLowerCase()
          .includes(
            query.toLowerCase()
          ) ||
        ticket.name
          .toLowerCase()
          .includes(
            query.toLowerCase()
          ) ||
        ticket.email
          .toLowerCase()
          .includes(
            query.toLowerCase()
          )
    );

  /* ================= SEND ================= */

  const sendReply = async () => {
    if (!reply.trim()) return;

    if (!activeId) return;

    try {
      const token =
        localStorage.getItem("token") ||
        "";

      const res = await replyTicket({
        ticketId: activeId,
        message: reply,
        token,
      });

      if (res.success) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id ===
            res.ticket._id
              ? res.ticket
              : ticket
          )
        );

        setReply("");

        socket.emit("stopTyping", {
          ticketId: activeId,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= TYPING ================= */

  const handleTyping = (
    value: string
  ) => {
    setReply(value);

    socket.emit("typing", {
      ticketId: activeId,
      sender: "admin",
    });

    clearTimeout(
      typingTimeout.current
    );

    typingTimeout.current =
      setTimeout(() => {
        socket.emit("stopTyping", {
          ticketId: activeId,
        });
      }, 800);
  };

  /* ================= RESOLVE ================= */

  const handleResolve =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          ) || "";

        const res = await resolveTicket(
          activeId,
          token
        );

        if (res.success) {
          setTickets((prev) =>
            prev.map((ticket) =>
              ticket._id === activeId
                ? {
                    ...ticket,
                    status:
                      "resolved",
                  }
                : ticket
            )
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-12 gap-5 h-[90vh]">

      {/* ================= SIDEBAR ================= */}

      <Card className="col-span-4 xl:col-span-3 overflow-hidden border-border/50 bg-background/60 backdrop-blur-2xl rounded-[2rem] flex flex-col">

        {/* TOP */}

        <div className="p-5 border-b border-border/50">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-black">
                Inbox
              </h2>

              <p className="text-sm text-muted-foreground">
                Live customer conversations
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Sparkles size={13} />
            </div>

          </div>

          {/* SEARCH */}

          <div className="relative mt-5">

            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              placeholder="Search conversations..."
              value={query}
              onChange={(e) =>
                setQuery(
                  e.target.value
                )
              }
              className="pl-11 h-12 rounded-2xl border-border/50"
            />

          </div>

        </div>

        {/* LIST */}

        <div className="flex-1 overflow-auto p-3 space-y-3">

          {loading && (
            <p className="text-sm text-muted-foreground p-3">
              Loading inbox...
            </p>
          )}

          {!loading &&
            filteredTickets.length ===
              0 && (
              <div className="text-center py-16">

                <User2
                  size={30}
                  className="mx-auto text-cyan-400 mb-4"
                />

                <h3 className="font-bold text-lg">
                  No Conversations
                </h3>

                <p className="text-muted-foreground text-sm mt-2">
                  Customer chats will appear here.
                </p>

              </div>
            )}

          {filteredTickets.map(
            (ticket) => {
              const lastMessage =
                ticket.messages?.[
                  ticket.messages
                    .length - 1
                ];

              return (
                <div
                  key={ticket._id}
                  onClick={() =>
                    setActiveId(
                      ticket._id
                    )
                  }
                  className={`p-4 rounded-3xl border cursor-pointer transition-all duration-300 hover:border-cyan-500/40 ${
                    activeId ===
                    ticket._id
                      ? "border-cyan-500 bg-cyan-500/5"
                      : "border-border/40"
                  }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex gap-3 flex-1 min-w-0">

                      <div className="w-12 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-black text-lg">
                        {ticket.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center gap-2">

                          <h3 className="font-bold truncate">
                            {ticket.name}
                          </h3>

                          <PriorityBadge
                            priority={
                              ticket.priority
                            }
                          />

                        </div>

                        <p className="text-sm font-medium truncate mt-1">
                          {
                            ticket.subject
                          }
                        </p>

                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {lastMessage?.message}
                        </p>

                      </div>

                    </div>

                    <Badge>
                      {ticket.status}
                    </Badge>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </Card>

      {/* ================= CHAT ================= */}

      <Card className="col-span-8 xl:col-span-9 border-border/50 bg-background/60 backdrop-blur-2xl rounded-[2rem] overflow-hidden flex flex-col">

        {!activeTicket ? (
          <div className="flex-1 flex items-center justify-center flex-col">

            <Bot
              size={55}
              className="text-cyan-400 mb-5"
            />

            <h2 className="text-2xl font-black">
              Select Conversation
            </h2>

            <p className="text-muted-foreground mt-2">
              Open a customer conversation
            </p>

          </div>
        ) : (
          <>
            {/* HEADER */}

            <div className="border-b border-border/50 p-5 flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl font-black">
                  {activeTicket.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>

                  <h2 className="text-xl font-black">
                    {
                      activeTicket.name
                    }
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {
                      activeTicket.email
                    }
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Badge variant="outline">
                  {
                    activeTicket.priority
                  }
                </Badge>

                <Badge>
                  {
                    activeTicket.status
                  }
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={
                    handleResolve
                  }
                >
                  <CheckCircle2
                    size={16}
                  />
                </Button>

              </div>

            </div>

            {/* CHAT BODY */}

            <div className="flex-1 overflow-auto p-6 space-y-5">

              {activeTicket.messages.map(
                (message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender ===
                      "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[75%] rounded-[2rem] px-5 py-4 ${
                        message.sender ===
                        "admin"
                          ? "bg-cyan-500 text-white"
                          : "bg-background border border-border/50"
                      }`}
                    >

                      <p className="leading-relaxed text-sm">
                        {
                          message.message
                        }
                      </p>

                      <div
                        className={`flex items-center gap-2 mt-3 text-[11px] ${
                          message.sender ===
                          "admin"
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >

                        <Clock3
                          size={12}
                        />

                        {message.createdAt
                          ? new Date(
                              message.createdAt
                            ).toLocaleString()
                          : ""}

                      </div>

                    </div>

                  </div>
                )
              )}

              {typing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">

                  <AlertCircle
                    size={15}
                  />

                  User is typing...

                </div>
              )}

              <div ref={bottomRef} />

            </div>

            {/* INPUT */}

            <div className="border-t border-border/50 p-5">

              <div className="flex gap-4 items-end">

                <Textarea
                  value={reply}
                  onChange={(e) =>
                    handleTyping(
                      e.target.value
                    )
                  }
                  placeholder="Reply customer..."
                  className="min-h-[85px] rounded-3xl border-border/50 resize-none"
                />

                <Button
                  onClick={sendReply}
                  className="h-[85px] px-8 rounded-3xl"
                >

                  <Send size={18} />

                </Button>

              </div>

            </div>
          </>
        )}

      </Card>

    </div>
  );
}

/* ================= BADGE ================= */

function PriorityBadge({
  priority,
}: {
  priority: Priority;
}) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-[10px] font-bold ${
        priority === "urgent"
          ? "bg-red-500/20 text-red-400"
          : priority === "high"
          ? "bg-orange-500/20 text-orange-400"
          : priority === "medium"
          ? "bg-yellow-500/20 text-yellow-400"
          : "bg-green-500/20 text-green-400"
      }`}
    >
      {priority}
    </span>
  );
}