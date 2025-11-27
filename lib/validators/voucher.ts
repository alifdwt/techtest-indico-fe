import z from "zod";

export const voucherSchema = z.object({
  id: z.string(),
  voucher_code: z.string(),
  discount_percent: z.number(),
  expiry_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Voucher = z.infer<typeof voucherSchema>;

export const voucherListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    total: z.number().int().nonnegative(),
    vouchers: z.array(voucherSchema),
  }),
});

export type VoucherList = z.infer<typeof voucherListResponseSchema>["data"];
