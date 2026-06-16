"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  getSingleBlog,
} from "@/lib/api/blog-api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import PageSkeleton from "@/components/PageSkeleton";

export default function SingleBlogPage() {

  const params = useParams();

  const slug = params.slug as string;

  const [blog, setBlog] =
    useState<any>(null);

  useEffect(() => {

    const fetchBlog = async () => {

      try {

        const data =
          await getSingleBlog(slug);

        setBlog(data.blog);

      } catch (err) {

        console.log(err);
      }
    };

    if (slug) {
      fetchBlog();
    }

  }, [slug]);

  if (!blog) {
          return <PageSkeleton />
  }

  return (

    <div className="max-w-7xl mx-auto px-6 py-28">

      {/* Category */}
      <Badge>
        {blog.category?.[0]}
      </Badge>

      {/* Title */}
      <div className="flex items-center text-center justify-between">

        <h1 className="mt-2 text-xl lg:text-5xl font-black leading-tight">
          {blog.title}
        </h1>

        <Button onClick={() => window.history.back()}><ArrowBigLeft /> Back </Button>
      </div>

      {/* Excerpt */}
      <p className="mt-8 text-md lg:text-xl font-medium text-muted-foreground max-w-7xl leading-relaxed">
        {blog.excerpt}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-muted-foreground">
        <span>By {blog.author?.name}</span>
        <span>{blog.views} views</span>
        <span>
          {new Date(blog.createdAt).toDateString()}
        </span>
      </div>

      {/* Hero Image */}
      <div className="mt-14 overflow-hidden rounded-4xl border border-border">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-162.5 object-cover"
        />
      </div>

      {/* Divider */}
      <div className="my-14 border-t border-border" />

      {/* Content */}
      <article className="prose prose-invert prose-lg lg:prose-xl max-w-4xl mx-auto">
        <div
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />
      </article>

    </div>
  );
}