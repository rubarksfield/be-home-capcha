import Link from "next/link";

import { siteConfig } from "@/lib/constants/site";

export function FooterLinks() {
  return (
    <footer className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
      <Link href="/privacy" className="hover:text-foreground">
        Privacy Policy
      </Link>
      <Link href="/terms" className="hover:text-foreground">
        Terms
      </Link>
      <a href={siteConfig.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-foreground">
        behomecascais.com
      </a>
    </footer>
  );
}
