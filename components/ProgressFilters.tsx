import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

export function ProgressFilters({ setFilter, setRange }: any) {
  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await API.get("/skills");
      return res.data;
    },
  });

  return (
    <div className="flex gap-3 items-center">

      {/* SKILL FILTER */}
      <select
        onChange={(e) => setFilter(e.target.value)}
        className="bg-white/5 border px-3 py-1 rounded"
      >
        <option value="all">All Skills</option>

        {skills.map((skill: any) => (
          <option key={skill._id} value={skill._id} className="text-black">
            {skill.name}
          </option>
        ))}
      </select>

      {/* TIME FILTER */}
      <select
        onChange={(e) => setRange(e.target.value)}
        className="bg-background border px-3 py-1 rounded"
      >
        <option value="7" className="text-muted-foreground">Last 7 days</option>
        <option value="30" className="text-muted-foreground">Last 30 days</option>
        <option value="90" className="text-muted-foreground">Last 90 days</option>
      </select>

    </div>
  );
}