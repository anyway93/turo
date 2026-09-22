"use client";
import "./MainTours.scss";
import Link from "next/link";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { Button } from "@/components/ui";
import { TourCard } from "@/components/tours/tour-card";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";

export function MainTours() {
  const { tours, user, ready } = useTuro();
  const { t } = useLocale();
  const role = ready ? (user?.role ?? null) : null;
  const mine = role === "organizer" ? tours.filter((tour) => tour.organizerId === user?.id) : tours;
  const shown = mine.slice(0, 6);
  const title =
    role === "organizer" ? t("home.hostToursTitle") : role === "admin" ? t("home.adminToursTitle") : t("home.toursTitle");
  const text =
    role === "organizer" ? t("home.hostToursText") : role === "admin" ? t("home.adminToursText") : t("home.toursText");
  const href = role === "organizer" || role === "admin" ? "/account/tours/" : "/tours/";
  const action =
    role === "organizer" ? t("home.hostToursAll") : role === "admin" ? t("home.adminToursAll") : t("home.toursAll");

  return (
    <section className="main-tours" id="tours">
      <header>
        <Eyebrow>{t("home.toursKicker")}</Eyebrow>
        <h2>{title}</h2>
        <p>{text}</p>
      </header>
      {shown.length === 0 ? (
        <p className="main-tours__empty">{t("home.hostToursEmpty")}</p>
      ) : (
        <div className="main-tours__grid">
          {shown.map((tour, index) => (
            <TourCard key={tour.slug} tour={tour} index={index} />
          ))}
        </div>
      )}
      <div className="main-tours__actions">
        <Button asChild variant="outline" size="lg">
          <Link href={href}>{action}</Link>
        </Button>
        {role === "organizer" || role === "admin" ? (
          <Button asChild variant="cta" size="lg">
            <Link href="/create/">{t("account.newTour")}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
