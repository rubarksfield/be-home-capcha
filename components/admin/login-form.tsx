"use client";

import { useActionState } from "react";

import { loginAdmin } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAdmin, undefined);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Admin Access</p>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Lead dashboard</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Enter the admin password to view guest WiFi submissions.
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <div className="space-y-2">
            <Label htmlFor="password">Admin password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {state?.error ? (
            <div className="rounded-2xl border border-[#ead0cb] bg-[#fff7f6] px-4 py-3 text-sm text-[#7b443f]">
              {state.error}
            </div>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Opening dashboard..." : "Enter dashboard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
