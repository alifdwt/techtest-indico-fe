"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogOutIcon, PlusIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import LogoutButton from "../auth/logout-button";

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/vouchers/upload-csv")) {
    return "Upload voucher from CSV";
  }
  if (pathname.startsWith("/vouchers/new")) {
    return "Create new voucher";
  }
  if (pathname.startsWith("/vouchers/")) {
    return "Voucher details";
  }
  if (pathname.startsWith("/vouchers")) {
    return "Voucher list";
  }
  return "Dashboard";
}

const AppTopBar = () => {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  const showCreateButton =
    pathname === "/vouchers" ||
    pathname.startsWith("/vouchers?") ||
    pathname === "/vouchers/";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Vouchers
        </span>
        <span className="text-lg font-semibold">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        {showCreateButton && (
          <Button asChild size={"sm"}>
            <Link href="/vouchers/new">
              <PlusIcon className="mr-2 size-4" />
              New Voucher
            </Link>
          </Button>
        )}

        <Separator orientation="vertical" className="h-6" />

        <LogoutButton>
          <LogOutIcon className="mr-2 size-4" />
          <span className="hidden sm:inline">Sign out</span>
        </LogoutButton>
      </div>
    </header>
  );
};

export default AppTopBar;
