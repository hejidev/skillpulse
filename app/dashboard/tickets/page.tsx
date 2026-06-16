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
    <div className="grid grid-cols-12 gap-4 h-screen">

      {/* LEFT LIST */}
      <div className="col-span-4 border p-3 overflow-auto">
        {tickets.map((t) => (
          <div
            key={t._id}
            onClick={() => setActiveId(t._id)}
            className={`p-2 border cursor-pointer mb-2 ${
              activeId === t._id ? "bg-gray-200" : ""
            }`}
          >
            {t.subject}
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="col-span-8 flex flex-col border p-3">

  {/* MESSAGES */}
  <div className="flex-1 overflow-auto space-y-3">

    {active?.messages?.map((m: any, i: number) => {
      const isUser = m.sender === "user";

      const avatar = isUser
        ? active?.name?.charAt(0)?.toUpperCase() || "U"
        : "A";

      const name = isUser
        ? active?.name || "User"
        : "Support Agent";

      return (
        <div
          key={i}
          className={`flex items-end gap-2 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >

          {/* AVATAR (LEFT FOR ADMIN) */}
          {!isUser && (
            <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
              {avatar}
            </div>
          )}

          {/* MESSAGE BOX */}
          <div
            className={`px-4 py-2 rounded-xl text-sm max-w-[70%] ${
              isUser
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >

            {/* NAME */}
            <div className="text-[11px] opacity-70 mb-1">
              {name}
            </div>

            {/* MESSAGE */}
            <div>{m.message}</div>

            {/* READ RECEIPT */}
            {m.read && (
              <span className="ml-2 text-xs">✓✓</span>
            )}
          </div>

          {/* AVATAR (RIGHT FOR USER) */}
          {isUser && (
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
              {avatar}
            </div>
          )}

        </div>
      );
    })}

  </div>

  {/* TYPING */}
  {typingUsers[activeId] && (
    <p className="text-xs text-gray-400 mt-2">
      typing...
    </p>
  )}

  {/* INPUT */}
  <div className="flex gap-2 mt-3">
    <input
      value={message}
      onChange={(e) => handleTyping(e.target.value)}
      className="border flex-1 p-2"
    />

    <button
      onClick={sendMessage}
      className="px-4 bg-black text-white"
    >
      Send
    </button>
  </div>

</div>
    </div>
  );
}