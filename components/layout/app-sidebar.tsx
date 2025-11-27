"use client";

import { Gift, Menu, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const AppSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Vouchers",
      href: "/vouchers",
      icon: Gift,
    },
    {
      label: "CSV Upload",
      href: "/vouchers/upload-csv",
      icon: Upload,
    },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Gift className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Indico Tech Test</span>
          <span className="text-xs text-muted-foreground">
            Voucher dashboard
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex-1 space-y-1 px-2 py-4">
        <p className="px-2 text-xs font-medium uppercase text-muted-foreground">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/vouchers" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "mb-1 flex w-full justify-start gap-2",
                  isActive && "font-semibold"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Mobile toggle placeholder – we can enhance later */}
      <div className="flex items-center justify-between border-t px-4 py-3 md:hidden">
        <span className="text-sm font-medium">Menu</span>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
