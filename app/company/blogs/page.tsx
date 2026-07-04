"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  Clock3,
  TrendingUp,
  Sparkles,
  Activity,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  getPublishedBlogs,
} from "@/lib/api/blog-api";
import PageSkeleton from "@/components/PageSkeleton";
import Footer from "@/components/footer";

export default function BlogPage() {

  const [blogs, setBlogs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchBlogs = async () => {

      try {

        const data =
          await getPublishedBlogs();

        setBlogs(data.blogs);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

    fetchBlogs();

  }, []);

  if (loading) {
    return <PageSkeleton />
  }

  const featured = blogs[0];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">

      {/* BACKGROUND EFFECTS */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-125 w-125 rounded-full bg-background/10 blur-3xl" />
        <div className="absolute top-96 right-0 h-125 w-125 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-125 w-125 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-28">

        {/* ================= HERO SECTION ================= */}

        <div className="text-center max-w-4xl mx-auto mb-24">

          {/* <Badge className="mb-6 px-5 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
            <Sparkles size={14} className="mr-2" />
            SkillPulse Insights
          </Badge> */}

          <h1 className="text-4xl md:text-8xl text-foreground font-black tracking-tight leading-none">

            Learn.  Build.
            <br />

            <span className="bg-linear-to-r from-cyan-400 via-brand/40 to-brand/90 text-transparent bg-clip-text">
              Grow Faster.
            </span>

          </h1>

          <p className="mt-5 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Engineering, design, product growth,
            AI, startup stories and deep technical
            insights from builders shaping the future.
          </p>

        </div>

        {/* ================= FEATURED ARTICLE ================= */}

        {featured && (

          <div className="mb-1">

            <Card className="overflow-hidden border-border/30 bg-card/40 backdrop-blur-2xl">

              {/* <div className="grid lg:grid-cols-2"> */}

              {/* IMAGE */}

              <div className="relative h-125">

                <img
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-foreground/20 to-transparent" />

                <Badge className="absolute top-6 left-6 bg-cyan-500 text-foreground border-0">
                  Featured Story
                </Badge>

              </div>

              {/* CONTENT */}

              <div className="p-1 lg:px-4 lg:py-10 flex flex-col justify-center">

                <div className="flex flex-wrap gap-3 mb-2">

                  <Badge
                    variant="outline"
                    className="border-cyan-500/30 text-cyan-400"
                  >
                    Trending
                  </Badge>

                  <Badge
                    variant="outline"
                    className="border-border"
                  >
                    {featured.category?.[0]}
                  </Badge>

                </div>

                <h2 className="text-4xl lg:text-5xl font-black leading-tight">

                  {featured.title}

                </h2>

                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">

                  {featured.excerpt}

                </p>

                <div className="flex flex-wrap gap-6 mt-8 text-sm text-muted-foreground">

                  <div className="flex items-center gap-2">
                    <Clock3 size={15} />
                    {new Date(
                      featured.createdAt
                    ).toDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp size={15} />
                    {featured.views} Views
                  </div>

                </div>

                <Link
                  href={`/company/blogs/${featured.slug}`}
                  className="mt-10"
                >

                  <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium transition-all">

                    Read Full Story

                    <ArrowRight
                      size={18}
                      className="transition group-hover:translate-x-1"
                    />

                  </button>

                </Link>

              </div>

              {/* </div> */}

            </Card>

          </div>

        )}

        <div className="flex items-center gap-4 mt-20 mb-5">

          <div className="h-px flex-1 bg-border" />

          <span className="text-sm uppercase tracking-[0.3em] text-foreground">
            Latest Stories
          </span>

          <div className="h-px flex-1 bg-border" />

        </div>

        {/* ================= BLOG GRID ================= */}

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-4xl font-foreground text-foreground">
              Latest Articles
            </h2>

            <p className="text-muted-foreground mt-2">
              Discover new insights and ideas.
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {blogs.map((blog) => (

            <Link
              key={blog._id}
              href={`/company/blogs/${blog.slug}`}
              className="group"
            >

              <Card className="overflow-hidden h-full border border-border/30 bg-card/40 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2">

                <div className="relative overflow-hidden">

                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-64 object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                  <Badge className="absolute top-4 left-4 bg-black/50 backdrop-blur-md border-white/10">

                    {blog.category?.[0] || "Article"}

                  </Badge>

                </div>

                <div className="p-6">

                  <div className="flex justify-between items-center text-xs text-muted-foreground">

                    <span>
                      {new Date(
                        blog.createdAt
                      ).toLocaleDateString()}
                    </span>

                    <span>
                      {blog.views} views
                    </span>

                  </div>

                  <h3 className="mt-4 text-2xl font-bold leading-tight line-clamp-2 group-hover:text-cyan-400 transition">

                    {blog.title}

                  </h3>

                  <p className="mt-4 text-muted-foreground line-clamp-3 leading-relaxed">

                    {blog.excerpt}

                  </p>

                  <div className="mt-6 flex items-center gap-2 text-cyan-400 font-medium">

                    Read More

                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />

                  </div>

                </div>

              </Card>

            </Link>

          ))}

        </div>

      </div>
      <Footer />
    </div>
  );
}
