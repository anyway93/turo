import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Регистрация — Turo",
};

export default function RegisterPage() {
  return (
    <main>
      <Suspense>
        <RegisterScreen />
      </Suspense>
    </main>
  );
}
