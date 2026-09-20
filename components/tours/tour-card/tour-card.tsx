"use client";
import "./tour-card.scss";

import { MediaImage } from "@/components/widgets/media-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui";
import { seatsLeft, tourPath } from "@/data";
import type { Tour } from "@/data";
import { useLocale } from "@/lib/locale";
import { cx } from "@/lib/cx";

export function TourCard({
  tour,
  index = 0,
  preview = false,
}: {
  tour: Tour;
  index?: number;
  preview?: boolean;
}) {
  const left = seatsLeft(tour);
  const { t, tx, money, range } = useLocale();
  const className = cx("tour-card", preview && "tour-card_preview");
  const style = { animationDelay: `${Math.min(index, 8) * 0.07}s` };
  const inner = (
    <>
      <div className="tour-card__media">
        <div className="tour-card__photo">
          <MediaImage src={tour.cover} alt={tx(tour.title)} fill sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
        <span className="tour-card__veil" aria-hidden />
        <span className="tour-card__dim" aria-hidden />
        <span className="tour-card__shine" aria-hidden />
        <span className="tour-card__peek">
          {t("card.look")}
          <ArrowUpRight />
        </span>
      </div>
      <div className="tour-card__body">
        <div className="tour-card__top">
          <p className="tour-card__place">
            {tx(tour.city)}, {tx(tour.country)}
          </p>
          <Badge variant="soft">{t("card.days", { n: tour.durationDays })}</Badge>
        </div>
        <h3 className="tour-card__title">{tx(tour.title)}</h3>
        <p className="tour-card__text">{tx(tour.subtitle)}</p>
        <div className="tour-card__meta">
          <span>{range(tour.startDate, tour.endDate)}</span>
          <span>{left > 0 ? t("card.seats", { n: left }) : t("card.noSeats")}</span>
        </div>
        <div className="tour-card__foot">
          <strong>{t("card.from", { price: money(tour.price) })}</strong>
          <span className="tour-card__rate">
            {tour.rating.toFixed(1)} · {t("card.reviews", { n: tour.reviewsCount })}
          </span>
        </div>
      </div>
    </>
  );

  if (preview) {
    return (
      <div className={className} style={style}>
        {inner}
      </div>
    );
  }

  return (
    <Link href={tourPath(tour)} className={className} style={style}>
      {inner}
    </Link>
  );
}
