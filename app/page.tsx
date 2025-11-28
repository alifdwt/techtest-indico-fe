import Link from "next/link";
import { cookies } from "next/headers";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const isAuthenticated = Boolean(token);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted to-background px-4">
      <div className="max-w-2xl space-y-8 text-center">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Indico Technical Test
          </span>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Voucher Management Dashboard
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Listing, creating, importing from CSV, and exporting to CSV.
          </p>
        </div>

        <Card className="border-muted/60 bg-background/80 shadow-sm backdrop-blur">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-left">
              <p className="text-sm font-medium">
                Get started with the dashboard
              </p>
              <p className="text-xs text-muted-foreground">
                Sign in to access the voucher list, create new vouchers, and
                manage CSV imports.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Sign in</Link>
              </Button>
              {isAuthenticated && (
                <Button asChild size="sm">
                  <Link href="/vouchers">Go to dashboard</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
          <FeaturePill label="Next.js 16 App Router" />
          <FeaturePill label="TypeScript" />
          <FeaturePill label="Tailwind CSS & shadcn/ui" />
          <FeaturePill label="Zod validation" />
          <FeaturePill label="Dockerized deploy" />
          <FeaturePill label="CSV import & export" />
        </div>
      </div>
    </main>
  );
}

function FeaturePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1">
      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
      {label}
    </span>
  );
}
