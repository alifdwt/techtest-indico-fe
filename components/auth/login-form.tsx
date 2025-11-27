"use client";

import { loginAction } from "@/actions/login";
import { LoginInput, loginSchema } from "@/lib/validators/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const initialState = {
  success: false,
  message: undefined as string | undefined,
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(loginAction, initialState);

  const hasHandledStateRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!state.message || hasHandledStateRef.current) return;

    hasHandledStateRef.current = true;

    if (state.success) {
      toast.success(state.message);
      const redirectTo = searchParams.get("from") || "/vouchers";
      router.push(redirectTo);
    } else {
      toast.error(state.message);
      setError("root", {
        type: "server",
        message: state.message,
      });
    }

    const t = setTimeout(() => {
      hasHandledStateRef.current = false;
    }, 0);

    return () => clearTimeout(t);
  }, [state, router, searchParams, setError]);

  const onSubmit = (data: LoginInput) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formAction(formData);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="fulan@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="******"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="text-sm text-destructive">{errors.root.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;
