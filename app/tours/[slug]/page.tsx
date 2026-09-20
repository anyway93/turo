import type { Metadata } from "next";
import { tours } from "@/data";
import { TourDetail } from "@/components/tours/tour-detail";

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = tours.find((item) => item.slug === slug);
  return {
    title: tour ? `${tour.title} — Turo` : "Тур — Turo",
    description: tour?.subtitle,
  };
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main>
      <TourDetail slug={slug} />
    </main>
  );
}
