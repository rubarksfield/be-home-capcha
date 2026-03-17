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
  UNIFI_AUTH_MODE: z.enum(["mock", "live"]).default("mock"),
  UNIFI_BASE_URL: z.string().url().optional(),
  UNIFI_USERNAME: z.string().optional(),
  UNIFI_PASSWORD: z.string().optional(),
  UNIFI_SITE: z.string().default("default"),
  UNIFI_AUTH_DURATION_MINUTES: z.coerce.number().int().positive().default(480),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_BEHOME_WEBSITE_URL: z.string().url(),
  NEXT_PUBLIC_CLASSES_URL: z.string().url(),
  NEXT_PUBLIC_HIRE_SPACE_URL: z.string().url(),
  NEXT_PUBLIC_PORTAL_REDIRECT_DELAY_MS: z.coerce.number().default(5000),
});

function formatIssues(error: z.ZodError) {
  return error.issues.map((issue) => issue.path.join(".")).join(", ");
}

export const env = (() => {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Invalid server environment variables: ${formatIssues(parsed.error)}`);
  }

  return parsed.data;
})();

export const publicEnv = (() => {
  const parsed = clientEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Invalid public environment variables: ${formatIssues(parsed.error)}`);
  }

  return parsed.data;
})();
