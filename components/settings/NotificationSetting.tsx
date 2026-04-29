"use client";

import { Switch } from "@/components/ui/switch";
import API from "@/lib/api";

export default function NotificationSetting({
  email,
  push,
  setEmail,
  setPush,
}: any) {

  const updateEmail = async (value: boolean) => {
    setEmail(value);

    await API.put("/settings/notifications", {
      emailNotifications: value,
      pushNotifications: push,
    });
  };

  const updatePush = async (value: boolean) => {
    setPush(value);

    await API.put("/settings/notifications", {
      emailNotifications: email,
      pushNotifications: value,
    });
  };

  return (
    <div className="p-5 border rounded-xl bg-white/5 space-y-4">

      <h2 className="font-semibold">Notifications</h2>

      <div className="flex justify-between">
        <span>Email Notifications</span>
        <Switch checked={email} onCheckedChange={updateEmail} />
      </div>

      <div className="flex justify-between">
        <span>Push Notifications</span>
        <Switch checked={push} onCheckedChange={updatePush} />
      </div>

    </div>
  );
}