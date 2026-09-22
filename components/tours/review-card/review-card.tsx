"use client";
import "./review-card.scss";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { useLocale } from "@/lib/locale";

const FOLD_AT = 180;

function ReviewStars({ rating, label }: { rating: number; label: string }) {
  const value = Math.max(0, Math.min(5, rating));

  return (
    <span className="review-card__stars" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, value - index));
        return (
          <span key={index} className="review-card__star" aria-hidden>
            <Star />
            <span className="review-card__star-fill" style={{ width: `${fill * 100}%` }}>
              <Star />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function ReviewCard({
  author,
  rating,
  date,
  title,
  text,
}: {
  author: string;
  rating: number;
  date: string;
  title: string;
  text: string;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const long = text.length > FOLD_AT;
  const stars = t("tour.stars", { n: Number.isInteger(rating) ? String(rating) : rating.toFixed(1) });

  return (
    <article className="review-card">
      <header>
        <strong>{author}</strong>
        <span className="review-card__meta">
          <ReviewStars rating={rating} label={stars} />
          <time dateTime={date}>{date}</time>
        </span>
      </header>
      <h3>{title}</h3>
      <p className={long ? "review-card__text review-card__text_folded" : "review-card__text"}>{text}</p>
      {long ? (
        <Button type="button" variant="text" className="review-card__more" onClick={() => setOpen(true)}>
          {t("tour.readReview")}
        </Button>
      ) : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="review-card__dialog">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <p className="review-card__meta">
              <span>{author}</span>
              <ReviewStars rating={rating} label={stars} />
              <time dateTime={date}>{date}</time>
            </p>
          </DialogHeader>
          <DialogDescription className="review-card__full">{text}</DialogDescription>
        </DialogContent>
      </Dialog>
    </article>
  );
}
