import LoginForm from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SearchParams {
  searchParams: Promise<{
    from?: string;
  }>;
}

export default async function LoginPage({ searchParams }: SearchParams) {
  const { from } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access the voucher dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm from={from} />
        </CardContent>
      </Card>
    </div>
  );
}
