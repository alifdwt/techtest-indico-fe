"use server";

import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validators/auth";

type LoginActionState = {
  success: boolean;
  message?: string;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError =
      Object.values(parsed.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean)[0] ?? "Invalid data";

    return {
      success: false,
      message: firstError,
    };
  }

  const { email, password } = parsed.data;

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        json?.message ||
        (res.status === 400
          ? "Incorrect email or password"
          : "Something went wrong. Please try again.");

      return {
        success: false,
        message,
      };
    }

    const token: string | undefined = json?.data?.token;

    if (!token) {
      return {
        success: false,
        message: "Token is missing in server response.",
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
    });

    return {
      success: true,
      message: "Logged in successfully.",
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      message: "Unable to reach the server. Please try again later.",
    };
  }
}
