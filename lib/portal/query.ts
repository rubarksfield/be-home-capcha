export type RawPortalQueryParams = Record<string, string | string[]>;

export type PortalContext = {
  apMac?: string;
  clientIp?: string;
  clientMac?: string;
  redirect?: string;
  site?: string;
  ssid?: string;
  unifiState?: string;
  rawQueryParams: RawPortalQueryParams;
};

function getFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function extractPortalContext(queryParams: RawPortalQueryParams): PortalContext {
  return {
    apMac: getFirst(queryParams.ap),
    clientIp: getFirst(queryParams.ip),
    clientMac: getFirst(queryParams.mac),
    redirect: getFirst(queryParams.url),
    site: getFirst(queryParams.site),
    ssid: getFirst(queryParams.ssid),
    unifiState: getFirst(queryParams.t),
    rawQueryParams: queryParams,
  };
}

export function serializeSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const serialized: RawPortalQueryParams = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "undefined") {
      continue;
    }

    serialized[key] = value;
  }

  return serialized;
}

export function toSearchParamsString(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "undefined") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
      continue;
    }

    params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
