import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_BEHOME_WEBSITE_URL: z.string().url(),
  NEXT_PUBLIC_CLASSES_URL: z.string().url(),
  NEXT_PUBLIC_HIRE_SPACE_URL: z.string().url(),
  NEXT_PUBLIC_PORTAL_REDIRECT_DELAY_MS: z.coerce.number().default(5000),
  PORTAL_DEFAULT_REDIRECT_URL: z.string().url(),
  ADMIN_PASSWORD: z.string().min(1),
  ADMIN_SESSION_SECRET: z.string().min(16),
  GOOGLE_SHEETS_CLIENT_EMAIL: z.string().email().optional(),
  GOOGLE_SHEETS_PRIVATE_KEY: z.string().min(1).optional(),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().min(1).optional(),
  GOOGLE_SHEETS_SHEET_NAME: z.string().min(1).default("Leads"),
  UNIFI_AUTH_MODE: z.enum(["mock", "live"]).default("mock"),
  UNIFI_BASE_URL: z.string().url().optional(),
  UNIFI_USERNAME: z.string().optional(),
  UNIFI_PASSWORD: z.string().optional(),
  UNIFI_SITE: z.string().default("default"),
  UNIFI_AUTH_DURATION_MINUTES: z.coerce.number().int().positive().default(480),
  UNIFI_BRIDGE_URL: z.string().url().optional(),
  UNIFI_BRIDGE_TOKEN: z.string().min(16).optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_BEHOME_WEBSITE_URL: z.string().url().default("https://www.behomecascais.com"),
  NEXT_PUBLIC_CLASSES_URL: z.string().url().default("https://www.behomecascais.com"),
  NEXT_PUBLIC_HIRE_SPACE_URL: z.string().url().default("https://www.behomecascais.com"),
  NEXT_PUBLIC_PORTAL_REDIRECT_DELAY_MS: z.coerce.number().default(5000),
});

function formatIssues(error: z.ZodError) {
  return error.issues.map((issue) => issue.path.join(".")).join(", ");
}

export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Invalid server environment variables: ${formatIssues(parsed.error)}`);
  }

  return parsed.data;
}

export function getPublicEnv() {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_BEHOME_WEBSITE_URL:
      process.env.NEXT_PUBLIC_BEHOME_WEBSITE_URL ?? "https://www.behomecascais.com",
    NEXT_PUBLIC_CLASSES_URL: process.env.NEXT_PUBLIC_CLASSES_URL ?? "https://www.behomecascais.com",
    NEXT_PUBLIC_HIRE_SPACE_URL:
      process.env.NEXT_PUBLIC_HIRE_SPACE_URL ?? "https://www.behomecascais.com",
    NEXT_PUBLIC_PORTAL_REDIRECT_DELAY_MS: process.env.NEXT_PUBLIC_PORTAL_REDIRECT_DELAY_MS ?? "5000",
  });
}
