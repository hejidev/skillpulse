const API = "http://localhost:5000/api/tickets";

/* ================= CREATE TICKET (USER/GUEST) ================= */
export async function createTicket(data: any) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : "";

  const res = await fetch(`${API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to create ticket"
    );
  }

  return result;
}

/* ================= USER TICKETS ================= */
export async function getUserTickets(
  token: string
) {
  const res = await fetch(`${API}/my-tickets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

/* ================= USER REPLY ================= */
export async function userReplyTicket(data: {
  ticketId: string;
  message: string;
  token: string;
}) {
  const res = await fetch(`${API}/user-reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      ticketId: data.ticketId,
      message: data.message,
    }),
  });

  return res.json();
}

/* ================= GET ALL TICKETS (ADMIN) ================= */
export async function getAllTickets(token: string) {
  const res = await fetch(`${API}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

/* ================= GET SINGLE TICKET ================= */
export async function getTicket(id: string, token: string) {
  const res = await fetch(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

/* ================= REPLY TICKET (ADMIN) ================= */
export async function replyTicket(data: {
  ticketId: string;
  message: string;
  token: string;
}) {
  const res = await fetch(`${API}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      ticketId: data.ticketId,
      message: data.message,
    }),
  });

  return res.json();
}

/* ================= RESOLVE ================= */
export async function resolveTicket(ticketId: string, token: string) {
  const res = await fetch(`${API}/resolve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ticketId }),
  });

  return res.json();
}