import type { AuthorizeGuestInput, AuthorizationResult, UnifiAuthorizer } from "@/lib/services/unifi/types";

export class MockUnifiAuthorizer implements UnifiAuthorizer {
  async authorizeGuest(input: AuthorizeGuestInput): Promise<AuthorizationResult> {
    return {
      ok: true,
      status: "MOCK_AUTHORIZED",
      message: "Guest authorized in mock mode.",
      response: {
        mode: "mock",
        authorizedAt: new Date().toISOString(),
        clientMac: input.clientMac ?? null,
        email: input.email,
      },
    };
  }
}
