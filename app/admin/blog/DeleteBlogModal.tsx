"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteBlogModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteBlogModal({
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteBlogModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">

      <div className="w-full max-w-md rounded-2xl bg-background border border-border p-6">

        <h2 className="text-xl font-bold mb-3">
          Delete Blog Post
        </h2>

        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete this blog?
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">

          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>

        </div>

      </div>

    </div>
  );
}