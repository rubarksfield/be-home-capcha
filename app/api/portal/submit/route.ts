import { NextResponse } from "next/server";

import { submitLead } from "@/lib/services/leads";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      email?: string;
      marketingConsent?: boolean;
      termsAccepted?: boolean;
      privacyAccepted?: boolean;
      honeypot?: string;
      queryParams?: Record<string, string | string[]>;
    };

    const result = await submitLead({
      firstName: body.firstName,
      email: body.email ?? "",
      marketingConsent: Boolean(body.marketingConsent),
      termsAccepted: Boolean(body.termsAccepted),
      privacyAccepted: Boolean(body.privacyAccepted),
      honeypot: body.honeypot,
      queryParams: body.queryParams ?? {},
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json(result, {
      status: result.ok ? 200 : result.statusCode,
    });
  } catch (error) {
    console.error("Portal submit failed", error);

    return NextResponse.json(
      {
        ok: false,
        statusCode: 500,
        message:
          "We couldn’t complete the connection just yet. Please try again or speak to a member of the team.",
      },
      { status: 500 },
    );
  }
}
