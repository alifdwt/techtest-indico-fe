"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Voucher } from "@/lib/validators/voucher";
import { VoucherSortBy, VoucherSortOrder } from "@/lib/api/voucher";
import ExportVoucherButton from "./export-voucher-button";
import DeleteVoucherButton from "./delete-voucher-button";

type Props = {
  vouchers: Voucher[];
  page: number;
  limit: number;
  total: number;
  sortBy: VoucherSortBy;
  sortOrder: VoucherSortOrder;
};

export function VoucherTable({
  vouchers,
  page,
  limit,
  total,
  sortBy,
  sortOrder,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const initialSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState(initialSearch);

  // Keep local search in sync with URL changes
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  const handleUpdateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.push(`/vouchers${query ? `?${query}` : ""}`);
  };

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleUpdateQuery({
        search: search || null,
        page: "1", // reset to page 1 on new search
      });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSort = (field: VoucherSortBy) => {
    const nextOrder: VoucherSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";

    handleUpdateQuery({
      sort_by: field,
      sort_order: nextOrder,
      page: "1",
    });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    handleUpdateQuery({ page: String(nextPage) });
  };

  const handleLimitChange = (value: string) => {
    handleUpdateQuery({
      limit: value,
      page: "1", // reset ke page 1 kalau page size berubah
    });
  };

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(date);
  };

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  const limitOptions = [5, 10, 25, 50];

  return (
    <div className="space-y-4">
      {/* Top row: search + export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by voucher code..."
              className="pl-8 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ExportVoucherButton />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voucher code</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("discount_percent")}
              >
                <div className="flex items-center gap-1">
                  Discount (%)
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("expiry_date")}
              >
                <div className="flex items-center gap-1">
                  Expiry date
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Updated at</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No vouchers found.
                </TableCell>
              </TableRow>
            ) : (
              vouchers.map((voucher) => (
                <TableRow key={voucher.id}>
                  <TableCell className="font-medium">
                    {voucher.voucher_code}
                  </TableCell>
                  <TableCell>{voucher.discount_percent}</TableCell>
                  <TableCell>{formatDate(voucher.expiry_date)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(voucher.created_at)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateTime(voucher.updated_at)}
                  </TableCell>
                  <TableCell className="space-x-1 text-right">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit voucher ${voucher.voucher_code}`}
                    >
                      <Link href={`/vouchers/${voucher.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteVoucherButton
                      id={voucher.id}
                      voucherCode={voucher.voucher_code}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination + page size */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <p>
            Showing <span className="font-medium">{from}</span>–
            <span className="font-medium">{to}</span> of{" "}
            <span className="font-medium">{total}</span> vouchers
          </p>
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select value={String(limit)} onValueChange={handleLimitChange}>
              <SelectTrigger className="h-7 w-[90px] px-2 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
