import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { BlogPostEditor } from "../editor";

export const metadata: Metadata = {
  title: "New Blog Post",
  robots: { index: false, follow: false },
};

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
          <Newspaper className="size-5 text-gold" />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold text-off-white">New Blog Post</h1>
          <p className="text-sm text-muted-foreground">Create a new blog post for the website</p>
        </div>
      </div>
      <BlogPostEditor />
    </div>
  );
}
