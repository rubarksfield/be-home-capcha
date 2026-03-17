"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { createAdminSession, verifyAdminPassword } from "@/lib/auth/admin";

export async function loginAdmin(_: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/leads");
  const safeNext = next.startsWith("/admin") ? next : "/admin/leads";

  if (!verifyAdminPassword(password)) {
    return {
      error: "That password didn’t match the admin access key.",
    };
  }

  await createAdminSession();
  redirect(safeNext as Route);
}
