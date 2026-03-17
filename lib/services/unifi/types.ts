import type { PortalContext } from "@/lib/portal/query";

export type AuthorizeGuestInput = PortalContext & {
  email: string;
  firstName?: string;
};

export type AuthorizationResult = {
  ok: boolean;
  status: "AUTHORIZED" | "FAILED" | "MOCK_AUTHORIZED";
  message: string;
  response: Record<string, unknown>;
};

export type UnifiAuthorizer = {
  authorizeGuest(input: AuthorizeGuestInput): Promise<AuthorizationResult>;
};
