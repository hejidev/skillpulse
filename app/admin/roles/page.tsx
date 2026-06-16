"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Crown,
  Shield,
  UserCog,
  Users,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { AdminPageSkeleton } from "../admin-skeleton";


/* ===================== ROLE INTERFACE ================== */
interface Role {
  name: string;
  label: string;
  access: string;
  level: number;
  icon: any;
  permissions: string[];
}
/* ======================================================
   ROLE CONFIG
====================================================== */

const roles = [
  {
    name: "super_admin",
    label: "Super Admin",
    access: "Full System Control",
    level: 100,
    icon: Crown,

    permissions: [
      "Users Management",
      "Ticket System",
      "Billing Access",
      "System Settings",
      "Analytics Access",
      "Audit Logs",
      "Role Management",
    ],
  },

  {
    name: "admin",
    label: "Admin",
    access: "Moderate Access",
    level: 80,
    icon: Shield,

    permissions: [
      "Users Management",
      "Ticket System",
      "Billing Access",
      "Analytics Access",
      "Audit Logs",
    ],
  },

  {
    name: "support",
    label: "Support",
    access: "Ticket System Only",
    level: 50,
    icon: UserCog,

    permissions: [
      "Ticket System",
    ],
  },

  {
    name: "user",
    label: "User",
    access: "Limited Access",
    level: 10,
    icon: Users,

    permissions: [],
  },
];

/* ======================================================
   ALL PERMISSIONS
====================================================== */

const allPermissions = [
  "Users Management",
  "Ticket System",
  "Billing Access",
  "System Settings",
  "Analytics Access",
  "Audit Logs",
  "Role Management",
];

/* ======================================================
   PAGE
====================================================== */

export default function RolesRBAC() {
  const [selectedRole, setSelectedRole] =
    useState<Role>(roles[0]);
  
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);


  /* ======================================================
     ANALYTICS
  ====================================================== */

  const analytics = useMemo(() => {
    return {
      totalRoles: roles.length,

      totalPermissions:
        allPermissions.length,

      highestRole:
        roles[0].label,
    };
  }, []);

    if (loading) {
    return <AdminPageSkeleton />;
  }


  return (
    <div className="space-y-6">

      {/* ======================================================
         ANALYTICS
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <AnalyticsCard
          title="Roles"
          value={analytics.totalRoles}
          icon={Shield}
        />

        <AnalyticsCard
          title="Permissions"
          value={analytics.totalPermissions}
          icon={Lock}
        />

        <AnalyticsCard
          title="Highest Authority"
          value={analytics.highestRole}
          icon={Crown}
        />

      </div>

      {/* ======================================================
         MAIN GRID
      ====================================================== */}

      <div className="grid lg:grid-cols-12 gap-6">

        {/* ======================================================
           ROLES LIST
        ====================================================== */}

        <Card className="lg:col-span-4 p-5 bg-card/40 backdrop-blur-xl border border-border">

          <div className="flex items-center justify-between">

            <h2 className="text-lg font-semibold">
              Roles & Permissions
            </h2>

            <Badge className="bg-primary/10 text-primary">
              RBAC
            </Badge>

          </div>

          <div className="mt-6 space-y-3">

            {roles.map((role) => {
              const Icon = role.icon;

              const isActive =
                selectedRole.name === role.name;

              return (
                <div
                  key={role.name}
                  onClick={() =>
                    setSelectedRole(role)
                  }
                  className={`p-4 rounded-2xl border cursor-pointer transition
                  ${isActive
                      ? "border-primary bg-primary/10"
                      : "hover:bg-accent"
                    }`}
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="p-2 rounded-xl bg-primary/10">
                        <Icon className="w-4 h-4" />
                      </div>

                      <div>

                        <p className="font-medium">
                          {role.label}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {role.access}
                        </p>

                      </div>

                    </div>

                    <Badge variant="outline">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${role.level}%`,
                          }}
                        />
                        L{role.level}
                      </div>
                    </Badge>

                  </div>

                </div>
              );
            })}

          </div>

        </Card>

        {/* ======================================================
           ROLE DETAILS
        ====================================================== */}

        <Card className="lg:col-span-8 p-6 bg-card/40 backdrop-blur-xl border border-border">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                {selectedRole.label}
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                {selectedRole.access}
              </p>

            </div>

            <Badge>
              Level {selectedRole.level}
            </Badge>

          </div>

          {/* ======================================================
             PERMISSION MATRIX
          ====================================================== */}

          <div className="mt-8">

            <div className="flex items-center gap-2 mb-5">

              <CheckCircle2 className="w-4 h-4 text-green-500" />

              <h3 className="font-medium">
                Permission Matrix
              </h3>

            </div>

            <div className="space-y-4">

              {allPermissions.map(
                (permission, index) => {
                  const allowed =
                    selectedRole.permissions.includes(
                      permission
                    );

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-border pb-4"
                    >

                      <div>

                        <p className="text-sm font-medium">
                          {permission}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          Access control policy
                        </p>

                      </div>

                      <Checkbox
                        checked={allowed}
                        disabled
                      />

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* ======================================================
             SECURITY INFO
          ====================================================== */}

          <div className="mt-10 grid md:grid-cols-3 gap-4">

            <InfoCard
              label="Authority Level"
              value={`Level ${selectedRole.level}`}
            />

            <InfoCard
              label="Permissions"
              value={
                selectedRole.permissions.length
              }
            />

            <InfoCard
              label="System Scope"
              value={selectedRole.access}
            />

          </div>

        </Card>

      </div>

    </div>
  );
}

/* ======================================================
   ANALYTICS CARD
====================================================== */
interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: any;
}

function AnalyticsCard({
  title,
  value,
  icon: Icon,
}: AnalyticsCardProps) {
  return (
    <Card className="p-5 bg-card/40 backdrop-blur-xl border border-border">

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
   INFO CARD
====================================================== */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="p-4 rounded-2xl border bg-background/30">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <h3 className="font-semibold mt-2">
        {value}
      </h3>

    </div>
  );
}