"use client";

import { useEffect, useState } from "react";
import { getPublicAbout } from "@/lib/api/about-api";
import {
  Activity,
  Users,
  Target,
  BarChart3,
  Quote,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import Testimonials from "@/components/Testimonials";
import AboutSkeleton from "@/components/AboutSkeleton";

interface AboutData {
  heroTitle: string;
  heroSubtitle?: string;
  heroBadge?: string;
  heroImage?: string;

  founderMessage?: string;
  founderName?: string;
  founderRole?: string;
  founderImage?: string;

  companyFounded?: string;
  headquarters?: string;
  activeUsers?: string;
  countriesReached?: string;
  employees?: string;

  storyTitle?: string;
  storyContent?: string;
  storyImage?: string;

  mission?: string;
  vision?: string;

  stats?: { title: string; value: string; icon?: string }[];
  values?: { title: string; description: string; icon?: string }[];
  timeline?: { year: string; title: string; description: string }[];

  team?: {
    name: string;
    role: string;
    image?: string;
    bio?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  }[];

  testimonials?: {
    name: string;
    role: string;
    image?: string;
    quote: string;
  }[];

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function PublicAboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublicAbout();
        setAbout(data.about || null);
      } catch (err) {
        console.error("Failed to load public about", err);
        setAbout(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return  <AboutSkeleton/>
  }

  if (!about) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        About page is not available yet.
      </div>
    );
  }

  return (
    <main className="bg-background text-foreground">
      {/* GLOBAL GLOW BACKGROUND */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_55%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_55%)]" />

        <motion.div
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex max-w-6xl flex-col gap-24"
        >
          {/* ================= HERO ================= */}
          <motion.header
            variants={containerStagger}
            className="grid items-center gap-12 md:grid-cols-[1.4fr,1fr]"
          >
            <motion.div variants={fadeInUp} className="space-y-6">
              {about.heroBadge && (
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur-xl">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{about.heroBadge}</span>
                </div>
              )}

              <div className="space-y-3">
                <h1 className="text-xl font-bold leading-tight md:text-3xl lg:text-4xl">
                  {about.heroTitle}
                </h1>

                {/* Hero visual with parallax-ish layers */}
            {about.heroImage && (
              <motion.div
                variants={fadeInUp}
                className="relative h-full"
                whileHover={{ y: -4, transition: { duration: 0.4 } }}
              >
                <div className="absolute -inset-6 rounded-[32px] bg-linear-to-tr from-primary/25 via-blue-500/10 to-transparent blur-3xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-border bg-card/70 shadow-2xl backdrop-blur-xl my-10">
                  <motion.img
                    src={about.heroImage}
                    alt={about.heroTitle}
                    className="max-h-150 w-full object-cover"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}
                {about.heroSubtitle && (
                  <p className="text-[15px] sm:text-lg font-medium text-primary">
                    {about.heroSubtitle}
                  </p>
                )}
              </div>

              <p className="max-w-xl text-[15px] sm:text-lg text-muted-foreground">
                Built for ambitious learners, teams, and creators who want an
                intelligence-grade skill engine—not just another course
                catalog.
              </p>

              {/* Stats row */}
              <div className="grid gap-4 text-sm sm:text-lg sm:grid-cols-3">
                {about.companyFounded && (
                  <HeroStat label="Founded" value={about.companyFounded} />
                )}
                {about.headquarters && (
                  <HeroStat label="HQ" value={about.headquarters} />
                )}
                {about.activeUsers && (
                  <HeroStat label="Active users" value={about.activeUsers} />
                )}
              </div>
            </motion.div>
          </motion.header>

          {/* ================= STORY + FOUNDER STRIP ================= */}
          <motion.section
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-10 rounded-3xl backdrop-blur-xl lg:grid-cols-[1.4fr,1fr]"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              {about.storyTitle && (
                <h2 className="text-2xl font-semibold uppercase">{about.storyTitle}</h2>
              )}
              {about.storyContent && (
                <p className="whitespace-pre-line text-[15px] sm:text-lg leading-relaxed text-muted-foreground">
                  {about.storyContent}
                </p>
              )}

              <div className="grid gap-4 pt-4 text-[15px] sm:text-lg md:grid-cols-2">
                {about.mission && (
                  <MiniCard
                    icon={<Target className="h-4 w-4 text-primary" />}
                    title="Mission"
                    body={about.mission}
                  />
                )}
                {about.vision && (
                  <MiniCard
                    icon={<BarChart3 className="h-4 w-4 text-primary" />}
                    title="Vision"
                    body={about.vision}
                  />
                )}
              </div>
            </motion.div>

            {(about.founderName ||
              about.founderRole ||
              about.founderMessage ||
              about.founderImage) && (
              <motion.div
                variants={fadeInUp}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  {about.founderImage && (
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-primary/40 blur-md" />
                      <img
                        src={about.founderImage}
                        alt={about.founderName || "Founder"}
                        className="relative h-16 w-16 rounded-full border border-border bg-background object-cover"
                      />
                    </div>
                  )}
                  <div>
                    {about.founderName && (
                      <p className="text-sm font-semibold">
                        {about.founderName}
                      </p>
                    )}
                    {about.founderRole && (
                      <p className="text-xs text-muted-foreground">
                        {about.founderRole}
                      </p>
                    )}
                  </div>
                </div>

                {about.founderMessage && (
                  <Card className="text-sm text-muted-foreground bg-transparent border border-border/0 backdrop-blur-xl">
                    <div className="flex gap-3">
                      <Quote className="mt-1 h-4 w-4 text-primary" />
                      <p className="leading-relaxed text-lg bg-transparent">{about.founderMessage}</p>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}
          </motion.section>

          {/* ================= TRUST STRIP: STATS + VALUES ================= */}
          {(about.stats?.length || about.values?.length) && (
            <motion.section
              variants={containerStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="grid items-start gap-10 lg:grid-cols-[1.05fr,1.35fr]"
            >
              {about.stats?.length ? (
                <motion.div variants={fadeInUp} className="space-y-4">
                  <SectionTitle
                    icon={<BarChart3 className="h-4 w-4 text-primary" />}
                    label="Signals we're delivering real value"
                    badge="Impact metrics"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {about.stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="border-border/30 bg-card/60 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="mt-1 text-2xl font-semibold">
                            {stat.value}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null}

              {about.values?.length ? (
                <motion.div variants={fadeInUp} className="space-y-4">
                  <SectionTitle
                    icon={<Target className="h-4 w-4 text-primary" />}
                    label="Principles that guide our work"
                    badge="Operating values"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    {about.values.map((v, i) => (
                      <motion.div
                        key={i}
                        variants={fadeInUp}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Card className="h-full border-border/30 bg-card/60 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80">
                          <p className="text-sm font-medium">{v.title}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {v.description}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </motion.section>
          )}

          {/* ================= TIMELINE ================= */}
          {about.timeline?.length && (
            <motion.section
              variants={containerStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-4"
            >
              <SectionTitle
                icon={<Activity className="h-4 w-4 text-primary" />}
                label="Moments that shaped our journey"
                badge="Timeline"
              />
              <ol className="relative space-y-6 border-l border-border/30 pl-4">
                {about.timeline.map((item, i) => (
                  <motion.li
                    key={i}
                    variants={fadeInUp}
                    className="space-y-1"
                  >
                    <div className="absolute -left-2.25 mt-1 h-3 w-3 rounded-full border border-border/30 bg-background" />
                    <p className="text-xs uppercase tracking-wide text-primary">
                      {item.year}
                    </p>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-lg text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.li>
                ))}
              </ol>
            </motion.section>
          )}

          {/* ================= TEAM ================= */}
          {about.team?.length && (
            <motion.section
              variants={containerStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="space-y-4"
            >
              <SectionTitle
                icon={<Users className="h-4 w-4 text-primary" />}
                label="The people behind the platform"
                badge="Leadership & team"
              />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {about.team.map((member, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="flex h-full flex-col gap-3 border-border/30 p-4 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80">
                      <div className="flex items-center gap-3">
                        {member.image && (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-10 w-10 rounded-full border border-border/30 bg-background object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {member.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-4">
                          {member.bio}
                        </p>
                      )}

                      {(member.linkedin ||
                        member.twitter ||
                        member.github) && (
                        <div className="mt-auto flex flex-wrap gap-2">
                          {member.linkedin && (
                            <SocialChip href={member.linkedin} label="LinkedIn" />
                          )}
                          {member.twitter && (
                            <SocialChip href={member.twitter} label="Twitter" />
                          )}
                          {member.github && (
                            <SocialChip href={member.github} label="GitHub" />
                          )}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ============== TESTIMONIALS ============ */}
          <Testimonials/>

          {/* ================= CTA ================= */}
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="rounded-3xl border border-border/30 bg-card/60 p-5 text-center backdrop-blur-xl"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Turn skill building into a real advantage
            </h2>
            <p className="mt-4 text-sm text-muted-foreground md:text-base">
              Join ambitious builders using our platform to learn faster, ship
              better, and unlock new opportunities.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-col sm:flex-row sm:items-center">
              <Button className="rounded-2xl px-8 py-4 text-sm md:text-base">
                Start learning now
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl px-8 py-4 text-sm md:text-base"
              >
                Talk to our team
              </Button>
            </div>
          </motion.section>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-medium">{value}</p>
    </div>
  );
}

function SectionTitle({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <h2 className="text-lg font-semibold">{label}</h2>
      </div>
      <Badge className="border-primary/30 bg-primary/10 text-xs text-primary">
        {badge}
      </Badge>
    </div>
  );
}

function MiniCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="border-border/30 bg-card/60 p-4 backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <p className="text-sm font-medium">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground">{body}</p>
    </Card>
  );
}

function SocialChip({ href, label }: { href: string; label: string }) {
  return (
    <Button
      asChild
      variant="outline"
      size="xs"
      className="h-6 px-2 text-[11px]"
    >
      <a href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    </Button>
  );
}