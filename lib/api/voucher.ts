import "server-only";
import {
  Voucher,
  VoucherFormInput,
  voucherFormSchema,
  VoucherList,
  voucherListResponseSchema,
  voucherSchema,
} from "../validators/voucher";
import { cookies } from "next/headers";
import z from "zod";

export type VoucherSortBy =
  | "expiry_date"
  | "discount_percent"
  | "created_at"
  | "updated_at";
export type VoucherSortOrder = "asc" | "desc";

export type GetVouchersParams = {
  page?: number;
  limit?: number;
  search?: string | null;
  sortBy?: VoucherSortBy;
  sortOrder?: VoucherSortOrder;
};

export async function getVouchers(
  params: GetVouchersParams
): Promise<VoucherList> {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "expiry_date",
    sortOrder = "asc",
  } = params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vouchers`);

  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort_by", sortBy);
  url.searchParams.set("sort_order", sortOrder);

  if (search && search.trim() !== "") {
    url.searchParams.set("search", search.trim());
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (json && typeof json.message === "string" && json.message) ||
      "Failed to fetch vouchers";
    throw new Error(message);
  }

  const parsed = voucherListResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.error("Voucher list response validation failed:", parsed.error);
    throw new Error("Invalid response from server.");
  }

  return parsed.data.data;
}

const voucherDetailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: voucherSchema,
});

export async function getVoucherById(id: string): Promise<Voucher> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/vouchers/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (json && typeof json.message === "string" && json.message) ||
      "Failed to fetch voucher details";
    throw new Error(message);
  }

  const parsed = voucherDetailResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.error("Voucher detail response validation failed:", parsed.error);
    throw new Error("Invalid response from server.");
  }

  return parsed.data.data;
}

type ActionResult = {
  success: boolean;
  message: string;
};

export async function createVoucher(
  input: VoucherFormInput
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      success: false,
      message: "You are not authorized.",
    };
  }

  const parsed = voucherFormSchema.safeParse(input);
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

  const body = parsed.data;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vouchers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    return {
      success: false,
      message: json?.message ?? "Failed to create voucher. Please try again.",
    };
  }

  return {
    success: true,
    message: "Voucher created successfully.",
  };
}

export async function updateVoucher(
  id: string,
  input: VoucherFormInput
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      success: false,
      message: "You are not authorized.",
    };
  }

  const parsed = voucherFormSchema.safeParse(input);
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

  const body = parsed.data;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/vouchers/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    return {
      success: false,
      message: json?.message ?? "Failed to update voucher. Please try again.",
    };
  }

  return {
    success: true,
    message: "Voucher updated successfully.",
  };
}
