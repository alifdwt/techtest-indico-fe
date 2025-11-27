"use server";

import { cookies } from "next/headers";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function deleteVoucherAction(id: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      success: false,
      message: "You are not authorized.",
    };
  }

  const res = await fetch(`${process.env.API_BASE_URL}/vouchers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    return {
      success: false,
      message: json?.message ?? "Failed to delete voucher. Please try again.",
    };
  }

  return {
    success: true,
    message: "Voucher deleted successfully.",
  };
}
