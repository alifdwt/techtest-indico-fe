"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { DownloadIcon } from "lucide-react";

const ExportVoucherButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/vouchers/export");

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to export vouchers.");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "vouchers.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        toast.success("Vouchers exported successfully.");
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to export vouchers. Please try again."
        );
      }
    });
  };

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      onClick={handleExport}
      disabled={isPending}
    >
      <DownloadIcon className="size-4 mr-2" />
      {isPending ? "Exporting..." : "Export"}
    </Button>
  );
};

export default ExportVoucherButton;
