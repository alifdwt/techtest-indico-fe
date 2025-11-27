"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function VouchersError({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Voucher page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-destructive/30">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We couldn&apos;t load the vouchers page properly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-center text-sm text-muted-foreground">
          <p>Please try again or go back to the voucher list.</p>

          {process.env.NODE_ENV !== "production" && (
            <div className="rounded-md bg-muted p-2 text-xs text-left text-destructive">
              <p className="font-semibold">Debug info:</p>
              <pre className="whitespace-pre-wrap break-words">
                {error.message}
              </pre>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() => {
              router.push("/vouchers");
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go to vouchers
          </Button>

          <Button onClick={() => reset()} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
