// lib/api/devices-api.ts
import API from "@/lib/api";

export type UserDevice = {
  id: string;              // <- add this
  deviceHash: string;
  device: string;
  ip: string;
  lastUsed: string;
};

export const getMyDevices = async () => {
  const res = await API.get("/me/devices");
  return res.data as { success: boolean; devices: UserDevice[] };
};

export const revokeMyDeviceApi = async (deviceHash: string) => {
  const res = await API.post("/me/devices/revoke", { deviceHash });
  return res.data;
};