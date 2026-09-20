"use client";
import "./MainTours.scss";
import Link from "next/link";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { Button } from "@/components/ui";
import { TourCard } from "@/components/tours/tour-card";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";

export function MainTours() {
  const { tours } = useTuro();
  const { t } = useLocale();
  return (
    <section className="main-tours" id="tours">
      <header>
        <Eyebrow>{t("home.toursKicker")}</Eyebrow>
        <h2>{t("home.toursTitle")}</h2>
        <p>{t("home.toursText")}</p>
      </header>
      <div className="main-tours__grid">
        {tours.slice(0, 6).map((tour, index) => (
          <TourCard key={tour.slug} tour={tour} index={index} />
        ))}
      </div>
      <Button asChild variant="outline" size="lg">
        <Link href="/tours/">{t("home.toursAll")}</Link>
      </Button>
    </section>
  );
}
