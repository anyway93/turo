import { Suspense } from "react";
import type { Metadata } from "next";
import { MessagesApp } from "@/components/messages/messages-app";

export const metadata: Metadata = { title: "Сообщения — Turo" };

export default function MessagesPage() {
  return (
    <main>
      <Suspense>
        <MessagesApp />
      </Suspense>
    </main>
  );
}
