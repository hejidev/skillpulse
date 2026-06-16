"use client";

import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Users,
  Shield,
  Crown,
  UserCog,
  Lock,
  Search,
  Activity,
  Trash2,
  Ban,
  CheckCircle2,
  Wifi,
  WifiOff,
  Laptop,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import {
  getUsers,
  updateRole,
  suspendUser,
  activateUser,
  deleteUser,
  getAnalytics,
  getAuditLogs,
} from "@/lib/api/admin-users";
import { AdminPageSkeleton } from "../admin-skeleton";

/* ======================================================
   ROLES
====================================================== */
const roles = [
  {
    name: "super_admin",
    label: "Super Admin",
    icon: Crown,
    level: 100,
    limit: "Unlimited Control",
  },

  {
    name: "admin",
    label: "Admin",
    icon: Shield,
    level: 80,
    limit: "High Access",
  },

  {
    name: "support",
    label: "Support",
    icon: UserCog,
    level: 50,
    limit: "Ticket & User Help",
  },

  {
    name: "user",
    label: "User",
    icon: Users,
    level: 10,
    limit: "Basic Access",
  },
];

/* ======================================================
   PERMISSIONS
====================================================== */
const permissions = [
  "Users Management",
  "Ticket System",
  "Billing Access",
  "System Settings",
  "Analytics Access",
  "Audit Logs",
  "Role Management",
];

/* ======================================================
   TYPES
====================================================== */
interface IUser {
  _id: string;
  name: string;
  email: string;

  role: string;

  status: string;

  isOnline: boolean;

  lastLoginAt?: string;

  trustedDevices?: {
    device: string;
    ip: string;
    lastUsed: string;
  }[];

  riskScore?: number;

  securityFlags?: string[];

  createdAt?: string;
}

/* ======================================================
   PAGE
====================================================== */

export default function UsersRolesPage() {
  const [users, setUsers] = useState<IUser[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] =
    useState<IUser | null>(null);

  const [selectedRole, setSelectedRole] =
    useState<any>(roles[1]);

  const [serverAnalytics, setServerAnalytics] =
    useState<any>(null);

  const [auditLogs, setAuditLogs] =
    useState<any[]>([]);

  const [showAuditLogs, setShowAuditLogs] =
    useState(false);

  const [auditLoading, setAuditLoading] =
    useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || ""
      : "";

  useEffect(() => {
    if (selectedUser) {
      const foundRole = roles.find(
        (r) => r.name === selectedUser.role
      );

      if (foundRole) {
        setSelectedRole(foundRole);
      }
    }
  }, [selectedUser]);

  /* ======================================================
     FETCH USERS
  ====================================================== */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const [usersData, analyticsData] =
        await Promise.all([
          getUsers(token),
          getAnalytics(token),
        ]);

      setUsers(usersData.users);

      setServerAnalytics(
        analyticsData.analytics
      );

      if (usersData.users.length > 0) {
        setSelectedUser(usersData.users[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  /* ======================================================
     LIVE SEARCH
  ====================================================== */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();

      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  /* ======================================================
     ASSIGN ROLE
  ====================================================== */
  const handleAssignRole = async () => {
    if (!selectedUser) return;

    try {
      await updateRole(
        token,
        selectedUser._id,
        selectedRole.name
      );

      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  /* ======================================================
     SUSPEND USER
  ====================================================== */
  const handleSuspend = async () => {
    if (!selectedUser) return;

    try {
      await suspendUser(
        token,
        selectedUser._id
      );

      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  /* ======================================================
     ACTIVATE USER
  ====================================================== */
  const handleActivate = async () => {
    if (!selectedUser) return;

    try {
      await activateUser(
        token,
        selectedUser._id
      );

      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  /* ======================================================
     DELETE USER
  ====================================================== */
  const handleDelete = async () => {
    if (!selectedUser) return;

    const confirmDelete = confirm(
      `Delete ${selectedUser.name}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(
        token,
        selectedUser._id
      );

      setSelectedUser(null);

      await fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewAuditLogs =
    async () => {
      try {
        setAuditLoading(true);

        const data =
          await getAuditLogs(token, 1, 20);

        setAuditLogs(data.logs);

        setShowAuditLogs(true);
      } catch (err) {
        console.error(err);
      } finally {
        setAuditLoading(false);
      }
    };

    if (loading) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6">

      {/* ======================================================
         ANALYTICS
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

        <AnalyticsCard
          title="Total Users"
          value={serverAnalytics?.totalUsers || 0}
          icon={Users}
        />

        <AnalyticsCard
          title="Online"
          value={serverAnalytics?.onlineUsers || 0}
          icon={Activity}
        />

        <AnalyticsCard
          title="Admins"
          value={serverAnalytics?.admins || 0}
          icon={Shield}
        />

        <AnalyticsCard
          title="Active"
          value={serverAnalytics?.activeUsers || 0}
          icon={CheckCircle2}
        />

        <AnalyticsCard
          title="Suspended"
          value={serverAnalytics?.suspendedUsers || 0}
          icon={Ban}
        />

      </div>

      {/* ======================================================
         MAIN GRID
      ====================================================== */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* ======================================================
           USERS PANEL
        ====================================================== */}
        <Card className="lg:col-span-4 p-4 bg-card/40 backdrop-blur-xl h-[85vh] overflow-hidden flex flex-col">

          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">
              <Users size={18} />
              <h2 className="font-semibold">
                Users
              </h2>
            </div>

            <Badge variant="outline">
              {filteredUsers.length}
            </Badge>

          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-2 mb-4">
            <Search size={16} />

            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {/* USERS */}
          <div className="space-y-2 overflow-auto pr-1">

            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading users...
              </p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No users found
              </p>
            ) : (
              filteredUsers.map((u) => (
                <div
                  key={u._id}
                  onClick={() =>
                    setSelectedUser(u)
                  }
                  className={`p-4 rounded-2xl border cursor-pointer transition hover:bg-accent
                  ${selectedUser?._id === u._id
                      ? "border-primary bg-primary/10"
                      : ""
                    }`}
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-medium">
                        {u.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {u.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">

                      {u.isOnline ? (
                        <Wifi className="text-green-500 w-4 h-4" />
                      ) : (
                        <WifiOff className="text-muted-foreground w-4 h-4" />
                      )}

                      <Status
                        status={u.status}
                      />

                    </div>

                  </div>

                  <div className="flex items-center justify-between mt-3">

                    <Badge variant="outline">
                      {u.role}
                    </Badge>

                    {u.riskScore &&
                      u.riskScore >= 70 && (
                        <Badge variant="destructive">
                          AI Risk
                        </Badge>
                      )}

                  </div>

                </div>
              ))
            )}

          </div>

        </Card>

        {/* ======================================================
           CONTROL CENTER
        ====================================================== */}
        <Card className="lg:col-span-4 p-5 bg-card/40 backdrop-blur-xl h-[85vh] overflow-auto">

          <div className="flex items-center gap-2">
            <Shield />
            <h2 className="font-semibold">
              Role Control Center
            </h2>
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            Enterprise RBAC governance system
          </p>

          {/* USER DETAILS */}
          {selectedUser && (
            <div className="mt-6 p-4 rounded-2xl border bg-background/40">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold">
                    {selectedUser.name}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>

                {selectedUser.isOnline ? (
                  <Badge>
                    Online
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Offline
                  </Badge>
                )}

              </div>

              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Role
                  </span>

                  <span>
                    {selectedUser.role}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Status
                  </span>

                  <span>
                    {selectedUser.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Last Login
                  </span>

                  <span>
                    {selectedUser.lastLoginAt
                      ? new Date(
                        selectedUser.lastLoginAt
                      ).toLocaleString()
                      : "Never"}
                  </span>
                </div>

              </div>

            </div>
          )}

          {/* ROLES */}

          <div className="mt-6 space-y-3">

            {roles.map((r) => {
              const Icon = r.icon;

              return (
                <div
                  key={r.name}
                  onClick={() =>
                    setSelectedRole(r)
                  }
                  className={`p-4 border rounded-2xl cursor-pointer transition
                  ${selectedRole.name ===
                      r.name
                      ? "border-primary bg-primary/10"
                      : ""
                    }`}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <Icon size={16} />

                      <p className="font-medium">
                        {r.label}
                      </p>
                    </div>

                    <Badge variant="outline">
                      Level {r.level}
                    </Badge>

                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    {r.limit}
                  </p>

                </div>
              );
            })}

          </div>

          {/* ACTIONS */}

          <div className="grid grid-cols-2 gap-3 mt-6">

            <Button
              onClick={handleAssignRole}
              className="col-span-2"
            >
              Assign Role →
              {" "}
              {selectedUser?.name}
            </Button>

            <Button
              variant="destructive"
              onClick={handleSuspend}
            >
              <Ban className="w-4 h-4 mr-2" />
              Suspend
            </Button>

            <Button
              variant="secondary"
              onClick={handleActivate}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Activate
            </Button>

            <Button
              variant="outline"
              className="col-span-2"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </Button>

          </div>

        </Card>

        {/* ======================================================
           SECURITY PANEL
        ====================================================== */}

        <Card className="lg:col-span-4 p-5 bg-card/40 backdrop-blur-xl h-[85vh] overflow-auto">

          <div className="flex items-center gap-2">
            <Lock />
            <h2 className="font-semibold">
              Security Intelligence
            </h2>
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            AI-driven monitoring & audit system
          </p>

          {/* PERMISSIONS */}

          <div className="mt-6">

            <h3 className="text-sm font-medium mb-4">
              Permission Matrix
            </h3>

            <div className="space-y-4">

              {permissions.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border pb-3"
                >
                  <p className="text-sm">{p}</p>

                  <div className="flex gap-4">

                    <Checkbox
                      checked={selectedRole.name === "super_admin"}
                    />

                    <Checkbox
                      checked={
                        selectedRole.name === "admin" ||
                        selectedRole.name === "super_admin"
                      }
                    />

                    <Checkbox
                      checked={
                        selectedRole.name !== "user"
                      }
                    />

                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* DEVICES */}

          <div className="mt-8">

            <div className="flex items-center gap-2 mb-4">
              <Laptop className="w-4 h-4" />

              <h3 className="font-medium">
                Device Tracking
              </h3>
            </div>

            <div className="space-y-3">

              {selectedUser?.trustedDevices
                ?.slice(0, 3)
                .map((device, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border"
                  >

                    <div className="flex items-center justify-between">

                      <p className="text-sm font-medium">
                        {device.device}
                      </p>

                      <Badge variant="outline">
                        Trusted
                      </Badge>

                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      {device.ip}
                    </p>

                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock3 className="w-3 h-3" />

                      {new Date(
                        device.lastUsed
                      ).toLocaleString()}
                    </div>

                  </div>
                ))}

            </div>

          </div>

          {/* AI RISK */}

          <div className="mt-8">

            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />

              <h3 className="font-medium">
                AI Risk Detection
              </h3>
            </div>

            <div className="p-4 rounded-2xl border bg-background/30">

              <div className="flex items-center justify-between">

                <p className="text-sm">
                  Risk Score
                </p>

                <Badge
                  variant={
                    (selectedUser?.riskScore || 0) >
                      70
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {selectedUser?.riskScore || 12}%
                </Badge>

              </div>

              <div className="mt-4 space-y-2">

                {selectedUser?.securityFlags
                  ?.length ? (
                  selectedUser.securityFlags.map(
                    (flag, index) => (
                      <div
                        key={index}
                        className="text-xs border rounded-lg p-2"
                      >
                        {flag}
                      </div>
                    )
                  )
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No suspicious activity detected
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* AUDIT */}

          <Button
            variant="outline"
            className="w-full mt-8"
            onClick={handleViewAuditLogs}
          >
            <Activity className="w-4 h-4 mr-2" />
            View Audit Logs
          </Button>

        </Card>

      </div>

      {showAuditLogs && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

          <div className="bg-background border rounded-3xl w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col">

            <div className="flex items-center justify-between p-5 border-b">

              <div>
                <h2 className="text-xl font-bold">
                  Security Audit Logs
                </h2>

                <p className="text-sm text-muted-foreground">
                  Real-time security events
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={() =>
                  setShowAuditLogs(false)
                }
              >
                Close
              </Button>

            </div>

            <div className="flex-1 overflow-auto p-5 space-y-3">

              {auditLoading ? (
                <p>Loading logs...</p>
              ) : auditLogs.length === 0 ? (
                <p>No audit logs found</p>
              ) : (
                auditLogs.map((log, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-4"
                  >

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="font-medium">
                          {log.action}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {log.ip}
                        </p>
                      </div>

                      <Badge>
                        {log.severity || "info"}
                      </Badge>

                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">

                      <p>
                        Device:
                        {" "}
                        {log.device}
                      </p>

                      <p>
                        Time:
                        {" "}
                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>
                ))
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ======================================================
   ANALYTICS CARD
====================================================== */
function AnalyticsCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <Card className="p-4 bg-card/40 backdrop-blur-xl">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div className="p-3 rounded-2xl bg-primary/10">
          <Icon className="w-5 h-5" />
        </div>

      </div>

    </Card>
  );
}

/* ======================================================
   STATUS
====================================================== */

function Status({
  status,
}: {
  status: string;
}) {
  const color =
    status === "active"
      ? "bg-green-500"
      : status === "suspended"
        ? "bg-red-500"
        : "bg-yellow-500";

  return (
    <span
      className={`w-2.5 h-2.5 rounded-full ${color}`}
    />
  );
}