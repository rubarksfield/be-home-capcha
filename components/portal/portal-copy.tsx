import Link from "next/link";

import { BrandMark } from "@/components/portal/brand-mark";
import { TrustPills } from "@/components/portal/trust-pill";

export function PortalCopy() {
  return (
    <div className="flex flex-col gap-8">
      <div className="hidden lg:block">
        <BrandMark />
      </div>
      <div className="max-w-xl space-y-5">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
          Community · Wellness · Cascais
        </p>
        <h1 className="max-w-lg text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          A calm space to pause, connect, and feel at home.
        </h1>
        <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Welcome to Be Home Cascais. Whether you’re here for a class, treatment, event, studio visit,
          or a quiet moment between appointments, we’re glad you’re with us.
        </p>
        <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Share a few details to access guest WiFi in a warm, welcoming environment designed for
          practitioners, guests, and our wider community.
        </p>
      </div>
      <TrustPills />
      <p className="max-w-lg text-sm leading-6 text-muted-foreground">
        By connecting, your details are used to provide WiFi access and, only if you choose, occasional
        updates about classes, events, and offers. Read our{" "}
        <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
          privacy policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
          terms of use
        </Link>
        .
      </p>
    </div>
  );
}
