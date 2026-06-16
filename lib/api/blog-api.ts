import API from "../api";

/* =========================================
   CREATE BLOG
========================================= */
export const createBlog = async (
  formData: FormData
) => {
  const res = await API.post(
    "/blog/create",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

/* =========================================
   GET PUBLISHED BLOGS
========================================= */
export const getPublishedBlogs =
  async () => {
    const res = await API.get(
      "/blog/published"
    );

    return res.data;
  };

/* =========================================
   GET SINGLE BLOG
========================================= */
export const getSingleBlog =
  async (slug: string) => {
    const res = await API.get(
      `/blog/${slug}`
    );

    return res.data;
  };

/* =========================================
   GET ADMIN BLOGS
========================================= */
export const getAdminBlogs =
  async () => {
    const res = await API.get(
      "/blog/admin/all"
    );

    return res.data;
  };

  /* =========================================
   GET SINGLE ADMIN BLOG BY ID
========================================= */
export const getAdminBlogById =
  async (id: string) => {
    const res = await API.get(
      `/blog/admin/${id}`
    );

    return res.data;
  };

  /* =========================================
   UPDATE BLOG
========================================= */
export const updateBlog =
  async (
    id: string,
    formData: FormData
  ) => {
    const res = await API.put(
      `/blog/admin/${id}`,
      formData
    );

    return res.data;
  };

/* =========================================
   DELETE BLOG
========================================= */
export const deleteBlog =
  async (id: string) => {
    const res = await API.delete(
      `/blog/admin/${id}`
    );

    return res.data;
  };