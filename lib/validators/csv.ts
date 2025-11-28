import z from "zod";

export const failedRowSchema = z.object({
  reason: z.string(),
  row_number: z.number().int(),
  voucher_code: z.string(),
});

export type FailedRow = z.infer<typeof failedRowSchema>;

export const csvUploadResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    failed_count: z.number().int().nonnegative(),
    failed_rows: z.array(failedRowSchema),
    success_count: z.number().int().nonnegative(),
  }),
});

export type CsvUploadSummary = z.infer<typeof csvUploadResponseSchema>["data"];
