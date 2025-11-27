import { VoucherTable } from "@/components/vouchers/voucher-table";
import {
  getVouchers,
  VoucherSortBy,
  VoucherSortOrder,
} from "@/lib/api/voucher";

function getStringParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function VoucherPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page, limit, search, sort_by, sort_order } = await searchParams;

  const pageParam = getStringParam(page);
  const limitParam = getStringParam(limit);
  const searchParam = getStringParam(search) ?? undefined;
  const sortByParam = getStringParam(sort_by) as VoucherSortBy | undefined;
  const sortOrderParam = getStringParam(sort_order) as
    | VoucherSortOrder
    | undefined;

  const pageNumber = Number.isNaN(Number(pageParam))
    ? 1
    : Math.max(1, Number(pageParam || 1));
  const limitNumber = Number.isNaN(Number(limitParam))
    ? 10
    : Math.max(1, Number(limitParam || 10));

  const sortBy: VoucherSortBy =
    sortByParam === "discount_percent" ? "discount_percent" : "expiry_date";
  const sortOrder: VoucherSortOrder =
    sortOrderParam === "desc" ? "desc" : "asc";

  const { total, vouchers } = await getVouchers({
    page: pageNumber,
    limit: limitNumber,
    search: searchParam ?? null,
    sortBy,
    sortOrder,
  });

  return (
    <section className="space-y-4">
      <VoucherTable
        vouchers={vouchers}
        page={pageNumber}
        limit={limitNumber}
        total={total}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </section>
  );
}
