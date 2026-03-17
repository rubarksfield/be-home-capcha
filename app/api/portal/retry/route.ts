import { NextResponse } from "next/server";
import { z } from "zod";

import { retryAuthorization } from "@/lib/services/leads";

const retrySchema = z.object({
  leadId: z.string().min(1),
});

export async function POST(request: Request) {
  const body = (await request.json()) as unknown;
  const parsed = retrySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Missing lead identifier.",
      },
      { status: 400 },
    );
  }

  const result = await retryAuthorization(parsed.data.leadId);

  return NextResponse.json(result, {
    status: result.ok ? 200 : 502,
  });
}
