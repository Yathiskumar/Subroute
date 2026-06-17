import { tryLoadRawData, usersTable } from "@/lib/admin/analytics";
import { NotConfigured } from "@/components/admin/ui";
import { UsersTable } from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function AdminUsersPage() {
  const raw = await tryLoadRawData();
  if (!raw) return <NotConfigured />;
  const rows = usersTable(raw);

  return <UsersTable rows={rows} />;
}
