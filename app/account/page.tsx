import type { Metadata } from "next";
import { AccountHome } from "@/components/account/account-home";

export const metadata: Metadata = { title: "Кабинет — Turo" };

export default function AccountPage() {
  return (
    <main>
      <AccountHome />
    </main>
  );
}
