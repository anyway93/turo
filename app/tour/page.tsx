"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TourDetail } from "@/components/tours/tour-detail";

function TourQuery() {
  const slug = useSearchParams().get("slug") ?? "";
  return <TourDetail slug={slug} />;
}

export default function CustomTourPage() {
  return (
    <main>
      <Suspense>
        <TourQuery />
      </Suspense>
    </main>
  );
}
