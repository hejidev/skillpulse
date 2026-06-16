"use client";

import { motion } from "framer-motion";

const steps = [
    {
        title: "Track Skills",
        desc: "Log what you're learning daily with structured tracking.",
        icon: "📌",
    },
    {
        title: "Measure Progress",
        desc: "Visualize your growth with clear performance insights.",
        icon: "📊",
    },
    {
        title: "Reflect & Improve",
        desc: "Write reflections to understand and improve faster.",
        icon: "🧠",
    },
];

export default function HowItWorks() {
    return (
        <section id="how" className="py-24 px-6 bg-background
text-foreground
border-border">
            <div className="max-w-6xl mx-auto text-center">

                {/* 🔥 Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold"
                >
                    How It Works
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-4 text-gray-400"
                >
                    A simple system designed for real growth
                </motion.p>

                {/* 🚀 Steps */}
                <div className="hidden md:block absolute left-1/2 top-[60%] w-[60%] h-0.5 bg-linear-to-r from-green-500/30 to-purple-500/30 -translate-x-1/2" />
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: i * 0.2,
                                duration: 0.6,
                                ease: "easeOut",
                            }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:border-green-500/50 transition"
                        >
                            <div className="text-3xl mb-4">{step.icon}</div>

                            <h3 className="text-xl font-semibold mb-3">
                                {step.title}
                            </h3>

                            <p className="text-gray-400 text-sm">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}