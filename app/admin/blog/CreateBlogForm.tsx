"use client";

import "react-quill-new/dist/quill.snow.css";

import { useState } from "react";

import dynamic from "next/dynamic";

import {
  useForm,
} from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Loader2,
  Upload,
  Sparkles,
} from "lucide-react";

import {
  Card,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Textarea,
} from "@/components/ui/textarea";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";
import { createBlog } from "@/lib/api/blog-api";
import { toast } from "sonner";


const ReactQuill = dynamic(
  () => import("react-quill-new"),
  {
    ssr: false,
  }
);

const schema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(20),
  category: z.string().min(2),
  tags: z.string().min(2),
});

type FormValues =
  z.infer<typeof schema>;

export default function CreateBlogForm() {

  const [content, setContent] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("draft");

  const [scheduledFor, setScheduledFor] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver:
      zodResolver(schema),
  });

  const onSubmit = async (
    values: FormValues
  ) => {
    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(
        "title",
        values.title
      );

      formData.append(
        "excerpt",
        values.excerpt
      );

      formData.append(
        "content",
        content
      );

      formData.append(
        "category",
        JSON.stringify([
          values.category,
        ])
      );

      formData.append(
        "tags",
        JSON.stringify(
          values.tags
            .split(",")
            .map((tag) =>
              tag.trim()
            )
        )
      );

      formData.append(
        "status",
        status
      );

      if (
        status === "scheduled" &&
        scheduledFor
      ) {
        formData.append(
          "scheduledFor",
          scheduledFor
        );
      }

      if (
        status === "scheduled" &&
        !scheduledFor
      ) {
        toast.error(
          "Please choose a publish date and time"
        );
        return;
      }

      formData.append(
        "featured",
        "false"
      );

      formData.append(
        "seo",
        JSON.stringify({
          metaTitle:
            values.title,

          metaDescription:
            values.excerpt,

          keywords:
            values.tags
              .split(",")
              .map((t) =>
                t.trim()
              ),
        })
      );

      if (thumbnail) {
        formData.append(
          "thumbnail",
          thumbnail
        );
      }

      await createBlog(formData);

      toast.success(
        "Blog created successfully"
      );

      reset();

      setContent("");

      setThumbnail(null);

    } catch (err: any) {
      console.log(err);

      toast.error(
        err?.response?.data?.message ||
        "Failed to create blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="
  relative
  overflow-hidden
  border-white/10
  bg-linear-to-br
  from-backgound
  to-background
  shadow-[0_0_80px_rgba(6,182,212,0.08)]
  backdrop-blur-2xl
  rounded-3xl
  p-8
"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_35%)]" />

      <div className="flex items-center justify-between mb-8">

        <div className="mb-10">
          <Badge className="mb-4 bg-cyan-500/10 border-cyan-500/20 text-cyan-300">
            <Sparkles className="w-4 h-4 mr-2" />
            Content Intelligence
          </Badge>

          <h1 className="text-4xl font-black tracking-tight">
            Create Premium Blog
          </h1>

          <p className="text-muted-foreground mt-3 text-base">
            Publish articles, schedule content,
            optimize SEO and manage audience engagement.
          </p>
        </div>

        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">

          <Sparkles className="w-4 h-4 mr-1" />

          AI READY

        </Badge>

      </div>

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-6"
      >

        {/* TITLE */}
        <div>

          <Input
            placeholder="Article Title..."
            className="
  h-16
  text-2xl
  font-bold
  bg-transparent
  border-border/50
  rounded-2xl
  "
            {...register("title")}
          />

          {errors.title && (
            <p className="text-red-400 text-sm mt-2">
              {
                errors.title
                  .message
              }
            </p>
          )}

        </div>

        {/* EXCERPT */}
        <div>

          <Textarea
            placeholder="Short blog excerpt..."
            className="
  min-h-32
  rounded-2xl
  bg-white/5
  border-border/50
  resize-none
  "
            {...register(
              "excerpt"
            )}
          />

        </div>

        <div className="flex gap-4">

          {/* CATEGORY */}
          <Input
            className="
  min-h-12
  rounded-2xl
  bg-white/5
  border-border/50
  resize-none
  "
            placeholder="Category"
            {...register(
              "category"
            )}
          />

          {/* TAGS */}
          <Input
            className="
  min-h-12
  rounded-2xl
  bg-white/5
  border-border/50
  resize-none
  "
            placeholder="Tags separated by commas"
            {...register("tags")}
          />
        </div>


        <div className="p-10 border border-border rounded-2xl flex gap-4 max-h-100">
          {/* THUMBNAIL */}
          <div
            className="
  group
  relative
  rounded-3xl
  border
  border-dashed
  border-cyan-500/30
  bg-cyan-500/5
  p-8
  transition
  hover:bg-cyan-500/10
  hover:border-cyan-400
"
          >

            <label className="flex flex-col items-center justify-center gap-3 cursor-pointer">

              <Upload className="w-8 h-8 text-cyan-400" />

              <span className="text-sm text-muted-foreground">
                Upload Blog
                Thumbnail
              </span>

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(
                  e
                ) =>
                  setThumbnail(
                    e.target
                      .files?.[0] ||
                    null
                  )
                }
              />

            </label>

            {
              thumbnail && (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  className="
      mt-4
      h-44
      w-full
      rounded-2xl
      object-cover
      "
                />
              )
            }



          </div>

          {/* EDITOR */}
          <div
            className="
  overflow-hidden
  rounded-3xl
  border
  border-white/10
  bg-white/5
  shadow-lg
"
          >
            <ReactQuill
              theme="snow"
              value={content}
              onChange={
                setContent
              }
              className="bg-background text-black"
            />

          </div>
        </div>

        {/* STATUS */}
        <div className="grid grid-cols-3 gap-3">

          <Button
            type="button"
            variant={
              status ===
                "draft"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setStatus(
                "draft"
              )
            }
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant={
              status ===
                "published"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setStatus(
                "published"
              )
            }
          >
            Publish
          </Button>

          <Button
            type="button"
            variant={
              status === "scheduled"
                ? "default"
                : "outline"
            }
            onClick={() =>
              setStatus("scheduled")
            }
          >
            Schedule Post
          </Button>

        </div>

        {status === "scheduled" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Publish Date & Time
            </label>

            <Input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) =>
                setScheduledFor(e.target.value)
              }
            />
          </div>
        )}

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={loading}
          className={`
h-14
rounded-2xl
font-semibold
transition-all
${status === "published"
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
              : ""
            }
`}
        >

          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Creating...
            </>
          ) : (
            "Create Blog Post"
          )}

        </Button>

      </form>

    </Card>
  );
}