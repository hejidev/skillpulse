"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { updateBlog } from "@/lib/api/blog-api";
import { toast } from "sonner";

interface Props {
    blog: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditBlogModal({
    blog,
    onClose,
    onSuccess,
}: Props) {
    const [title, setTitle] = useState(blog.title || "");
    const [excerpt, setExcerpt] = useState(blog.excerpt || "");
    const [content, setContent] = useState(blog.content || "");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [status, setStatus] = useState(blog.status || "draft");

    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("title", title);
            formData.append("excerpt", excerpt);
            formData.append("content", content);
            formData.append("status", status);

            formData.append(
                "category",
                JSON.stringify(blog.category || [])
            );

            formData.append(
                "tags",
                JSON.stringify(blog.tags || [])
            );

            formData.append(
                "seo",
                JSON.stringify(blog.seo || {})
            );

            if (thumbnail) {
                formData.append(
                    "thumbnail",
                    thumbnail
                );
            }

            await updateBlog(
                blog._id,
                formData
            );

            toast.success(
                "Blog updated successfully"
            );

            onSuccess();

        } catch (error) {
            console.log(error);

            toast.error(
                "Failed to update blog"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <Card className="w-225 p-6 max-h-[90vh] overflow-y-auto">

                <h2 className="text-2xl font-bold mb-6">
                    Edit Blog
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="block mb-2">
                            Title
                        </label>

                        <input
                            className="w-full border rounded p-3"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-2">
                            Excerpt
                        </label>

                        <textarea
                            className="w-full border rounded p-3"
                            rows={4}
                            value={excerpt}
                            onChange={(e) =>
                                setExcerpt(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-2">
                            Content
                        </label>

                        <textarea
                            className="w-full border rounded p-3"
                            rows={12}
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-2">
                            Current Thumbnail
                        </label>

                        {blog.thumbnail && (
                            <img
                                src={blog.thumbnail}
                                alt={blog.title}
                                className="w-full h-60 object-cover rounded-lg border"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block mb-2">
                            Upload New Thumbnail
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border rounded p-3"
                            onChange={(e) =>
                                setThumbnail(
                                    e.target.files?.[0] || null
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="block mb-2">
                            Status
                        </label>

                        <select
                            className="w-full border rounded p-3"
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="published">
                                Published
                            </option>

                            <option value="scheduled">
                                Scheduled
                            </option>
                        </select>
                    </div>

                </div>

                {/* ACTION BUTTONS */}

                <div className="flex justify-end gap-3 mt-8">

                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Blog"}
                    </Button>

                </div>

            </Card>

        </div>
    );
}