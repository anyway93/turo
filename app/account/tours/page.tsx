import type { Metadata } from "next";
import { AccountTours } from "@/components/account/account-home";

export const metadata: Metadata = { title: "Мои туры — Turo" };

export default function MyToursPage() {
  return (
    <main>
      <AccountTours />
    </main>
  );
}
