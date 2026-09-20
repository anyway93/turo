import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Вход — Turo",
};

export default function LoginPage() {
  return (
    <main>
      <Suspense>
        <LoginScreen />
      </Suspense>
    </main>
  );
}
