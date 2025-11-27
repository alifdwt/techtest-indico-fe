import "server-only";
import { VoucherList, voucherListResponseSchema } from "../validators/voucher";
import { cookies } from "next/headers";

export type VoucherSortBy = "expiry_date" | "discount_percent";
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

  const url = new URL(`${process.env.API_BASE_URL}/vouchers`);

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
