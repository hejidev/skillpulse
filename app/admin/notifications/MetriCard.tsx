"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  color = "cyan",
  description,
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-card
        p-6
      "
    >
      {/* glow */}
      <div
        className={`
          absolute
          top-0
          right-0
          w-32
          h-32
          blur-3xl
          opacity-20
          bg-${color}-500
        `}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-black mt-3">
            {value}
          </h2>

          {description && (
            <p className="text-xs text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>

        <div
          className={`
            w-14
            h-14
            rounded-2xl
            flex
            items-center
            justify-center
            bg-${color}-500/10
            text-${color}-400
          `}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

const variants = {
  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },

  emerald: {
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },

  yellow: {
    icon: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },

  red: {
    icon: "text-red-400",
    bg: "bg-red-500/10",
  },

  purple: {
    icon: "text-purple-400",
    bg: "bg-purple-500/10",
  },
};

function MetricCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted rounded" />

          <div className="h-10 w-16 bg-muted rounded" />

          <div className="h-3 w-32 bg-muted rounded" />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}