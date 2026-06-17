import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin/access";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always render fresh — analytics should never be cached/prerendered.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in → send to login and back. Signed in but not an admin → 404
  // (don't reveal that /admin exists).
  if (!user) redirect("/login?next=/admin");
  if (!isAdminEmail(user.email)) notFound();

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-1">
        <p className="kicker !text-accent">Admin</p>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted">
          Signed in as {user.email}. Visible only to you.
        </p>
      </div>
      <AdminNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}
