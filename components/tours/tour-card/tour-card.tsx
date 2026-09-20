"use client";
import "./tour-card.scss";

import { MediaImage } from "@/components/widgets/media-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatRange, moneyFrom, seatsLeft, tourPath } from "@/data";
import type { Tour } from "@/data";

export function TourCard({ tour, index = 0 }: { tour: Tour; index?: number }) {
  const left = seatsLeft(tour);

  return (
    <Link
      href={tourPath(tour)}
      className="tour-card"
      style={{ animationDelay: `${Math.min(index, 8) * 0.07}s` }}
    >
      <div className="tour-card__media">
        <div className="tour-card__photo">
          <MediaImage src={tour.cover} alt={tour.title} fill sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
        <span className="tour-card__veil" aria-hidden />
        <span className="tour-card__dim" aria-hidden />
        <span className="tour-card__shine" aria-hidden />
        <span className="tour-card__peek">
          Смотреть
          <ArrowUpRight />
        </span>
      </div>
      <div className="tour-card__body">
        <div className="tour-card__top">
          <p className="tour-card__place">
            {tour.city}, {tour.country}
          </p>
          <Badge variant="soft">{tour.durationDays} дн.</Badge>
        </div>
        <h3 className="tour-card__title">{tour.title}</h3>
        <p className="tour-card__text">{tour.subtitle}</p>
        <div className="tour-card__meta">
          <span>{formatRange(tour.startDate, tour.endDate)}</span>
          <span>{left > 0 ? `${left} мест` : "Мест нет"}</span>
        </div>
        <div className="tour-card__foot">
          <strong>{moneyFrom(tour.price)}</strong>
          <span className="tour-card__rate">
            {tour.rating.toFixed(1)} · {tour.reviewsCount} отзывов
          </span>
        </div>
      </div>
    </Link>
  );
}
