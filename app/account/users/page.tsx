import type { Metadata } from "next";
import { UsersAdmin } from "@/components/account/users-admin";

export const metadata: Metadata = { title: "Пользователи — Turo" };

export default function UsersPage() {
  return (
    <main>
      <UsersAdmin />
    </main>
  );
}
