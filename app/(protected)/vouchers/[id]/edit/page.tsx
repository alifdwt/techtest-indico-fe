import VoucherForm from "@/components/vouchers/voucher-form";
import { getVoucherById } from "@/lib/api/voucher";
import { notFound } from "next/navigation";

function toDateInputValue(isoString: string): string {
  const d = new Date(isoString);
  // yyyy-mm-dd in local time
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function EditVoucherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let voucher;
  try {
    voucher = await getVoucherById(id);
  } catch (error) {
    console.error("Failed to load voucher:", error);
    notFound();
  }

  const defaultValues = {
    voucher_code: voucher.voucher_code,
    discount_percent: voucher.discount_percent,
    expiry_date: toDateInputValue(voucher.expiry_date),
  };

  return (
    <section className="space-y-6">
      <VoucherForm mode="edit" voucherId={id} defaultvalues={defaultValues} />
    </section>
  );
}
