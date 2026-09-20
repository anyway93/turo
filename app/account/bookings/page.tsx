import type { Metadata } from "next";
import { AccountBookings } from "@/components/account/account-home";

export const metadata: Metadata = { title: "Мои брони — Turo" };

export default function BookingsPage() {
  return (
    <main>
      <AccountBookings />
    </main>
  );
}
