import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SuccessContentProps = {
  redirectTo?: string;
};

export function SuccessContent({ redirectTo }: SuccessContentProps) {
  return (
    <Card className="max-w-2xl border-[#ebe3d6] bg-[#fbf7f1]/95">
      <CardContent className="space-y-8 p-8 sm:p-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">You’re connected</p>
          <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">
            Welcome to
            <br />
            Be Home.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Your guest access is now active. Settle in, take a breath, and enjoy the space.
          </p>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Your connection is ready.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {redirectTo ? (
            <Button asChild variant="portal" className="w-full text-base font-medium sm:w-auto" size="lg">
              <a href={redirectTo}>
                Continue online
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
