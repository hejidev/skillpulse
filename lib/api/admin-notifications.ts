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