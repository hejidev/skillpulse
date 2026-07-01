const API =
 process.env.NEXT_PUBLIC_API_URL;

export const getNotifications =
 async (
  page = 1
 ) => {

  const token =
   localStorage.getItem(
    "token"
   );

  const res =
   await fetch(
    `${API}/admin/notifications?page=${page}`,
    {
     headers: {
      Authorization:
       `Bearer ${token}`,
     },
    }
   );

  return res.json();
};

export const getNotificationStats =
 async () => {

  const token =
   localStorage.getItem(
    "token"
   );

  const res =
   await fetch(
    `${API}/admin/notifications/stats`,
    {
     headers: {
      Authorization:
       `Bearer ${token}`,
     },
    }
   );

  return res.json();
};

export const markNotificationRead =
 async (id: string) => {

  const token =
   localStorage.getItem(
    "token"
   );

  return fetch(
   `${API}/admin/notifications/${id}/read`,
   {
    method: "PATCH",

    headers: {
     Authorization:
      `Bearer ${token}`,
    },
   }
  );
};

export const markAllNotificationsRead =
 async () => {

 const token =
  localStorage.getItem(
   "token"
  );

 return fetch(
  `${API}/admin/notifications/read-all`,
  {
   method:"PATCH",

   headers:{
    Authorization:
      `Bearer ${token}`
   }
  }
 );
};

export const archiveNotification =
 async (id: string) => {

  const token =
   localStorage.getItem(
    "token"
   );

  return fetch(
   `${API}/admin/notifications/${id}/archive`,
   {
    method: "PATCH",

    headers: {
     Authorization:
      `Bearer ${token}`,
    },
   }
  );
};

export const markManyNotificationsRead = async (ids: string[]) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API}/admin/notifications/read-many`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    }
  );

  return res.json();
};

export const archiveManyNotifications = async (ids: string[]) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API}/admin/notifications/archive-many`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    }
  );

  return res.json();
};

export const deleteNotification = async (id: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/admin/notifications/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete failed: ${res.status} ${text}`);
  }

  return res.json();
};

export const deleteManyNotifications = async (ids: string[]) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API}/admin/notifications/delete-many`,
    {
      method: "POST",                 // ✅ must be POST
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    }
  );

  if (!res.ok) {
    // Optional: log the text to inspect errors
    const text = await res.text();
    throw new Error(`Delete failed: ${res.status} ${text}`);
  }

  return res.json();
};

export const deleteNotificationsByFilter = async (options: {
  category?: string;
  severity?: string;
  search?: string;
}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/admin/notifications/delete-by-filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete-by-filter failed: ${res.status} ${text}`);
  }

  return res.json();
};