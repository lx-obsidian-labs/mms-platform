import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { getApplications } from "@/lib/actions";
import { ApplicationsTable } from "./applications-table";

export const metadata: Metadata = { title: "Applications" };

export default async function AdminApplicationsPage() {
  const { data } = await getApplications();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-400/10">
          <FileText className="size-5 text-blue-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-wide text-off-white lg:text-3xl">Applications</h1>
          <p className="text-sm text-muted-foreground">Review and manage enrollment applications</p>
        </div>
      </div>

      <ApplicationsTable applications={data as never[]} />
    </div>
  );
}
