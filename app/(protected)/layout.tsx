import AppSidebar from "@/components/layout/app-sidebar";
import AppTopBar from "@/components/layout/app-topbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <AppSidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <AppTopBar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
