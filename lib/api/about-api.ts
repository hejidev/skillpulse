import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token");

    return {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };
  }

  return {};
};

/* =========================
   PUBLIC
========================= */
export const getPublicAbout = async () => {
  try {
    const response = await axios.get(`${API_URL}/about`);
    return response.data; // { success, about }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      // No published about yet – treat as "no data" instead of exploding
      return { success: false, about: null };
    }
    throw error;
  }
};

/* =========================
   ADMIN CMS
========================= */

export const getAdminAbout =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/about/admin`,
        getAuthHeaders()
      );

    return response.data;
  };

export const updateAbout =
  async (
    data: any
  ) => {

    const response =
      await axios.put(
        `${API_URL}/about/admin`,
        data,
        getAuthHeaders()
      );

    return response.data;
  };

export const updateAboutStatus =
  async (
    status:
      | "draft"
      | "published"
  ) => {

    const response =
      await axios.patch(
        `${API_URL}/about/admin/status`,
        { status },
        getAuthHeaders()
      );

    return response.data;
  };

export const getAboutAnalytics =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/about/admin/analytics`,
        getAuthHeaders()
      );

    return response.data;
  };

  /* =========================
   UPLOAD IMAGE
========================= */
  export const uploadAboutImageApi = async (
  file: File
) => {
  const formData = new FormData();

  formData.append(
    "image",
    file
  );

  const token =
    localStorage.getItem("token");

  const response =
    await axios.post(
      `${API_URL}/about/admin/upload-image`,
      formData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};

  /* =========================
   DELETE ABOUT
========================= */
export const deleteAbout =
  async (
    id: string
  ) => {

    const response =
      await axios.delete(
        `${API_URL}/about/admin/${id}`,
        getAuthHeaders()
      );

    return response.data;
  };