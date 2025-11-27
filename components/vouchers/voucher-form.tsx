"use client";

import { createVoucherAction, updateVoucherAction } from "@/actions/voucher";
import { VoucherFormInput, voucherFormSchema } from "@/lib/validators/voucher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type VoucherFormProps = {
  mode: "create" | "edit";
  voucherId?: string;
  defaultvalues?: VoucherFormInput;
};

const VoucherForm = ({ mode, voucherId, defaultvalues }: VoucherFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VoucherFormInput>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: defaultvalues ?? {
      voucher_code: "",
      discount_percent: 0,
      expiry_date: "",
    },
  });

  const onSubmit = (data: VoucherFormInput) => {
    startTransition(async () => {
      try {
        const res = isEdit
          ? await updateVoucherAction(voucherId as string, data)
          : await createVoucherAction(data);

        if (!res.success) {
          toast.error(res.message);
          setError("root", {
            type: "server",
            message: res.message,
          });
          return;
        }

        toast.success(res.message);
        router.push("/vouchers");
        // router.refresh();
      } catch (error) {
        console.error(error);
        const message =
          "Something went wrong while saving the voucher. Please try again.";
        toast.error(message);
        setError("root", {
          type: "server",
          message,
        });
      }
    });
  };

  const handleCancel = () => {
    router.push("/vouchers");
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Voucher" : "Create Voucher"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Update the voucher details and save."
            : "Enter the voucher details and save."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="voucher_code">Voucher code</Label>
            <Input
              id="voucher_code"
              placeholder="e.g. FULAN10"
              {...register("voucher_code")}
            />
            {errors.voucher_code && (
              <p className="text-sm text-destructive">
                {errors.voucher_code.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_percent">Discount percent</Label>
            <Input
              id="discount_percent"
              type="number"
              min={1}
              max={100}
              step={1}
              {...register("discount_percent", { valueAsNumber: true })}
            />
            {errors.discount_percent && (
              <p className="text-sm text-destructive">
                {errors.discount_percent.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter a value between 1 and 100
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry date</Label>
            <Input id="expiry_date" type="date" {...register("expiry_date")} />
            {errors.expiry_date && (
              <p className="text-sm text-destructive">
                {errors.expiry_date.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text.xs text-muted-foreground">
        Voucher code must be unique.
      </CardFooter>
    </Card>
  );
};

export default VoucherForm;
