"use client";

import { useEffect, useMemo, useState } from "react";
import { socket } from "@/lib/socket";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Zap, Activity, AlertTriangle } from "lucide-react";

import AlertFeed from "./SysytemAlerts/AlertFeed";
import AlertWorkspace from "./SysytemAlerts/AlertWorkspace";
import AlertPanel from "./SysytemAlerts/AlertPanel";

export default function SystemAlertsChannel({ messages }: any) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeId, setActiveId] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    socket.connect();

    socket.emit("join-admin-dashboard");

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ================= ACTIVE ALERT ================= */
  const active = useMemo(
    () => alerts.find((a) => a._id === activeId),
    [alerts, activeId]
  );

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return alerts
      .filter((a) =>
        `${a.title} ${a.type}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .sort((a, b) => b.severityScore - a.severityScore);
  }, [alerts, query]);

  const addUniqueAlert = (alert: any) => {
  setAlerts((prev) => {
    const exists = prev.some((a) => a._id === alert._id);
    if (exists) return prev;

    return [alert, ...prev];
  });
};

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.connect();
    socket.emit("join-admin-dashboard");

    const handleCreated = (alert: any) => {
      addUniqueAlert(alert);
    };

    const handleSocEvent = (data: any) => {
      const newAlert = {
        ...data,
        _id: data._id || `${Date.now()}-${Math.random()}`,
      };

      addUniqueAlert(newAlert);
    };

    const handleUpdated = (alert: any) => {
      setAlerts((prev) =>
        prev.map((a) => (a._id === alert._id ? alert : a))
      );
    };

    socket.on("systemAlertCreated", handleCreated);
    socket.on("socEvent", handleSocEvent);
    socket.on("systemAlertUpdated", handleUpdated);

    return () => {
      socket.off("systemAlertCreated", handleCreated);
      socket.off("socEvent", handleSocEvent);
      socket.off("systemAlertUpdated", handleUpdated);
      socket.disconnect();
    };
  }, []);

  const grouped = alerts.reduce((acc, alert) => {
    acc[alert.type] = acc[alert.type] || [];
    acc[alert.type].push(alert);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-12 gap-4 h-full">

      {/* LEFT PANEL */}
      <Card className="col-span-3 p-4 h-[88vh] flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-red-500" />

          <Input
            placeholder="Search threat logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 text-green-500 text-xs mb-3">
          <Zap size={12} />
          LIVE SOC STREAM ACTIVE
        </div>

        <AlertFeed
          alerts={filtered}
          activeId={activeId}
          setActiveId={setActiveId}
        />
      </Card>

      {/* CENTER WORKSPACE */}
      <Card className="col-span-6 h-[88vh] overflow-hidden">
        <AlertWorkspace alert={active} />
      </Card>

      {/* RIGHT PANEL */}
      <div className="col-span-3 space-y-4">
        <AlertPanel alert={active} />

        {active && (
          <Card className="p-4">
            <h3 className="font-bold mb-2">
              Threat Score: {active.severityScore}
            </h3>

            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{ width: `${active.severityScore}%` }}
              />
            </div>

            <p className="text-xs mt-2">
              Risk: <b>{active.riskLevel}</b>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}