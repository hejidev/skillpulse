import { useQuery } from "@tanstack/react-query";
import API from "@/lib/api";

export default function UserMenu() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await API.get("/settings/me");
      return res.data;
    },
  });

  return (
    <div className="relative group">
      <img
        src={user?.avatar || "/default-avatar.png"}
        className="w-10 h-10 rounded-full cursor-pointer"
      />

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 hidden group-hover:block bg-black border rounded-lg p-2">
        <p className="px-3 py-2">{user?.name}</p>

        <a href="/settings" className="block px-3 py-2 hover:bg-white/10">
          Settings
        </a>

        <button className="block px-3 py-2 text-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}