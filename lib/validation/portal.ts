import { z } from "zod";

export const portalLeadSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(80, "Please keep your first name under 80 characters.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  email: z.string().trim().email("Please enter a valid email address."),
  marketingConsent: z.coerce.boolean().default(false),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Please accept the WiFi terms of use." }),
  }),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Please accept the privacy policy." }),
  }),
  honeypot: z.string().max(0).optional(),
  queryParams: z.record(z.string(), z.union([z.string(), z.array(z.string())])).default({}),
  userAgent: z.string().optional(),
});

export type PortalLeadInput = z.infer<typeof portalLeadSchema>;

export type PortalFieldErrors = Partial<Record<keyof PortalLeadInput, string>>;

export function flattenPortalErrors(error: z.ZodError<PortalLeadInput>) {
  const fieldErrors: PortalFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !fieldErrors[field as keyof PortalLeadInput]) {
      fieldErrors[field as keyof PortalLeadInput] = issue.message;
    }
  }

  return fieldErrors;
}
