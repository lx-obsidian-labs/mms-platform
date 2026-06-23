import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, Users, Star, TrendingUp, Bell, ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refer & Earn",
  description: `Refer a friend to ${COMPANY.name} and earn rewards.`,
  robots: { index: false, follow: false },
};

export default async function ReferPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const referralLink = `${
    process.env.NEXT_PUBLIC_SITE_URL || "https://mpumalangaminingsolutions.com"
  }/apply?ref=${profile?.first_name?.toLowerCase() ?? "student"}-${Date.now()}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gold/10 bg-gradient-to-br from-gold/10 via-surface to-surface p-6 lg:p-8">
        <div className="absolute right-0 top-0 opacity-5">
          <Award className="size-40 text-gold" />
        </div>
        <div className="relative z-10">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gold/20">
            <Users className="size-6 text-gold" />
          </div>
          <h1 className="mt-4 font-display text-3xl text-off-white sm:text-4xl">Refer & Earn</h1>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Partner with us by referring students to our training programs. Earn rewards for every successful enrollment.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { icon: Bell, title: "Share Your Link", desc: "Share your unique referral link with friends, family, or colleagues in the mining industry." },
          { icon: Users, title: "They Enroll", desc: "When someone signs up for a course using your link and completes enrollment, you earn." },
          { icon: Award, title: "Get Rewarded", desc: "Receive your reward once the referred student's enrollment is confirmed and payment is made." },
        ].map((step, i) => (
          <div key={i} className="rounded-xl border border-white/5 bg-surface p-5 transition-all hover:border-gold/20">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gold/10">
              <step.icon className="size-5 text-gold" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold">{i + 1}</span>
              <h3 className="font-heading text-sm font-bold text-off-white">{step.title}</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Rewards */}
      <div className="rounded-xl border border-white/5 bg-surface p-6">
        <h2 className="font-heading text-base font-bold text-off-white">Rewards</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { icon: Star, title: "Cash Reward", desc: "Earn a cash bonus for every referred student who completes enrollment." },
            { icon: TrendingUp, title: "Course Discounts", desc: "Accumulate points toward discounts on future course enrollments." },
          ].map((reward, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-white/5 bg-industrial-black p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                <reward.icon className="size-4 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-off-white">{reward.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{reward.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Link */}
      <div className="rounded-xl border border-white/5 bg-surface p-6">
        <h2 className="font-heading text-base font-bold text-off-white">Your Referral Link</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Share this link with potential students. You earn rewards for every successful enrollment.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 truncate rounded-lg border border-white/10 bg-industrial-black px-4 py-3 font-mono text-xs text-gold">
            {referralLink}
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(referralLink); }}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gold px-4 py-3 text-sm font-bold text-black transition-all hover:bg-gold-light"
          >
            <Star size={14} />
            Copy
          </button>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-white/5 bg-surface p-6 text-center">
        <h2 className="font-heading text-base font-bold text-off-white">Want to become a partner?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact our partnerships team to discuss bulk enrollments, corporate training, and custom partnership opportunities.
        </p>
        <a
          href={`mailto:${COMPANY.email}?subject=Partnership%20Inquiry`}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gold/30 px-5 py-2.5 text-sm font-medium text-gold transition-all hover:bg-gold/10"
        >
          Get in Touch <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
