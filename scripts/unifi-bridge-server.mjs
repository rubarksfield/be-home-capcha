import http from "node:http";

const PORT = Number(process.env.PORT ?? 8787);
const BRIDGE_TOKEN = process.env.UNIFI_BRIDGE_TOKEN ?? "";
const UNIFI_BASE_URL = process.env.UNIFI_BASE_URL ?? "";
const UNIFI_USERNAME = process.env.UNIFI_USERNAME ?? "";
const UNIFI_PASSWORD = process.env.UNIFI_PASSWORD ?? "";
const UNIFI_SITE = process.env.UNIFI_SITE ?? "default";

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(payload));
}

function unauthorized(response) {
  json(response, 401, {
    ok: false,
    error: "UNAUTHORIZED",
  });
}

async function readJson(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function captureCookies(headers, cookieJar) {
  const setCookie = headers.get("set-cookie");

  if (!setCookie) {
    return;
  }

  const cookies = setCookie.split(/,(?=[^;]+=[^;]+)/g);

  for (const cookie of cookies) {
    cookieJar.push(cookie.split(";")[0]);
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/authorize-guest") {
    json(response, 404, { ok: false, error: "NOT_FOUND" });
    return;
  }

  if (BRIDGE_TOKEN) {
    const authHeader = request.headers.authorization;
    if (authHeader !== `Bearer ${BRIDGE_TOKEN}`) {
      unauthorized(response);
      return;
    }
  }

  if (!UNIFI_BASE_URL || !UNIFI_USERNAME || !UNIFI_PASSWORD) {
    json(response, 500, {
      ok: false,
      error: "UNIFI_BRIDGE_NOT_CONFIGURED",
    });
    return;
  }

  try {
    const body = await readJson(request);
    const clientMac = body.clientMac;
    const site = body.site || UNIFI_SITE;
    const durationMinutes = Number(body.durationMinutes ?? 480);

    if (!clientMac) {
      json(response, 400, {
        ok: false,
        error: "CLIENT_MAC_MISSING",
      });
      return;
    }

    const cookieJar = [];

    const loginResponse = await fetch(`${UNIFI_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: UNIFI_USERNAME,
        password: UNIFI_PASSWORD,
      }),
    });

    captureCookies(loginResponse.headers, cookieJar);

    if (!loginResponse.ok) {
      json(response, 502, {
        ok: false,
        step: "login",
        status: loginResponse.status,
        body: await loginResponse.text(),
      });
      return;
    }

    const loginJson = await loginResponse.json().catch(() => ({}));

    const authorizeResponse = await fetch(
      `${UNIFI_BASE_URL}/proxy/network/api/s/${site}/cmd/stamgr`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieJar.join("; "),
        },
        body: JSON.stringify({
          cmd: "authorize-guest",
          mac: clientMac,
          minutes: durationMinutes,
        }),
      },
    );

    const authorizeJson = await authorizeResponse.json().catch(async () => ({
      raw: await authorizeResponse.text(),
    }));

    if (!authorizeResponse.ok) {
      json(response, 502, {
        ok: false,
        step: "authorize-guest",
        status: authorizeResponse.status,
        login: loginJson,
        authorize: authorizeJson,
      });
      return;
    }

    json(response, 200, {
      ok: true,
      login: loginJson,
      authorize: authorizeJson,
    });
  } catch (error) {
    json(response, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    });
  }
});

server.listen(PORT, () => {
  console.log(`UniFi bridge listening on port ${PORT}`);
});
