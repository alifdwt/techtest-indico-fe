"use server";

import {
  csvUploadResponseSchema,
  CsvUploadSummary,
} from "@/lib/validators/csv";
import { cookies } from "next/headers";

export type UploadCsvResult = {
  success: boolean;
  message: string;
  summary?: CsvUploadSummary;
};

export async function uploadCsvAction(
  formData: FormData
): Promise<UploadCsvResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return {
      success: false,
      message: "You are not authorized.",
    };
  }

  const file = formData.get("file") as File;
  if (!file || !(file instanceof Blob)) {
    return {
      success: false,
      message: "Please select a CSV file to upload.",
    };
  }

  const outgoing = new FormData();
  outgoing.append("file", file, file.name ?? "vouchers.csv");

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/vouchers/upload-csv`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: outgoing,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        json?.message ||
        "Failed to fetch CSV. Please check your file and try again.";
      return {
        success: false,
        message,
      };
    }

    const parsed = csvUploadResponseSchema.safeParse(json);

    if (!parsed.success) {
      console.error("CSV upload response validation failed:", parsed.error);
      return {
        success: false,
        message: "Failed to parse CSV. Please check your file and try again.",
      };
    }

    const { success, message, data } = parsed.data;

    return {
      success,
      message,
      summary: data,
    };
  } catch (error) {
    console.error("CSV upload error:", error);
    return {
      success: false,
      message: "Failed to upload CSV. Please check your file and try again.",
    };
  }
}
