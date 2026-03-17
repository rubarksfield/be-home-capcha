import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

const ADMIN_COOKIE_NAME = "behome-admin-session";

function signValue(value: string) {
  return createHmac("sha256", env.ADMIN_SESSION_SECRET).update(value).digest("hex");
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const value = "authenticated";
  const signature = signValue(value);

  cookieStore.set(ADMIN_COOKIE_NAME, `${value}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!raw) {
    return false;
  }

  const [value, signature] = raw.split(".");

  if (!value || !signature) {
    return false;
  }

  const expected = signValue(value);

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string) {
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(env.ADMIN_PASSWORD));
  } catch {
    return false;
  }
}
