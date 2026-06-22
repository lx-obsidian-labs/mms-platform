import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

export default async function PortalNotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold text-off-white">Notifications</h1>
        {notifications && notifications.length > 0 && (
          <form action="/api/notifications/mark-all-read" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/30"
            >
              <CheckCheck size={14} />
              Mark All Read
            </button>
          </form>
        )}
      </div>

      {(!notifications || notifications.length === 0) ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Bell className="mx-auto mb-4 size-12 text-muted-foreground" />
            <h2 className="font-heading text-xl font-bold text-off-white">No Notifications</h2>
            <p className="mt-2 text-sm text-muted-foreground">You have no notifications at this time.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-4 rounded-xl border p-4 transition-all",
                n.is_read
                  ? "border-white/5 bg-surface"
                  : "border-gold/10 bg-gold/5"
              )}
            >
              <div className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                n.is_read ? "bg-white/5" : "bg-gold/10"
              )}>
                <Bell className={cn("size-4", n.is_read ? "text-muted-foreground" : "text-gold")} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={cn("text-sm", n.is_read ? "text-off-white" : "font-bold text-off-white")}>
                    {n.title}
                  </h3>
                  {!n.is_read && (
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-gold" />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {new Date(n.created_at).toLocaleDateString(undefined, {
                    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
