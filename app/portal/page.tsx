import type { Metadata } from "next";

import { FooterLinks } from "@/components/portal/footer-links";
import { LeadForm } from "@/components/portal/lead-form";
import { PortalCopy } from "@/components/portal/portal-copy";
import { serializeSearchParams } from "@/lib/portal/query";

export const metadata: Metadata = {
  title: "Guest WiFi",
  description: "Join the Be Home Cascais guest WiFi network.",
};

export const dynamic = "force-dynamic";

type PortalPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const resolvedSearchParams = await searchParams;
  const queryParams = serializeSearchParams(resolvedSearchParams);

  return (
    <main className="min-h-screen bg-portal-glow">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-12">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="py-10">
            <PortalCopy />
          </section>
          <section className="py-6">
            <LeadForm queryParams={queryParams} />
          </section>
        </div>
        <div className="pt-10">
          <FooterLinks />
        </div>
      </div>
    </main>
  );
}
