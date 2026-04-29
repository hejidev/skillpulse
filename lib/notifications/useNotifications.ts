import { useEffect } from "react";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";

export function useSmartNotifications(data: any[]) {
  useEffect(() => {
    if (!data.length) return;

    const lastEntry = data[data.length - 1];

    const daysAway = differenceInDays(
      new Date(),
      new Date(lastEntry.createdAt)
    );

    if (daysAway === 1) {
      toast("👀 You missed yesterday. Log progress today!");
    }

    if (daysAway >= 3) {
      toast.error("⚠️ You’re losing momentum!");
    }
  }, [data]);
}