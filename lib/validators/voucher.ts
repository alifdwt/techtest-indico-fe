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

export const voucherFormSchema = z.object({
  voucher_code: z
    .string()
    .min(1, "Voucher code is required")
    .max(255, "Voucher code must be less than 255 characters"),
  discount_percent: z
    .number()
    .int("Discount must be an integer")
    .min(1, "Discount percent is required")
    .max(100, "Discount percent must be less than 100"),
  expiry_date: z.string().min(1, "Expiry date is required"),
});

export type VoucherFormInput = z.infer<typeof voucherFormSchema>;
