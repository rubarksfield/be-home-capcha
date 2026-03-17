import type { Metadata } from "next";

import { BrandMark } from "@/components/portal/brand-mark";
import { FooterLinks } from "@/components/portal/footer-links";
import { SuccessContent } from "@/components/portal/success-content";
import { toSafeRedirectUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Connected",
  description: "Your Be Home Cascais guest WiFi connection is ready.",
};

export const dynamic = "force-dynamic";

type SuccessPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const redirectTo =
    typeof params.redirectTo === "string" ? toSafeRedirectUrl(params.redirectTo) : undefined;

  return (
    <main className="min-h-screen bg-portal-glow">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-between gap-10 px-6 py-8 sm:px-10">
        <BrandMark />
        <div className="flex flex-1 items-center">
          <SuccessContent redirectTo={redirectTo} />
        </div>
        <FooterLinks />
      </div>
    </main>
  );
}
