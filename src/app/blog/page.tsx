import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Newspaper, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared/container";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: `Latest news, training tips, and industry insights from ${COMPANY.name}.`,
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-industrial-black pt-24">
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06]" style={{ backgroundImage: "url(/images/backgrounds/blog-hero.jpg)" }} aria-hidden="true" />
        <Container className="relative z-10 py-16">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <Newspaper className="size-7 text-gold" />
            </div>
            <h1 className="font-display text-4xl tracking-wide text-off-white sm:text-5xl">
              BLOG
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Latest news, training tips, and industry insights from {COMPANY.name}.
            </p>
          </div>

          {(!posts || posts.length === 0) ? (
            <div className="mt-16 text-center">
              <Newspaper className="mx-auto mb-4 size-12 text-white/20" />
              <p className="text-muted-foreground">No posts yet. Check back soon.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl border border-white/5 bg-surface transition-all hover:border-gold/20 hover:shadow-[0_0_30px_rgba(217,164,0,0.05)]"
                >
                  {post.cover_image && (
                    <div className="aspect-[16/9] overflow-hidden rounded-t-xl">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-medium text-gold">
                      {post.category}
                    </span>
                    <h2 className="mt-3 font-heading text-base font-bold text-off-white transition-colors group-hover:text-gold">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User size={12} /> {post.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("en-ZA", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
