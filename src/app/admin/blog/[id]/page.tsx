import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Newspaper } from "lucide-react";
import { BlogPostEditor } from "../editor";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit Blog Post",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
          <Newspaper className="size-5 text-gold" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-off-white">Edit Post</h1>
          <p className="text-sm text-muted-foreground">{post.title}</p>
        </div>
      </div>
      <BlogPostEditor post={post} />
    </div>
  );
}
