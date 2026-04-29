"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "David A.",
    role: "Frontend Developer",
    feedback:
      "SkillPulse completely changed how I track my growth. I now see real progress instead of guessing.",
  },
  {
    name: "Sarah K.",
    role: "UI/UX Designer",
    feedback:
      "The reflection feature is powerful. It helps me understand how I learn best.",
  },
  {
    name: "Michael T.",
    role: "Student",
    feedback:
      "I’ve stayed consistent for weeks because of the streak system. It’s addictive in a good way.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* 🔥 Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold"
        >
          Loved by people serious about growth
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-gray-400 max-w-xl mx-auto"
        >
          Join others who are building skills with intention.
        </motion.p>

        {/* 🚀 Testimonials */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.2,
                duration: 0.6,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur text-left"
            >
              {/* ⭐ Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-green-400 fill-green-400" />
                ))}
              </div>

              {/* 💬 Feedback */}
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                “{t.feedback}”
              </p>

              {/* 👤 User */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-400 to-purple-400 flex items-center justify-center text-black font-bold">
                  {t.name.charAt(0)}
                </div>

                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}