"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Award,
  Bell,
  LifeBuoy,
  User,
  LogOut,
  ChevronLeft,
  Menu,
  GraduationCap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { AiChatbot } from "@/components/ai-chatbot";
import { OnboardingTour } from "@/components/onboarding-tour";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard, tour: "dashboard" },
  { label: "E-Learning", href: "/portal/elearning", icon: GraduationCap, tour: null },
  { label: "My Courses", href: "/portal/courses", icon: BookOpen, tour: "courses" },
  { label: "Certificates", href: "/portal/certificates", icon: Award, tour: "certificates" },
  { label: "Documents", href: "/portal/documents", icon: FileText, tour: null },
  { label: "Notifications", href: "/portal/notifications", icon: Bell, tour: null },
  { label: "Refer & Earn", href: "/portal/refer", icon: Award, tour: "refer" },
  { label: "Support", href: "/portal/support", icon: LifeBuoy, tour: "support" },
  { label: "Profile", href: "/portal/profile", icon: User, tour: null },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.user_metadata) {
        const meta = data.user.user_metadata;
        setUserName(`${meta.first_name ?? ""} ${meta.last_name ?? ""}`.trim());
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <OnboardingTour />
      <AiChatbot />

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-40 -top-40 size-96 rounded-full bg-gold/3 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-gold/2 blur-3xl" />
      </div>

      {/* Mobile menu trigger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={cn(
          "fixed z-50 flex size-10 items-center justify-center rounded-lg border border-white/10 bg-surface shadow-lg",
          collapsed ? "left-[18px]" : "left-[18px]",
          "top-4 lg:hidden"
        )}
        aria-label="Toggle menu"
      >
        <Menu className="size-5 text-off-white" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        data-tour="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/5 bg-[#0d0d0d] transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-white/5",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}>
          <Link href="/portal/dashboard" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold/80 shadow-[0_0_12px_rgba(217,164,0,0.2)]">
              <GraduationCap className="size-[18px] text-black" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold text-off-white">Student Portal</p>
                <p className="text-[10px] text-muted-foreground">Learning Hub</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-off-white lg:block"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    data-tour={item.tour}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gold/10 text-gold shadow-[inset_2px_0_0_rgba(217,164,0,0.5)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-off-white",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/5 p-3">
          {!collapsed && userName && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-[11px] font-bold text-gold uppercase">
                {userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-off-white">{userName}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-red-400",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="size-[18px] shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          {!collapsed && (
            <Link
              href="/"
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/30 transition-colors hover:text-white/60"
            >
              <span>&larr; Back to Website</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen lg:pl-64">
        <main className="px-4 py-6 pt-16 lg:px-8 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
