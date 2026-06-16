"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await API.get(`/search?q=${encodeURIComponent(query)}`);

        setResults(res.data);
      } catch (err) {
        console.log(err);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [query]);

  const hasResults =
    results?.skills?.length > 0 || results?.progress?.length > 0;

  return (
    <div className="relative w-full">

      {/* 🔥 GLASS SEARCH INPUT */}
      <Input
        placeholder="Search skills, progress, notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          bg-white/5 
          border-white/10 
          backdrop-blur-xl 
          h-10 
          rounded-xl 
          px-4
          focus:ring-2 
          focus:ring-green-500
        "
      />

      {/* RESULTS */}
      <AnimatePresence>
        {(loading || hasResults || query) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="
              absolute 
              w-full 
              mt-3 
              bg-black/80 
              backdrop-blur-xl 
              border border-white/10 
              rounded-xl 
              p-3 
              z-50 
              shadow-2xl
            "
          >

            {/* LOADING */}
            {loading && (
              <p className="text-sm text-gray-400 p-2">
                Searching...
              </p>
            )}

            {/* EMPTY */}
            {!loading && !hasResults && query && (
              <p className="text-sm text-gray-400 p-2">
                No results found 😢
              </p>
            )}

            {/* SKILLS */}
            {results?.skills?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase">
                  Skills
                </p>

                {results.skills.map((s: any) => (
                  <div
                    key={s._id}
                    onClick={() => {
                      router.push(`/skills/${s._id}`);
                      setQuery("");
                      setResults(null);
                    }}
                    className="
                      p-2 
                      hover:bg-white/10 
                      rounded-lg 
                      cursor-pointer 
                      transition
                    "
                  >
                    ⚡ {s.name}
                  </div>
                ))}
              </div>
            )}

            {/* PROGRESS */}
            {results?.progress?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2 uppercase">
                  Progress
                </p>

                {results.progress.map((p: any) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      router.push(`/skills/${p.skillId}`);
                      setQuery("");
                      setResults(null);
                    }}
                    className="
                      p-2 
                      hover:bg-white/10 
                      rounded-lg 
                      cursor-pointer 
                      transition
                    "
                  >
                    📝 {p.note}
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}