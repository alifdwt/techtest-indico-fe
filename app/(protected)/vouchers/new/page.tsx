import VoucherForm from "@/components/vouchers/voucher-form";

export default function NewVoucherPage() {
  return (
    <section className="space-y-6">
      <VoucherForm mode="create" />
    </section>
  );
}
