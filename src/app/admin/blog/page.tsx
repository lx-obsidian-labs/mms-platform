import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Newspaper, Plus, ExternalLink, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog Posts",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
            <Newspaper className="size-5 text-gold" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-off-white">Blog Posts</h1>
            <p className="text-sm text-muted-foreground">
              {posts?.length ?? 0} post{(posts?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-industrial-black transition-all hover:bg-gold-light"
        >
          <Plus size={14} /> New Post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Author</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {(!posts || posts.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  <Newspaper className="mx-auto mb-2 size-5" />
                  No blog posts yet. Click "New Post" to create one.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <p className="text-off-white">{post.title}</p>
                    {post.excerpt && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{post.excerpt}</p>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{post.category}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{post.author_name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                        post.published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      )}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-ZA")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-gold"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-gold"
                      >
                        <Edit className="size-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
