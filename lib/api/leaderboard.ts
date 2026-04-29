// lib/api/leaderboard.ts

import API from "../api";

export const fetchLeaderboard = async () => {
  const res = await API.get("/leaderboard");
  return res.data;
};