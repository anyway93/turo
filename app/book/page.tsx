"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Checkout } from "@/components/booking/checkout";

function BookQuery() {
  const slug = useSearchParams().get("slug") ?? "";
  return <Checkout slug={slug} />;
}

export default function BookPage() {
  return (
    <main>
      <Suspense>
        <BookQuery />
      </Suspense>
    </main>
  );
}
