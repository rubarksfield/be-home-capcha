import { getServerEnv } from "@/lib/env";
import type { AuthorizeGuestInput, AuthorizationResult, UnifiAuthorizer } from "@/lib/services/unifi/types";

type UnifiLoginResponse = {
  meta?: {
    rc?: string;
    msg?: string;
  };
};

export class LiveUnifiAuthorizer implements UnifiAuthorizer {
  private readonly baseUrl: string;
  private readonly username?: string;
  private readonly password?: string;
  private readonly site: string;
  private readonly durationMinutes: number;
  private readonly bridgeUrl?: string;
  private readonly bridgeToken?: string;

  constructor() {
    const env = getServerEnv();

    this.baseUrl = env.UNIFI_BASE_URL ?? "";
    this.username = env.UNIFI_USERNAME;
    this.password = env.UNIFI_PASSWORD;
    this.site = env.UNIFI_SITE;
    this.durationMinutes = env.UNIFI_AUTH_DURATION_MINUTES;
    this.bridgeUrl = env.UNIFI_BRIDGE_URL;
    this.bridgeToken = env.UNIFI_BRIDGE_TOKEN;
  }

  async authorizeGuest(input: AuthorizeGuestInput): Promise<AuthorizationResult> {
    if (this.bridgeUrl) {
      return this.authorizeGuestViaBridge(input);
    }

    if (!this.username || !this.password) {
      return {
        ok: false,
        status: "FAILED",
        message: "UniFi credentials are missing.",
        response: {
          error: "UNIFI_CREDENTIALS_MISSING",
        },
      };
    }

    if (!input.clientMac) {
      return {
        ok: false,
        status: "FAILED",
        message: "Client MAC address is missing from the UniFi redirect.",
        response: {
          error: "CLIENT_MAC_MISSING",
        },
      };
    }

    const cookieJar: string[] = [];

    try {
      const loginResponse = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });

      this.captureCookies(loginResponse.headers, cookieJar);

      if (!loginResponse.ok) {
        const text = await loginResponse.text();

        return {
          ok: false,
          status: "FAILED",
          message: "Unable to log into the UniFi controller.",
          response: {
            step: "login",
            status: loginResponse.status,
            body: text,
          },
        };
      }

      const loginJson = (await loginResponse.json().catch(() => ({}))) as UnifiLoginResponse;

      const authorizeResponse = await fetch(
        `${this.baseUrl}/proxy/network/api/s/${input.site ?? this.site}/cmd/stamgr`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieJar.join("; "),
          },
          body: JSON.stringify({
            cmd: "authorize-guest",
            mac: input.clientMac,
            minutes: this.durationMinutes,
          }),
        },
      );

      const authorizeJson = (await authorizeResponse.json().catch(async () => ({
        raw: await authorizeResponse.text(),
      }))) as Record<string, unknown>;

      if (!authorizeResponse.ok) {
        return {
          ok: false,
          status: "FAILED",
          message: "The UniFi controller did not accept the guest authorization request.",
          response: {
            step: "authorize-guest",
            status: authorizeResponse.status,
            login: loginJson,
            authorize: authorizeJson,
          },
        };
      }

      return {
        ok: true,
        status: "AUTHORIZED",
        message: "Guest authorized successfully.",
        response: {
          login: loginJson,
          authorize: authorizeJson,
        },
      };
    } catch (error) {
      return {
        ok: false,
        status: "FAILED",
        message: "A network error occurred while contacting the UniFi controller.",
        response: {
          error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
          note: "Controller endpoints can vary by UniFi OS version. Adjust the adapter if your controller uses different paths.",
        },
      };
    }
  }

  private async authorizeGuestViaBridge(input: AuthorizeGuestInput): Promise<AuthorizationResult> {
    try {
      const response = await fetch(this.bridgeUrl!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.bridgeToken ? { Authorization: `Bearer ${this.bridgeToken}` } : {}),
        },
        body: JSON.stringify({
          clientMac: input.clientMac,
          site: input.site ?? this.site,
          durationMinutes: this.durationMinutes,
          email: input.email,
          firstName: input.firstName,
        }),
      });

      const data = (await response.json().catch(async () => ({
        raw: await response.text(),
      }))) as Record<string, unknown>;

      if (!response.ok) {
        return {
          ok: false,
          status: "FAILED",
          message: "The UniFi bridge could not authorize the guest.",
          response: {
            step: "bridge-authorize-guest",
            status: response.status,
            bridge: data,
          },
        };
      }

      return {
        ok: true,
        status: "AUTHORIZED",
        message: "Guest authorized successfully via bridge.",
        response: {
          bridge: data,
        },
      };
    } catch (error) {
      return {
        ok: false,
        status: "FAILED",
        message: "A network error occurred while contacting the UniFi bridge.",
        response: {
          error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
        },
      };
    }
  }

  private captureCookies(headers: Headers, cookieJar: string[]) {
    const setCookie = headers.get("set-cookie");

    if (!setCookie) {
      return;
    }

    const cookies = setCookie.split(/,(?=[^;]+=[^;]+)/g);

    for (const cookie of cookies) {
      cookieJar.push(cookie.split(";")[0]);
    }
  }
}
