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

const NAV_ITEMS = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/portal/courses", icon: BookOpen },
  { label: "Certificates", href: "/portal/certificates", icon: Award },
  { label: "Documents", href: "/portal/documents", icon: FileText },
  { label: "Notifications", href: "/portal/notifications", icon: Bell },
  { label: "Support", href: "/portal/support", icon: LifeBuoy },
  { label: "Profile", href: "/portal/profile", icon: User },
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
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex size-10 items-center justify-center rounded-lg border border-white/10 bg-surface lg:hidden"
      >
        <Menu className="size-5 text-off-white" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/5 bg-[#0d0d0d] transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-white/5 px-4", collapsed ? "justify-center" : "justify-between")}>
          <Link href="/portal/dashboard" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gold">
              <GraduationCap className="size-4 text-black" />
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
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gold/10 text-gold"
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

        <div className="border-t border-white/5 p-3">
          {!collapsed && userName && (
            <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{userName}</p>
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
              <span>← Back to Website</span>
            </Link>
          )}
        </div>
      </aside>

      <main className="lg:pl-64">
        <div className="px-4 py-6 pt-16 lg:px-8 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
