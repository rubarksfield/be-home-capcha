import type { Metadata } from "next";

import { BrandMark } from "@/components/portal/brand-mark";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
};

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : "/admin/leads";

  return (
    <main className="flex min-h-screen items-center justify-center bg-portal-glow px-6 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <BrandMark />
        <LoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
