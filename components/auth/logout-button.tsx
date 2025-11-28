"use client";

import { logoutAction } from "@/actions/prtected";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type LogoutButtonProps = PropsWithChildren<{
  className?: string;
}>;

const LogoutButton = ({ className, children }: LogoutButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();

        router.replace("/login");
        toast.success("Signed out successfully.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to sign out. Please try again.");
      }
    });
  };

  return (
    <Button
      className={className}
      onClick={handleLogout}
      variant={"outline"}
      size={"sm"}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : children}
    </Button>
  );
};

export default LogoutButton;
