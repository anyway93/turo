"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Checkout } from "@/components/booking/checkout";

function BookQuery() {
  const params = useSearchParams();
  return <Checkout slug={params.get("slug") ?? ""} date={params.get("date") ?? ""} />;
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
