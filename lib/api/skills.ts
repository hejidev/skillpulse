import API from "@/lib/api";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// 📥 FETCH
export const fetchSkills = async () => {
  const res = await API.get("/skills");
  return res.data;
};

export const createSkill = async (data: any) => {
  const res = await API.post("/skills", data);
  return res.data;
};

export const updateSkill = async ({ id, data }: any) => {
  const res = await API.put(`/skills/${id}`, data);
  return res.data;
};

export const deleteSkill = async (id: string) => {
  const res = await API.delete(`/skills/${id}`);
  return res.data;
};

export const getSkillById = async (id: string) => {
  const res = await API.get(`/skills/${id}`);
  return res.data;
};