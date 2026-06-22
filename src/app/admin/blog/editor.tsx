"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

interface BlogPostData {
  id?: string;
  title?: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  author_name?: string | null;
  published?: boolean;
  tags?: string[] | null;
}

export function BlogPostEditor({ post }: { post?: BlogPostData }) {
  const router = useRouter();
  const isEditing = !!post?.id;

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, form: FormData) => {
      const { createBlogPost, updateBlogPost } = await import("@/lib/actions");
      const result = isEditing
        ? await updateBlogPost(post.id!, form)
        : await createBlogPost(form);
      if (!result.success) return { error: result.error ?? "Failed to save post" };
      router.push("/admin/blog");
      router.refresh();
      return null;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-xs font-medium text-muted-foreground">Title</label>
            <input
              id="title" name="title" type="text" required
              defaultValue={post?.title ?? ""}
              placeholder="Post title"
              className="h-11 w-full rounded-lg border border-white/10 bg-surface px-4 text-sm text-off-white placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="excerpt" className="mb-1.5 block text-xs font-medium text-muted-foreground">Excerpt</label>
            <textarea
              id="excerpt" name="excerpt" rows={3}
              defaultValue={post?.excerpt ?? ""}
              placeholder="Brief summary for the blog listing..."
              className="w-full resize-none rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-off-white placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="content" className="mb-1.5 block text-xs font-medium text-muted-foreground">Content (HTML)</label>
            <textarea
              id="content" name="content" required
              rows={20}
              defaultValue={post?.content ?? ""}
              placeholder="<h2>Heading</h2><p>Write your blog content here...</p>"
              className="w-full resize-y rounded-lg border border-white/10 bg-surface px-4 py-3 font-mono text-sm text-off-white placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="category" className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
            <select
              id="category" name="category"
              defaultValue={post?.category ?? "General"}
              className="h-11 w-full rounded-lg border border-white/10 bg-surface px-4 text-sm text-off-white focus:border-gold/50 focus:outline-none"
            >
              <option>General</option>
              <option>Training</option>
              <option>Safety</option>
              <option>Mining</option>
              <option>Career</option>
              <option>News</option>
            </select>
          </div>
          <div>
            <label htmlFor="author_name" className="mb-1.5 block text-xs font-medium text-muted-foreground">Author</label>
            <input
              id="author_name" name="author_name" type="text"
              defaultValue={post?.author_name ?? "MMS Admin"}
              className="h-11 w-full rounded-lg border border-white/10 bg-surface px-4 text-sm text-off-white focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="tags" className="mb-1.5 block text-xs font-medium text-muted-foreground">Tags (comma-separated)</label>
            <input
              id="tags" name="tags" type="text"
              defaultValue={post?.tags?.join(", ") ?? ""}
              placeholder="forklift, training, safety"
              className="h-11 w-full rounded-lg border border-white/10 bg-surface px-4 text-sm text-off-white placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div className="rounded-lg border border-white/5 bg-industrial-black p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked={post?.published ?? false}
                className="size-4 rounded border-white/20 bg-surface text-gold focus:ring-gold/50"
              />
              <div>
                <p className="text-sm font-medium text-off-white">Published</p>
                <p className="text-xs text-muted-foreground">Visible on the public blog</p>
              </div>
            </label>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold font-bold text-industrial-black transition-all hover:bg-gold-light disabled:opacity-50"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save size={16} />}
            {pending ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
