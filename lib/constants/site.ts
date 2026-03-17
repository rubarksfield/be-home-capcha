import { publicEnv } from "@/lib/env";

export const siteConfig = {
  name: "Be Home Cascais Portal",
  shortName: "Be Home",
  description:
    "A warm, welcoming WiFi portal for guests, practitioners, and community members at Be Home Cascais.",
  websiteUrl: publicEnv.NEXT_PUBLIC_BEHOME_WEBSITE_URL,
  classesUrl: publicEnv.NEXT_PUBLIC_CLASSES_URL,
  hireSpaceUrl: publicEnv.NEXT_PUBLIC_HIRE_SPACE_URL,
  siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  redirectDelayMs: publicEnv.NEXT_PUBLIC_PORTAL_REDIRECT_DELAY_MS,
};
