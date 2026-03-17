"use client";

import { useTransition } from "react";

import { logoutAdmin } from "@/app/admin/leads/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      onClick={() => startTransition(async () => logoutAdmin())}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
