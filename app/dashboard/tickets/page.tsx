"use client";

import { useEffect, useRef, useState } from "react";
import { socket, socketService } from "@/lib/socket";
import { getUserTickets, userReplyTicket } from "@/lib/api/tickets";

export default function UserTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeId, setActiveId] = useState("");
  const [message, setMessage] = useState("");

  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const typingTimeout = useRef<any>(null);

  const active = tickets.find((t) => t._id === activeId);

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token") || "";
      const res = await getUserTickets(token);

      if (res.success) {
        setTickets(res.tickets);
        setActiveId(res.tickets?.[0]?._id || "");
      }
    };

    load();
  }, []);

  /* ================= SOCKET INIT ================= */
  useEffect(() => {
    socketService.connect();

    const handleUpdate = (updated: any) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    };

    socket.on("ticketUpdated", handleUpdate);

    return () => {
      socket.off("ticketUpdated", handleUpdate);
    };
  }, []);

  /* ================= JOIN ROOM ================= */
  useEffect(() => {
    if (!activeId) return;

    socket.emit("joinTicket", activeId);

    return () => {
      socket.emit("leaveTicket", activeId);
    };
  }, [activeId]);

  /* ================= TYPING ================= */
  const handleTyping = (value: string) => {
    setMessage(value);

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

  /* ================= TYPING LISTENER ================= */
  useEffect(() => {
    const handleTyping = ({ ticketId }: any) => {
      if (ticketId !== activeId) return;

      setTypingUsers((prev) => ({
        ...prev,
        [ticketId]: true,
      }));
    };

    const handleStopTyping = ({ ticketId }: any) => {
      if (ticketId !== activeId) return;

      setTypingUsers((prev) => ({
        ...prev,
        [ticketId]: false,
      }));
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [activeId]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token") || "";

    const res = await userReplyTicket({
      ticketId: activeId,
      message,
      token,
    });

    if (res.success) {
      setMessage("");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-8 py-6">
      <div className="max-w-6xl mx-auto h-[80vh] sm:h-[85vh] rounded-3xl border border-border bg-card/70 backdrop-blur-xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              🎫 Support Center
            </h2>
            <p className="text-xs text-muted-foreground">
              View your tickets and chat with support in real time.
            </p>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Live connection · Typing indicators · Read receipts
          </div>
        </div>

        {/* Main grid */}
        <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">

          {/* LEFT LIST */}
          <div className="w-full sm:w-1/3 border-r border-border/60 bg-background/40">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Your tickets
              </span>
              <span className="text-[11px] text-muted-foreground">
                {tickets.length} open
              </span>
            </div>

            <div className="overflow-auto max-h-[calc(85vh-96px)] px-2 pb-3">
              {tickets.map((t) => {
                const isActive = activeId === t._id;
                const lastMessage = t.messages?.[t.messages.length - 1];
                const status = t.status || "open";

                return (
                  <button
                    key={t._id}
                    onClick={() => setActiveId(t._id)}
                    className={`
            w-full text-left px-3 py-3 mb-2 rounded-2xl border
            flex flex-col gap-1
            transition-all duration-200
            ${isActive
                        ? "border-emerald-400 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        : "border-border bg-card/40 hover:bg-card/60"
                      }
          `}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold truncate">
                        {t.subject}
                      </span>
                      <span
                        className={`
                text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide
                ${status === "resolved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-400/40"
                            : status === "pending"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-400/40"
                              : "bg-cyan-500/10 text-cyan-400 border border-cyan-400/40"
                          }
              `}
                      >
                        {status}
                      </span>
                    </div>
                    {lastMessage && (
                      <p className="text-[11px] text-muted-foreground truncate">
                        {lastMessage.sender === "user" ? "You: " : "Support: "}
                        {lastMessage.message}
                      </p>
                    )}
                    {t.updatedAt && (
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(t.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Conversation */}
          <div className="flex-1 flex flex-col bg-background/40">
            {active ? (
              <>
                {/* Conversation header */}
                <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold truncate">
                      {active.subject}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Ticket ID: {active._id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span
                      className={`
              w-2 h-2 rounded-full
              ${typingUsers[activeId] ? "bg-emerald-400 animate-pulse" : "bg-muted-foreground"}
            `}
                    />
                    <span>
                      {typingUsers[activeId] ? "Support is typing…" : "Connected"}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
                  {active.messages?.map((m: any, i: number) => {
                    const isUser = m.sender === "user";
                    const avatar = isUser
                      ? active?.name?.charAt(0)?.toUpperCase() || "U"
                      : "A";
                    const name = isUser ? active?.name || "You" : "Support Agent";

                    return (
                      <div
                        key={i}
                        className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"
                          }`}
                      >
                        {/* Avatar (left for support) */}
                        {!isUser && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            {avatar}
                          </div>
                        )}

                        {/* Message bubble */}
                        <div
                          className={`
    px-4 py-2 rounded-2xl text-sm max-w-[85%]
    shadow-sm
    ${isUser
                              ? "bg-emerald-500 text-white rounded-br-none"
                              : "bg-white text-gray-900 rounded-bl-none border border-border/40"
                            }
  `}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] opacity-80">
                              {name}
                            </span>
                            {m.createdAt && (
                              <span className="text-[10px] opacity-60">
                                {new Date(m.createdAt).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                          <div>{m.message}</div>

                          {isUser && m.read && (
                            <span className="mt-1 block text-[10px] text-emerald-200 text-right">
                              Seen
                            </span>
                          )}
                        </div>

                        {/* Avatar (right for user) */}
                        {isUser && (
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                            {avatar}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {active.messages?.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center mt-8">
                      No messages yet. Start the conversation below.
                    </p>
                  )}
                </div>

                {/* Typing indicator (inline) */}
                {typingUsers[activeId] && (
                  <p className="px-5 pb-1 text-[11px] text-muted-foreground">
                    Support is typing…
                  </p>
                )}

                {/* Input bar */}
                <div className="px-5 py-3 border-t border-border/60 flex items-center gap-2 bg-background/60">
                  <input
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-card/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-xs sm:text-sm text-white font-semibold hover:bg-emerald-600 transition shadow-[0_0_18px_rgba(16,185,129,0.35)]"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                Select a ticket from the list on the left to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}