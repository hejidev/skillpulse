"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  PenSquare,
  TrendingUp,
  Sparkles,
  Globe,
  Bookmark,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { useAuthContext } from "@/components/auth-provider";

import {
  deleteBlog,
  getAdminBlogById,
  getAdminBlogs,
} from "@/lib/api/blog-api";

import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";

import CreateBlogForm from "./CreateBlogForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EditBlogModal from "./EditBlogModal";
import DeleteBlogModal from "./DeleteBlogModal";
import { AdminPageSkeleton } from "../admin-skeleton";

export default function BlogControl() {

  const {
    token,
    loading: authLoading,
  } = useAuthContext();

  const [blogs, setBlogs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  /* ======================================
     FETCH BLOGS
  ====================================== */

  const fetchBlogs =
    async () => {

      try {

        if (!token) {
          console.log(
            "TOKEN NOT FOUND"
          );
          setLoading(false);
          return null
        };

        const data =
          await getAdminBlogs();

        setBlogs(
          data.blogs || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setLoading(false);
      return;
    }

    fetchBlogs();
  }, [token, authLoading]);

  /* ======================================
     WAIT FOR AUTH
  ====================================== */

  if (authLoading) {
    return <AdminPageSkeleton />;
  }

  /* ======================================
     NO TOKEN
  ====================================== */

  if (!token) {
    return (
      <div className="p-10 text-red-400">
        No authentication token found
      </div>
    );
  }

  /* ======================================
     KPI DATA
  ====================================== */
  const published =
    blogs.filter(
      (b) =>
        b.status ===
        "published"
    );

  const drafts =
    blogs.filter(
      (b) =>
        b.status === "draft"
    );

  const totalViews =
    blogs.reduce(
      (
        acc,
        blog
      ) =>
        acc +
        (blog.views || 0),
      0
    );

  const scheduled =
    blogs.filter(
      (b) =>
        b.status ===
        "scheduled"
    );

  const handleView = async (blog: any) => {
    try {
      const data = await getAdminBlogById(blog._id);

      console.log("VIEW DATA:", data);

      setSelectedBlog(data.blog);
      setOpenViewModal(true);

    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (blog: any) => {
    try {
      const data = await getAdminBlogById(blog._id);

      console.log("EDIT DATA:", data);

      setEditingBlog(data.blog);
      setOpenEditModal(true);

    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteClick = (
    id: string
  ) => {
    setDeletingBlogId(id);
    setOpenDeleteModal(true);
  };
  const handleDelete = async () => {
    if (!deletingBlogId) return;

    try {
      setDeleteLoading(true);

      await deleteBlog(
        deletingBlogId
      );

      toast.success(
        "Blog deleted successfully"
      );

      setOpenDeleteModal(false);

      setDeletingBlogId(null);

      fetchBlogs();

    } catch (error) {

      toast.error(
        "Failed to delete blog"
      );

    } finally {

      setDeleteLoading(false);

    }
  };

  return (
    <div className="space-y-8">

      <Card className="relative overflow-hidden p-8 bg-card/40 backdrop-blur-xl border border-border">

        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                <PenSquare className="text-cyan-400" />

              </div>

              <div>

                <h1 className="text-3xl font-black tracking-tight">

                  Blog Intelligence Studio

                </h1>

                <p className="text-muted-foreground mt-1">

                  Publish articles, manage drafts,
                  optimize SEO & control public
                  content delivery

                </p>

              </div>

            </div>

          </div>

          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">

            LIVE CMS

          </Badge>

        </div>

      </Card>

      {/* ================= BLOG FORM ================= */}
      <CreateBlogForm />

      {/* ================= KPI ================= */}
      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

        <BlogKpi
          title="Published Posts"
          value={
            published.length
          }
          icon={<Globe />}
          glow="from-cyan-500/20"
          trend="+12%"
        />

        <BlogKpi
          title="Draft Articles"
          value={
            drafts.length
          }
          icon={<Bookmark />}
          glow="from-orange-500/20"
          trend="+4"
        />

        <BlogKpi
          title="Scheduled Posts"
          value={scheduled.length}
          icon={<Bookmark />}
          glow="from-yellow-500/20"
          trend="+2"
        />

        <BlogKpi
          title="Total Readers"
          value={totalViews}
          icon={<TrendingUp />}
          glow="from-green-500/20"
          trend="+18%"
        />

        <BlogKpi
          title="SEO Performance"
          value="92%"
          icon={<Sparkles />}
          glow="from-purple-500/20"
          trend="+7%"
        />

      </div>

      {/* ================= POSTS ================= */}

      <Card className="p-6 bg-card/40 backdrop-blur-xl border border-border">

      {/* <WorkflowCard
            title="Content Workflow"
            desc="Manage your content pipeline"
            icon={<Sparkles />}
            count={blogs.length}
          /> */}

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">

              Recent Publications

            </h2>

            <p className="text-sm text-muted-foreground mt-1">

              Real-time articles from database

            </p>

          </div>

        </div>

        <div className="mt-6 space-y-4">

          {loading ? (

            <p className="text-muted-foreground">
              Loading blogs...
            </p>

          ) : blogs.length === 0 ? (

            <p className="text-muted-foreground">
              No blogs found
            </p>

          ) : (

            blogs.map((blog) => (

              // <PostRow
              //   key={blog._id}
              //   title={blog.title}
              //   status={blog.status}
              //   views={`${blog.views || 0}`}
              //   time={new Date(
              //     blog.createdAt
              //   ).toLocaleDateString()}
              // />
              <PostRow
                key={blog._id}
                blog={blog}
                title={blog.title}
                status={blog.status}
                views={`${blog.views || 0}`}
                time={new Date(blog.createdAt).toLocaleDateString()}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />

            ))

          )}

          <DeleteBlogModal
            open={openDeleteModal}
            loading={deleteLoading}
            onClose={() => {
              setOpenDeleteModal(false);
              setDeletingBlogId(null);
            }}
            onConfirm={handleDelete}
          />

        </div>

      </Card>

      {
        openViewModal &&
        selectedBlog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-lg w-175">

              <h2 className="text-xl font-bold mb-4">
                {selectedBlog.title}
              </h2>

              <p>
                {selectedBlog.excerpt}
              </p>

              <div
                dangerouslySetInnerHTML={{
                  __html:
                    selectedBlog.content,
                }}
              />

              <Button
                onClick={() =>
                  setOpenViewModal(false)
                }
              >
                Close
              </Button>

            </div>

          </div>
        )
      }

      {
        openEditModal &&
        editingBlog && (
          <EditBlogModal
            blog={editingBlog}
            onClose={() =>
              setOpenEditModal(false)
            }
            onSuccess={() => {
              fetchBlogs();
              setOpenEditModal(false);
            }}
          />
        )
      }
    </div>
  );
}

/* ================= COMPONENTS ================= */

function BlogKpi({
  title,
  value,
  icon,
  trend,
  glow,
}: any) {
  return (
    <Card className="relative overflow-hidden p-5 bg-card/40 backdrop-blur-xl border border-border hover:scale-[1.02] transition">

      <div className={`absolute inset-0 bg-linear-to-br ${glow} opacity-40`} />

      <div className="relative flex items-center justify-between">

        <div className="text-cyan-400">
          {icon}
        </div>

        <span className="text-xs text-green-400">
          {trend}
        </span>

      </div>

      <h2 className="relative text-3xl font-black mt-4">
        {value}
      </h2>

      <p className="relative text-sm text-muted-foreground">
        {title}
      </p>

    </Card>
  );
}

function WorkflowCard({
  title,
  desc,
  icon,
  count,
}: any) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-background/30 hover:bg-accent transition">

      <div className="flex items-center justify-between mb-4">

        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
          {icon}
        </div>

        <ChevronRight size={16} className="text-muted-foreground" />

      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        {desc}
      </p>

      <p className="text-cyan-400 text-sm font-semibold mt-4">
        {count}
      </p>

    </div>
  );
}

function PostRow({
  blog,
  title,
  status,
  views,
  time,
  onView,
  onEdit,
  onDelete,
}: any) {

  const styles =
    status === "published"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : status === "draft"
        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

  return (
    <div className="flex items-center justify-between border border-border rounded-2xl p-4 hover:bg-accent/40 transition">

      <div>
        <h3 className="font-medium">
          {title}
        </h3>

        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">

          <span>{views} views</span>

        </div>

        <div className="flex items-center gap-2">

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onView(blog)
            }
          >
            <Eye size={16} />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              onEdit(blog)
            }
          >
            <Pencil size={16} />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() =>
              onDelete(blog._id)
            }
          >
            <Trash2 size={16} />
          </Button>

          <span>{time}</span>

        </div>

      </div>

      <Badge className={styles}>
        {status}
      </Badge>

    </div>
  );
}

function AnalyticsBar({
  label,
  value,
}: any) {
  return (
    <div className="space-y-2 mb-5">

      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <Progress value={value} />

    </div>
  );
}

function ControlTile({
  title,
  desc,
}: any) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-background/20 hover:bg-accent transition cursor-pointer">

      <h3 className="font-medium text-sm">
        {title}
      </h3>

      <p className="text-xs text-muted-foreground mt-2">
        {desc}
      </p>

    </div>
  );
}

function QuickAction({
  label,
}: any) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-border bg-background/20 hover:bg-accent transition">

      <span className="text-sm font-medium">
        {label}
      </span>

      <ChevronRight size={16} />

    </button>
  );
}