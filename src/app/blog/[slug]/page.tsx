import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/shared/container";
import { COMPANY } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt ?? `Read more on ${COMPANY.name} blog.`,
    openGraph: { title: post.title, description: post.excerpt ?? undefined },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="relative min-h-screen bg-industrial-black pt-24">
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06]" style={{ backgroundImage: "url(/images/backgrounds/blog-hero.jpg)" }} aria-hidden="true" />
        <Container size="narrow" className="relative z-10 py-16">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-gold"
          >
            <ArrowLeft size={12} /> Back to Blog
          </Link>

          <article>
            <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-medium text-gold">
              {post.category}
            </span>
            <h1 className="mt-3 font-display text-3xl tracking-wide text-off-white sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User size={14} /> {post.author_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-ZA", {
                      day: "numeric", month: "long", year: "numeric",
                    })
                  : "—"}
              </span>
              {post.tags && post.tags.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag size={14} />
                  {post.tags.join(", ")}
                </span>
              )}
            </div>

            {post.cover_image && (
              <div className="mt-8 overflow-hidden rounded-xl">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            <div
              className="prose-custom mt-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
