"use client";
import Link from "next/link";

import { useState } from "react";
import { helpArticles } from "@/data/help-center";


import Footer from "@/components/footer";

export default function HelpCenterPage() {
  const [query, setQuery] = useState("");

  const filteredArticles = helpArticles.filter((article) =>
    `${article.title} ${article.category} ${article.content}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );


  const helpSections = [
    {
      id: "01",
      title: "Getting Started",
      subtitle: "Learn how to begin using SkillPulse effectively.",
      color: "from-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      items: [
        "Create your account and personalize your profile.",
        "Add skills and organize your learning goals.",
        "Track sessions, progress, and consistency streaks.",
        "Explore analytics, achievements, and leaderboards.",
      ],
    },

    {
      id: "02",
      title: "Account & Security",
      subtitle: "Manage passwords, login activity, and account settings.",
      color: "from-indigo-500/10",
      border: "border-indigo-500/20",
      text: "text-indigo-400",
      items: [
        "Reset forgotten passwords securely.",
        "Update email addresses and profile information.",
        "Protect your account credentials and sessions.",
        "Manage notification and privacy preferences.",
      ],
    },

    {
      id: "03",
      title: "Progress Tracking",
      subtitle: "Understand how SkillPulse measures growth.",
      color: "from-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      items: [
        "XP increases through completed learning sessions.",
        "Consistency streaks reward continuous activity.",
        "Achievements unlock based on milestones.",
        "Analytics help identify strengths and weak areas.",
      ],
    },

    {
      id: "04",
      title: "Technical Support",
      subtitle: "Solutions for platform or performance issues.",
      color: "from-orange-500/10",
      border: "border-orange-500/20",
      text: "text-orange-400",
      items: [
        "Resolve loading or synchronization issues.",
        "Fix dashboard or session tracking problems.",
        "Troubleshoot browser compatibility errors.",
        "Contact support for unresolved technical issues.",
      ],
    },
  ];

  return (
    <>
    <section className="relative overflow-hidden py-24 px-6 bg-background text-foreground">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-187.5 h-187.5 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto">

          <div className="
            inline-flex items-center gap-2
            px-4 py-2 rounded-full
            border border-primary/20
            bg-primary/10
            text-primary
            text-sm
            mb-6
          ">
            Support & Assistance
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Help Center
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Everything you need to understand, manage, and maximize
            your SkillPulse experience. Explore guides, support topics,
            troubleshooting solutions, and platform assistance.
          </p>

        </div>

        {/* QUICK SEARCH */}
        <div className="mt-14 max-w-2xl mx-auto">

          <div className="
            relative overflow-hidden
            rounded-3xl border border-border
            bg-card/40 backdrop-blur-xl
            p-3
          ">

            <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative flex items-center gap-3">

              <div className="
                w-11 h-11 rounded-2xl
                bg-primary/10
                border border-primary/20
                flex items-center justify-center
                text-primary
              ">
                🔍
              </div>

              <input
                type="text"
                placeholder="Search help articles, topics, or support..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
    flex-1 bg-transparent outline-none
    text-sm md:text-base
    placeholder:text-muted-foreground
  "
              />

            </div>
          </div>
          {query && (
            <div className="mt-6 space-y-4">

              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="
            p-5 rounded-2xl
            border border-border
            bg-card/40 backdrop-blur-xl
          "
                  >
                    <p className="text-xs text-primary mb-2">
                      {article.category}
                    </p>

                    <h3 className="text-lg font-semibold">
                      {article.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mt-2">
                      {article.content}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="
          p-6 rounded-2xl
          border border-border
          bg-card/30 text-center
        "
                >
                  <p className="text-muted-foreground">
                    No help articles found.
                  </p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* HELP GRID */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">

          {helpSections.map((section) => (
            <div
              key={section.id}
              className="
                relative overflow-hidden
                rounded-3xl border border-border
                bg-card/40 backdrop-blur-xl
                p-8 md:p-10
                transition-all duration-300
                hover:-translate-y-1
                hover:border-primary/20
              "
            >

              {/* GLOW */}
              <div
                className={`
                  absolute inset-0
                  bg-linear-to-br ${section.color}
                  via-transparent to-transparent
                  pointer-events-none
                `}
              />

              <div className="relative">

                {/* TOP */}
                <div className="flex items-start gap-4 mb-8">

                  <div
                    className={`
                      w-14 h-14 rounded-2xl
                      border ${section.border}
                      bg-background/40
                      flex items-center justify-center
                      ${section.text}
                      text-lg font-bold
                    `}
                  >
                    {section.id}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {section.title}
                    </h2>

                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {section.subtitle}
                    </p>
                  </div>

                </div>

                {/* ITEMS */}
                <div className="space-y-4">

                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="
                        flex items-start gap-3
                        p-4 rounded-2xl
                        border border-border/60
                        bg-background/30
                      "
                    >

                      <div className="
                        mt-1 w-2 h-2 rounded-full
                        bg-primary
                      " />

                      <p className="text-muted-foreground leading-relaxed">
                        {item}
                      </p>

                    </div>
                  ))}

                </div>

              </div>
            </div>
          ))}

        </div>

        {/* CONTACT SUPPORT */}
        <div className="
          mt-20 relative overflow-hidden
          rounded-[2rem]
          border border-border
          bg-card/40 backdrop-blur-xl
          p-10 md:p-14
          text-center
        ">

          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-3xl mx-auto">

            <div className="
              w-20 h-20 rounded-3xl
              bg-primary/10
              border border-primary/20
              flex items-center justify-center
              text-4xl
              mx-auto mb-8
            ">
              💬
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">
              Still Need Help?
            </h2>

            <p className="mt-5 text-muted-foreground leading-relaxed text-lg">
              Our support team is available to help you with technical
              issues, account questions, platform guidance, and feedback.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

              <button
                className="
                  px-8 py-4 rounded-2xl
                  bg-primary text-primary-foreground
                  font-medium
                  transition-all duration-300
                  hover:scale-[1.02]
                "
              > <Link href="/company/contacts">
                  Contact Support
                </Link>
              </button>

              <button
                className="
                  px-8 py-4 rounded-2xl
                  border border-border
                  bg-background/40
                  hover:bg-accent
                  transition-all duration-300
                "
              >
                <Link href="#">
                  Browse Documentation
                </Link>
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
    <Footer />
    </>
  );
}