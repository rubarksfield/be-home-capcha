import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/admin/logout-button";
import { BrandMark } from "@/components/portal/brand-mark";
import { Card, CardContent } from "@/components/ui/card";
import { LeadsTable } from "@/components/admin/leads-table";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Captured Leads",
};

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login?next=/admin/leads");
  }

  const leads = await db.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <main className="min-h-screen bg-portal-glow px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <LogoutButton />
        </div>
        <Card>
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Lead Dashboard</p>
              <h1 className="text-3xl font-semibold">Guest WiFi submissions</h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                Showing the most recent 100 submissions, including captured consent details and UniFi
                authorization outcomes.
              </p>
            </div>
            <LeadsTable leads={leads} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
