import { AuthorizationStatus, Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { extractPortalContext, type RawPortalQueryParams } from "@/lib/portal/query";
import { getUnifiAuthorizer } from "@/lib/services/unifi";
import type { AuthorizationResult } from "@/lib/services/unifi/types";
import { toSafeRedirectUrl } from "@/lib/utils";
import { flattenPortalErrors, portalLeadSchema } from "@/lib/validation/portal";

const DUPLICATE_WINDOW_MS = 1000 * 60 * 10;

export type SubmissionResult =
  | {
      ok: true;
      leadId: string;
      status: AuthorizationStatus;
      message: string;
      redirectTo: string;
    }
  | {
      ok: false;
      message: string;
      statusCode: number;
      fieldErrors?: ReturnType<typeof flattenPortalErrors>;
      leadId?: string;
    };

function resolveRedirectUrl(redirect?: string | null) {
  return (
    toSafeRedirectUrl(redirect) ??
    toSafeRedirectUrl(process.env.PORTAL_DEFAULT_REDIRECT_URL) ??
    toSafeRedirectUrl(process.env.NEXT_PUBLIC_BEHOME_WEBSITE_URL) ??
    "https://www.behomecascais.com"
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function submitLead(input: {
  firstName?: string;
  email: string;
  marketingConsent: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  honeypot?: string;
  queryParams: RawPortalQueryParams;
  userAgent?: string;
}) {
  const parsed = portalLeadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      statusCode: 400,
      message: "Please review the highlighted fields and try again.",
      fieldErrors: flattenPortalErrors(parsed.error),
    } satisfies SubmissionResult;
  }

  if (parsed.data.honeypot) {
    return {
      ok: false,
      statusCode: 400,
      message: "We could not process this request.",
    } satisfies SubmissionResult;
  }

  const context = extractPortalContext(parsed.data.queryParams);
  const normalizedEmail = normalizeEmail(parsed.data.email);

  const duplicateLead = await db.lead.findFirst({
    where: {
      email: normalizedEmail,
      clientMac: context.clientMac,
      ssid: context.ssid,
      createdAt: {
        gte: new Date(Date.now() - DUPLICATE_WINDOW_MS),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (duplicateLead) {
    if (duplicateLead.authorizationStatus === AuthorizationStatus.FAILED) {
      return {
        ok: false,
        statusCode: 409,
        leadId: duplicateLead.id,
        message:
          "We’ve already received this device recently, but the previous connection attempt did not complete. Please try connecting again.",
      } satisfies SubmissionResult;
    }

    return {
      ok: true,
      leadId: duplicateLead.id,
      status: duplicateLead.authorizationStatus,
      message: "This device has already been submitted recently.",
      redirectTo: resolveRedirectUrl(duplicateLead.redirect),
    } satisfies SubmissionResult;
  }

  const lead = await db.lead.create({
    data: {
      firstName: parsed.data.firstName,
      email: normalizedEmail,
      marketingConsent: parsed.data.marketingConsent,
      termsAccepted: parsed.data.termsAccepted,
      privacyAccepted: parsed.data.privacyAccepted,
      ssid: context.ssid,
      site: context.site,
      apMac: context.apMac,
      clientMac: context.clientMac,
      clientIp: context.clientIp,
      redirect: context.redirect,
      unifiState: context.unifiState,
      rawQueryParams: parsed.data.queryParams as Prisma.InputJsonValue,
      authorizationStatus: AuthorizationStatus.PENDING,
      userAgent: parsed.data.userAgent,
      honeypot: parsed.data.honeypot,
    },
  });

  const authorization = await getUnifiAuthorizer().authorizeGuest({
    ...context,
    email: normalizedEmail,
    firstName: parsed.data.firstName,
  });

  await updateLeadAuthorization(lead.id, authorization);

  if (!authorization.ok) {
    return {
      ok: false,
      statusCode: 502,
      leadId: lead.id,
      message:
        "We’ve received your details, but there was a problem connecting you automatically. Please try again or speak to a member of the team.",
    } satisfies SubmissionResult;
  }

  return {
    ok: true,
    leadId: lead.id,
    status:
      authorization.status === "AUTHORIZED"
        ? AuthorizationStatus.AUTHORIZED
        : AuthorizationStatus.MOCK_AUTHORIZED,
    message: authorization.message,
    redirectTo: resolveRedirectUrl(context.redirect),
  } satisfies SubmissionResult;
}

export async function retryAuthorization(leadId: string) {
  const lead = await db.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return {
      ok: false,
      message: "Lead not found.",
    };
  }

  const context = extractPortalContext((lead.rawQueryParams as RawPortalQueryParams | null) ?? {});
  const authorization = await getUnifiAuthorizer().authorizeGuest({
    ...context,
    email: lead.email,
    firstName: lead.firstName ?? undefined,
  });

  await updateLeadAuthorization(lead.id, authorization);

  return {
    ok: authorization.ok,
    message: authorization.ok
      ? "Connection restored. You can continue to the success page."
      : "We still couldn’t complete the connection automatically.",
    redirectTo: resolveRedirectUrl(lead.redirect),
  };
}

async function updateLeadAuthorization(leadId: string, authorization: AuthorizationResult) {
  const status =
    authorization.status === "AUTHORIZED"
      ? AuthorizationStatus.AUTHORIZED
      : authorization.status === "MOCK_AUTHORIZED"
        ? AuthorizationStatus.MOCK_AUTHORIZED
        : AuthorizationStatus.FAILED;

  await db.lead.update({
    where: { id: leadId },
    data: {
      authorizationStatus: status,
      authorizationResponse: authorization.response as Prisma.InputJsonValue,
    },
  });
}
