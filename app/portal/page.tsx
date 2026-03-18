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
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <section className="order-1 py-2 lg:order-2 lg:py-6">
            <LeadForm queryParams={queryParams} />
          </section>
          <section className="order-2 py-6 lg:order-1 lg:py-10">
            <PortalCopy />
          </section>
        </div>
        <div className="pt-10">
          <FooterLinks />
        </div>
      </div>
    </main>
  );
}
