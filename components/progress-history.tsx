"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface Props {
  skillId: string;
}

export default function ProgressHistory({ skillId }: Props) {
  const [logs, setLogs] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get(`/progress/${skillId}`);
        setLogs(res.data);

        if (res.data.length > 0) {
          setCurrent(res.data[0].value);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLogs();
  }, [skillId]);

  return (
    <div className="mt-4 space-y-3">
      
      <div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{current}%</span>
        </div>

        <Progress value={current} className="h-2 mt-1" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-600">
          Progress Logs
        </p>

        {logs.map((log) => (
          <div key={log._id} className="text-sm text-gray-500">
            +{log.value}% progress
          </div>
        ))}
      </div>

    </div>
  );
}