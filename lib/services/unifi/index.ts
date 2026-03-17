import { env } from "@/lib/env";
import { LiveUnifiAuthorizer } from "@/lib/services/unifi/live";
import { MockUnifiAuthorizer } from "@/lib/services/unifi/mock";
import type { UnifiAuthorizer } from "@/lib/services/unifi/types";

let authorizer: UnifiAuthorizer | null = null;

export function getUnifiAuthorizer() {
  if (authorizer) {
    return authorizer;
  }

  authorizer = env.UNIFI_AUTH_MODE === "live" ? new LiveUnifiAuthorizer() : new MockUnifiAuthorizer();

  return authorizer;
}
