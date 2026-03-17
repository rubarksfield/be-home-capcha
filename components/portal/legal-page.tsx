import type { ReactNode } from "react";

import { BrandMark } from "@/components/portal/brand-mark";
import { FooterLinks } from "@/components/portal/footer-links";
import { Card, CardContent } from "@/components/ui/card";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, description, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-portal-glow">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-8 sm:px-10">
        <BrandMark />
        <Card className="flex-1">
          <CardContent className="space-y-8 p-8 sm:p-10">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{title}</h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
            </div>
            <div className="space-y-6 text-sm leading-7 text-foreground sm:text-base">{children}</div>
          </CardContent>
        </Card>
        <FooterLinks />
      </div>
    </main>
  );
}
