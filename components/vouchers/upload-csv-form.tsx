"use client";

import { FormEvent, useState } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Upload, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { uploadCsvAction, UploadCsvResult } from "@/actions/upload-csv";

type CsvPreviewRow = {
  lineNumber: number;
  voucher_code: string;
  discount_percent: string;
  expiry_date: string;
};

const REQUIRED_HEADERS = [
  "voucher_code",
  "discount_percent",
  "expiry_date",
] as const;

type HeaderIndexMap = Partial<
  Record<(typeof REQUIRED_HEADERS)[number], number>
>;

export function UploadCsvForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewRows, setPreviewRows] = useState<CsvPreviewRow[]>([]);
  const [headerValid, setHeaderValid] = useState<boolean | null>(null);
  const [headerIndexMap, setHeaderIndexMap] = useState<HeaderIndexMap | null>(
    null
  );
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadCsvResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    setPreviewRows([]);
    setHeaderValid(null);
    setHeaderIndexMap(null);
    setParseError(null);

    if (!selected) {
      setFileName("");
      return;
    }

    setFileName(selected.name);

    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setParseError("Please upload a .csv file.");
      return;
    }

    try {
      const text = await selected.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

      if (lines.length === 0) {
        setParseError("The CSV file is empty.");
        return;
      }

      const headerLine = lines[0];
      const rawHeaders = headerLine
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      const lowerHeaders = rawHeaders.map((h) => h.toLowerCase());

      // Buat map header -> index
      const indexMap: HeaderIndexMap = {};
      lowerHeaders.forEach((h, idx) => {
        if (REQUIRED_HEADERS.includes(h as (typeof REQUIRED_HEADERS)[number])) {
          indexMap[h as (typeof REQUIRED_HEADERS)[number]] = idx;
        }
      });

      const missingHeaders = REQUIRED_HEADERS.filter(
        (h) => indexMap[h] === undefined
      );

      if (missingHeaders.length > 0) {
        setHeaderValid(false);
        setHeaderIndexMap(null);
        setParseError(
          `Missing required header(s): ${missingHeaders.join(
            ", "
          )}. Found: "${rawHeaders.join(", ")}".`
        );
      } else {
        setHeaderValid(true);
        setHeaderIndexMap(indexMap);
      }

      // Preview up to 10 data rows, mapping sesuai header index
      const dataLines = lines.slice(1, 11);
      const rows: CsvPreviewRow[] = dataLines.map((line, index) => {
        const cols = line.split(",").map((c) => c.trim());

        const getCol = (header: (typeof REQUIRED_HEADERS)[number]) => {
          const idx = indexMap[header];
          if (idx === undefined || idx >= cols.length) return "";
          return cols[idx];
        };

        return {
          lineNumber: index + 2, // 1 = header
          voucher_code: getCol("voucher_code"),
          discount_percent: getCol("discount_percent"),
          expiry_date: getCol("expiry_date"),
        };
      });

      setPreviewRows(rows);
    } catch (err) {
      console.error("Failed to parse CSV:", err);
      setParseError(
        "Could not read the file. Please ensure it is a valid CSV file."
      );
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }

    if (headerValid === false || parseError || !headerIndexMap) {
      toast.error("Please fix the CSV header or file format before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const res = await uploadCsvAction(formData);
      setResult(res);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  const totalPreviewed = previewRows.length;
  const hasFailedRows = result?.summary?.failed_rows?.length ?? 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload vouchers from CSV</CardTitle>
          <CardDescription>
            Upload a CSV file that contains the columns{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              voucher_code, discount_percent, expiry_date
            </code>
            . The column order does not matter, but all three must be present.
            You will see a preview before the data is sent to the server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="csv_file">CSV file</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  id="csv_file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              {fileName && (
                <p className="text-xs text-muted-foreground">
                  Selected file: <span className="font-medium">{fileName}</span>
                </p>
              )}
              {parseError && (
                <p className="flex items-start gap-1 text-sm text-destructive">
                  <AlertTriangle className="mt-[2px] h-4 w-4" />
                  <span>{parseError}</span>
                </p>
              )}
              {headerValid && !parseError && (
                <p className="flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Header looks valid.
                </p>
              )}
            </div>

            {previewRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  <span>Preview ({totalPreviewed} rows)</span>
                </div>
                <div className="max-h-64 overflow-auto rounded border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20 text-xs">Line</TableHead>
                        <TableHead className="text-xs">Voucher code</TableHead>
                        <TableHead className="text-xs">Discount (%)</TableHead>
                        <TableHead className="text-xs">Expiry date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewRows.map((row) => (
                        <TableRow key={row.lineNumber}>
                          <TableCell className="text-xs text-muted-foreground">
                            {row.lineNumber}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.voucher_code}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.discount_percent}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.expiry_date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only the first 10 rows are shown here. All rows will be sent
                  to the server on upload.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="submit"
                disabled={
                  isPending || !file || headerValid === false || !!parseError
                }
              >
                {isPending ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="max-w-2xl border-muted">
          <CardHeader>
            <CardTitle>Upload result</CardTitle>
            <CardDescription>{result.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.summary && (
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Successful rows:</span>
                  <span>{result.summary.success_count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Failed rows:</span>
                  <span>{result.summary.failed_count}</span>
                </div>
              </div>
            )}

            {hasFailedRows > 0 && result.summary && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Failed rows details</p>
                <div className="max-h-64 overflow-auto rounded border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20 text-xs">Row</TableHead>
                        <TableHead className="text-xs">Voucher code</TableHead>
                        <TableHead className="text-xs">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.summary.failed_rows.map((row) => (
                        <TableRow key={row.row_number}>
                          <TableCell className="text-xs text-muted-foreground">
                            {row.row_number}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.voucher_code}
                          </TableCell>
                          <TableCell className="text-xs">
                            {row.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {result.summary && result.summary.failed_count === 0 && (
              <p className="text-sm text-emerald-600">
                All rows were uploaded successfully.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
