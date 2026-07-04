import Footer from "@/components/footer";

export default function CommunityPage() {
    const communities = [
        {
            id: "01",
            title: "Frontend Developers",
            members: "12.4K Members",
            description:
                "Connect with frontend engineers, UI designers, and React developers building modern web experiences.",
            glow: "from-cyan-500/10",
            border: "border-cyan-500/20",
            text: "text-cyan-400",
            icon: "💻",
        },

        {
            id: "02",
            title: "UI/UX Designers",
            members: "8.1K Members",
            description:
                "Share interface ideas, product experiences, design systems, animations, and visual inspiration.",
            glow: "from-pink-500/10",
            border: "border-pink-500/20",
            text: "text-pink-400",
            icon: "🎨",
        },

        {
            id: "03",
            title: "AI & Productivity",
            members: "15.7K Members",
            description:
                "Explore artificial intelligence, productivity systems, workflows, automation, and growth strategies.",
            glow: "from-emerald-500/10",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
            icon: "🤖",
        },

        {
            id: "04",
            title: "Career Growth",
            members: "5.9K Members",
            description:
                "Discuss freelancing, interviews, portfolio building, remote jobs, and professional growth.",
            glow: "from-orange-500/10",
            border: "border-orange-500/20",
            text: "text-orange-400",
            icon: "🚀",
        },
    ];

    const features = [
        {
            title: "Community Discussions",
            description:
                "Participate in meaningful conversations around learning, skills, productivity, and growth.",
            icon: "💬",
        },

        {
            title: "Peer Collaboration",
            description:
                "Connect with learners, creators, and developers from around the world.",
            icon: "🤝",
        },

        {
            title: "Challenges & Events",
            description:
                "Join community challenges, streak competitions, and productivity events.",
            icon: "🏆",
        },

        {
            title: "Knowledge Sharing",
            description:
                "Share resources, project ideas, learning experiences, and career insights.",
            icon: "📚",
        },
    ];

    return (
        <>
            <section className="relative overflow-hidden py-24 px-6 bg-background text-foreground">
                <div className="max-w-6xl mx-auto flex items-center justify-between p-3 mb-5 rounded-xl border border-border bg-card/40 backdrop-blur-xl">

                    <div className="flex items-center gap-2 text-center">
                        <span className="w-2 h-2 rounded-full  bg-green-500 animate-pulse" />
                        <span className="text-xs sm:text-sm  text-muted-foreground">
                            Live Community Activity
                        </span>
                    </div>

                    <div className="text-xs sm:text-sm text-center text-muted-foreground">
                        2,451 online • 87 new today
                    </div>
                </div>
                {/* BACKGROUND GLOW */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-225 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative max-w-7xl mx-auto">

                    {/* HERO */}
                    <div className="text-center max-w-4xl mx-auto">

                        <div className="
            inline-flex items-center gap-2
            px-5 py-2 rounded-full
            border border-primary/20
            bg-primary/10
            text-primary
            text-sm
            mb-8
          ">
                            Global Learning Community
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                            Grow Together.
                            <span className="block text-primary">
                                Learn Beyond Limits.
                            </span>
                        </h1>

                        <p className="mt-3 text-md md:text-xl text-muted-foreground leading-relaxed">
                            SkillPulse Community brings together developers, creators,
                            learners, designers, and ambitious minds building consistency,
                            skills, and meaningful growth together.
                        </p>

                        {/* ACTIONS */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-5">

                            <button
  className="px-4 py-3 rounded-2xl bg-primary text-primary-foreground opacity-80 cursor-not-allowed"
>
  Community Coming Soon
</button>

<button
  className="
    px-4 py-3 rounded-2xl
    border border-border
    bg-card/40 backdrop-blur-xl
    opacity-80 cursor-not-allowed
  "
>
  Explore Discussions (Soon)
</button>

                        </div>

                    </div>

                    {/* STATS */}
                    <div className="mt-24 mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6">

                        {[
                            { label: "Members", value: "40K+" },
                            { label: "Communities", value: "120+" },
                            { label: "Daily Discussions", value: "8K+" },
                            { label: "Countries", value: "70+" },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="
                relative overflow-hidden
                rounded-3xl
                border border-border/30
                bg-card/40 backdrop-blur-xl
                p-4 text-center
              "
                            >

                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                                <div className="relative">

                                    <h2 className="text-4xl font-bold text-primary">
                                        {stat.value}
                                    </h2>

                                    <p className="mt-3 text-muted-foreground">
                                        {stat.label}
                                    </p>

                                </div>
                            </div>
                        ))}

                    </div>

                    {/* COMMUNITY GROUPS */}
                    <div className="mt-20">

                        <div className="text-center max-w-2xl mx-auto mb-16">

                            <h2 className="text-3xl md:text-5xl font-bold">
                                Explore Communities
                            </h2>

                            <p className="mt-3 text-muted-foreground text-lg leading-relaxed">
                                Discover focused spaces designed for collaboration,
                                learning, accountability, and inspiration.
                            </p>

                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-7xl px-0 sm:px-7">

                            {communities.map((community) => (
                                <div
                                    key={community.id}
                                    className="
                  relative overflow-hidden
                  rounded-[2rem]
                  border border-border/30
                  bg-card/40 backdrop-blur-xl
                  p-4 md:p-10
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-primary/90
                "
                                >

                                    {/* GLOW */}
                                    <div
                                        className={`
                    absolute inset-0
                    bg-linear-to-br ${community.glow}
                    via-transparent to-transparent
                    pointer-events-none
                  `}
                                    />

                                    <div className="relative">

                                        {/* TOP */}
                                        <div className="flex items-start justify-between gap-5">

                                            <div className="flex items-start gap-2 sm:gap-5">

                                                <div
                                                    className={`
                          w-14 h-14 rounded-3xl
                          border ${community.border}
                          bg-background/40
                          flex items-center justify-center
                          text-xl
                        `}
                                                >
                                                    {community.icon}
                                                </div>

                                                <div>

                                                    <p className={`text-sm ${community.text} mb-2`}>
                                                        {community.members}
                                                    </p>

                                                    <h3 className="text-xl sm:text-2xl font-bold">
                                                        {community.title}
                                                    </h3>

                                                </div>

                                            </div>

                                            <div className="
                      px-3 py-1 rounded-full
                      border border-border/50
                      text-xs text-muted-foreground
                    ">
                                                {community.id}
                                            </div>

                                        </div>

                                        {/* CONTENT */}
                                        <p className="mt-5 text-muted-foreground leading-relaxed">
                                            {community.description}
                                        </p>

                                        {/* FOOTER */}
                                        <div className="mt-6 flex items-center justify-between gap-5">

                                            <button
                                                className="px-4 py-3 rounded-2xl bg-brand text-primary-foreground opacity-80 cursor-not-allowed"
                                            >
                                                Community Coming Soon
                                            </button>

                                            <button
                                                className="
    px-4 py-3 rounded-2xl
    border border-border/30
    bg-card/40 backdrop-blur-xl
    opacity-80 cursor-not-allowed
  "
                                            >
                                                Explore Discussions (Soon)
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* FEATURES */}
                    <div className="mt-17 sm:mt-22 max-w-7xl px-0 sm:px-7">

                        <div className="text-center max-w-2xl mx-auto mb-10">

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                                Why Join SkillPulse Community?
                            </h2>

                            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                                More than a platform, a thriving ecosystem built
                                around consistency, collaboration, and growth.
                            </p>

                        </div>

                        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="
                  relative overflow-hidden
                  rounded-3xl
                  border border-border/30
                  bg-card/40 backdrop-blur-xl
                  p-4
                  transition-all duration-300
                  hover:-translate-y-1
                "
                                >

                                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

                                    <div className="relative">

                                        <div className="
                    w-14 h-14 rounded-3xl
                    bg-primary/10
                    border border-primary/20
                    flex items-center justify-center
                    text-xl
                    mb-6
                  ">
                                            {feature.icon}
                                        </div>

                                        <h3 className="text-xl font-bold">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-4 text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>

                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>

                    {/* CTA */}
                    <div className="
          mt-25 relative overflow-hidden
          rounded-[2.5rem]
          border border-border/30
          bg-card/40 backdrop-blur-xl
          p-5 md:p-15
          text-center
        ">

                        <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />

                        <div className="relative max-w-3xl mx-auto">

                            <div className="
              w-20 h-20 rounded-[2rem]
              bg-primary/10
              border border-primary/20
              flex items-center justify-center
              text-4xl
              mx-auto mb-10
            ">
                                🌍
                            </div>

                            <h2 className="text-2xl md:text-5xl font-bold leading-tight">
                                Build Consistency
                                <span className="block text-primary">
                                    With People Like You.
                                </span>
                            </h2>

                            <p className="mt-3 text-sm md:text-lg text-muted-foreground leading-relaxed">
                                Join a premium network of learners and creators focused
                                on discipline, accountability, productivity, and long-term growth.
                            </p>

                            <div className="mt-12 flex sm:flex-row items-center justify-center gap-5">

                                <button
                                    className="
                  px-4 py-3 rounded-2xl
                  bg-brand text-primary-foreground
                  font-medium
                  text-sm md:text-xl
                  transition-all duration-300
                  hover:scale-[1.03]
                "
                                >
                                    Join the Community (soon)
                                </button>

                                <button
                                    className="
                  px-8 py-4 rounded-2xl
                  border border-border/30
                  bg-background/40
                  hover:bg-accent
                  transition-all duration-300
                  "
                                >
                                    Learn More
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