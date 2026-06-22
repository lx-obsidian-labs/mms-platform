import type { Metadata } from "next";
import { AdminSidebar } from "./admin-sidebar";

export const metadata: Metadata = {
  title: {
    template: "%s | MMS Admin",
    default: "Dashboard",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="px-4 py-6 pt-16 lg:px-8 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
