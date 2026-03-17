import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function withLeadingSlash(value: string) {
  return value.startsWith("/") ? value : `/${value}`;
}

export function toSafeRedirectUrl(value?: string | null) {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = new URL(value);
    return parsed.toString();
  } catch {
    return undefined;
  }
}
