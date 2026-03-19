"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LeadFormProps = {
  queryParams: Record<string, string | string[]>;
};

type SubmitState = {
  message?: string;
  fieldErrors?: Record<string, string | undefined>;
  leadId?: string;
  canRetry?: boolean;
};

export function LeadForm({ queryParams }: LeadFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<SubmitState>({});
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    marketingConsent: false,
    termsAccepted: false,
    privacyAccepted: false,
    honeypot: "",
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState({});

    startTransition(async () => {
      try {
        const response = await fetch("/api/portal/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            queryParams,
          }),
        });

        const raw = await response.text();
        const data = JSON.parse(raw) as {
          ok: boolean;
          message: string;
          leadId?: string;
          fieldErrors?: Record<string, string | undefined>;
          redirectTo?: string;
        };

        if (!data.ok) {
          setSubmitState({
            message: data.message,
            fieldErrors: data.fieldErrors,
            leadId: data.leadId,
            canRetry: Boolean(data.leadId),
          });
          return;
        }

        const nextUrl = new URL("/success", window.location.origin);
        nextUrl.searchParams.set("leadId", data.leadId ?? "");
        nextUrl.searchParams.set("redirectTo", data.redirectTo ?? "");
        window.location.assign(nextUrl.toString());
      } catch {
        setSubmitState({
          message:
            "We couldn’t complete the connection just yet. Please try again or speak to a member of the team.",
        });
      }
    });
  };

  const retryAuthorization = async () => {
    const leadId = submitState.leadId;

    if (!leadId) {
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/portal/retry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadId,
          }),
        });

        const raw = await response.text();
        const data = JSON.parse(raw) as {
          ok: boolean;
          message: string;
          redirectTo?: string;
        };

        if (!data.ok) {
          setSubmitState((current) => ({
            ...current,
            message: data.message,
          }));
          return;
        }

        const nextUrl = new URL("/success", window.location.origin);
        nextUrl.searchParams.set("leadId", leadId);
        nextUrl.searchParams.set("redirectTo", data.redirectTo ?? "");
        window.location.assign(nextUrl.toString());
      } catch {
        setSubmitState((current) => ({
          ...current,
          message:
            "We still couldn’t complete the connection automatically. Please try again or speak to a member of the team.",
        }));
      }
    });
  };

  return (
    <Card className="overflow-hidden border-[#ebe3d6] bg-[#fbf7f1]/95">
      <CardHeader className="space-y-3 px-6 pt-7 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Guest WiFi</p>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Connect in a moment</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Add your details below to join our guest network and settle in.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-7 pt-6 sm:px-8">
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            name="website"
            value={form.honeypot}
            onChange={(event) => setForm((current) => ({ ...current, honeypot: event.target.value }))}
          />
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Optional"
              value={form.firstName}
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            />
            {submitState.fieldErrors?.firstName ? (
              <p className="text-sm text-destructive">{submitState.fieldErrors.firstName}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
            {submitState.fieldErrors?.email ? (
              <p className="text-sm text-destructive">{submitState.fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="space-y-4 rounded-[1.75rem] bg-[#f2ecdf] p-5">
            <label className="flex items-start gap-3">
              <Checkbox
                checked={form.termsAccepted}
                onCheckedChange={(checked) =>
                  setForm((current) => ({ ...current, termsAccepted: checked === true }))
                }
              />
              <span className="text-sm leading-6 text-foreground">
                I agree to the WiFi{" "}
                <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                  terms of use
                </Link>
                .
              </span>
            </label>
            {submitState.fieldErrors?.termsAccepted ? (
              <p className="text-sm text-destructive">{submitState.fieldErrors.termsAccepted}</p>
            ) : null}

            <label className="flex items-start gap-3">
              <Checkbox
                checked={form.privacyAccepted}
                onCheckedChange={(checked) =>
                  setForm((current) => ({ ...current, privacyAccepted: checked === true }))
                }
              />
              <span className="text-sm leading-6 text-foreground">
                I agree to the{" "}
                <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                  privacy policy
                </Link>
                .
              </span>
            </label>
            {submitState.fieldErrors?.privacyAccepted ? (
              <p className="text-sm text-destructive">{submitState.fieldErrors.privacyAccepted}</p>
            ) : null}

            <label className="flex items-start gap-3">
              <Checkbox
                checked={form.marketingConsent}
                onCheckedChange={(checked) =>
                  setForm((current) => ({ ...current, marketingConsent: checked === true }))
                }
              />
              <span className="text-sm leading-6 text-foreground">
                I’d like to receive occasional updates about classes, events, and offers.
              </span>
            </label>
          </div>

          {submitState.message ? (
            <div className="rounded-[1.75rem] border border-[#ead0cb] bg-[#fff7f6] px-4 py-3 text-sm text-[#7b443f]">
              <p>{submitState.message}</p>
              {submitState.canRetry ? (
                <Button
                  type="button"
                  variant="link"
                  className="mt-2 h-auto text-[#7b443f]"
                  onClick={retryAuthorization}
                >
                  Try connecting again
                </Button>
              ) : null}
            </div>
          ) : null}

          <Button type="submit" variant="portal" className="w-full text-base font-medium" size="lg" disabled={isPending}>
            {isPending ? "Connecting..." : "Connect to WiFi"}
          </Button>

          <p className="text-center text-xs leading-6 text-muted-foreground">
            Your information helps us provide guest WiFi access and support a smooth visit to Be Home.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
