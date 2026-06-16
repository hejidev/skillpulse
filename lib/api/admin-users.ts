import API from "../api";

/* =======================================
   GET USERS
======================================= */
export const getUsers = async (
  token: string
) => {
  const res = await API.get(
    "/admin/users",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =======================================
   UPDATE ROLE
======================================= */
export const updateRole = async (
  token: string,
  userId: string,
  role: string
) => {
  const res = await API.put(
    "/admin/users/role",
    {
      userId,
      role,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =======================================
   SUSPEND
======================================= */
export const suspendUser = async (
  token: string,
  userId: string
) => {
  const res = await API.put(
    "/admin/users/suspend",
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =======================================
   ACTIVATE
======================================= */
export const activateUser = async (
  token: string,
  userId: string
) => {
  const res = await API.put(
    "/admin/users/activate",
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =======================================
   DELETE USER
======================================= */
export const deleteUser = async (
  token: string,
  userId: string
) => {
  const res = await API.delete(
    `/admin/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =======================================
   ANALYTICS
======================================= */
export const getAnalytics = async (
  token: string
) => {
  const res = await API.get(
    "/admin/analytics",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

/* =======================================
   GET AUDIT LOGS
======================================= */
export const getAuditLogs = async (
  token: string,
  page = 1,
  limit = 20
) => {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/audit-logs?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // ✅ HANDLE NON-JSON ERRORS
  if (!res.ok) {
    const text = await res.text();

    console.error(text);

    throw new Error(
      "Failed to fetch audit logs"
    );
  }

  return res.json();
};


/* =======================================
   DASHBOARD ANALYTICS
======================================= */
export const getDashboardAnalytics =
  async (token: string) => {

    const res = await API.get(
      "/admin/dashboard-analytics",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

/* =======================================
 ACTIVITY DASHBOARD
======================================= */
// export const getActivityDashboard =
//   async (token: string) => {

//     const res = await API.get(
//       "/admin/activity-dashboard",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log(
//       "ACTIVITY DASHBOARD RESPONSE:",
//       res.data
//     );

//     return res.data;
//   };

  /* =======================================
   ACTIVITY FEED
======================================= */
export const getActivityFeed =
  async (token: string) => {

    const res = await API.get(
      "/admin/activity-feed",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

/* =======================================
   INTELLIGENCE OVERVIEW
======================================= */
  export const getIntelligenceOverview =
  async (token: string) => {

    const res = await API.get(
      "/admin/intelligence-overview",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };

  /* =========== ANALYTICS INTELIGENCE HISTORY =========== */
 export const getIntelligenceHistory =
  async (
    token: string,
    range = "7d"
  ) => {

    const res = await API.get(
      `/admin/intelligence-history?range=${range}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  };