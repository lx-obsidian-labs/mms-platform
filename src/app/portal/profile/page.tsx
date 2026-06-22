import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, Phone, MapPin, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false, follow: false },
};

export default async function PortalProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-xl font-bold text-off-white">My Profile</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Account Information */}
        <div className="rounded-xl border border-white/5 bg-surface p-6">
          <h2 className="font-heading text-base font-bold text-off-white">Account Information</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <User className="size-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-off-white">
                  {profile?.first_name} {profile?.last_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-off-white">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-off-white">{profile?.phone ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="size-5 shrink-0 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium capitalize text-off-white">{profile?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="rounded-xl border border-white/5 bg-surface p-6">
          <h2 className="font-heading text-base font-bold text-off-white">Student Information</h2>
          {student ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="size-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Student Number</p>
                  <p className="text-sm font-bold text-gold">{student.student_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="size-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">ID Number</p>
                  <p className="text-sm font-medium text-off-white">{student.id_number ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-off-white">
                    {[student.city, student.province].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>
              </div>
              {student.emergency_contact_name && (
                <div className="rounded-lg border border-white/5 bg-industrial-black p-3">
                  <p className="text-xs text-muted-foreground">Emergency Contact</p>
                  <p className="text-sm font-medium text-off-white">{student.emergency_contact_name}</p>
                  <p className="text-xs text-muted-foreground">{student.emergency_contact_phone}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Student record not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
