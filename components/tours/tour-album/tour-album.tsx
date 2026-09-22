"use client";
import "./tour-album.scss";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaImage } from "@/components/widgets/media-image";
import { photos } from "@/data/media/photos";
import type { Tour, TourStyle } from "@/data";
import { cx } from "@/lib/cx";
import { useLocale } from "@/lib/locale";

const MOVE = 900;
const LIMIT = 12;

const byStyle: Record<TourStyle, string[]> = {
  море: [photos.coast, photos.boat, photos.maldives, photos.amalfi, photos.night, photos.food, photos.greece],
  пеший: [photos.hike, photos.alps, photos.forest, photos.lake, photos.nepal, photos.kamchatka, photos.patagonia],
  город: [photos.night, photos.market, photos.food, photos.rome, photos.paris, photos.lisbon, photos.prague],
  гастро: [photos.food, photos.market, photos.village, photos.night, photos.coast, photos.amalfi, photos.mexico],
  природа: [photos.forest, photos.lake, photos.hike, photos.fjord, photos.canada, photos.nz, photos.village],
  культура: [photos.temple, photos.kyoto, photos.rome, photos.market, photos.india, photos.prague, photos.night],
  фото: [photos.night, photos.desert, photos.coast, photos.lake, photos.temple, photos.alps, photos.village],
  приключение: [photos.hike, photos.desert, photos.kamchatka, photos.kenya, photos.boat, photos.patagonia, photos.forest],
};

const shared = [
  photos.food,
  photos.night,
  photos.village,
  photos.market,
  photos.lake,
  photos.forest,
  photos.coast,
  photos.hike,
  photos.boat,
  photos.temple,
];

export function tourAlbum(tour: Pick<Tour, "cover" | "gallery" | "style">) {
  const pool = [tour.cover, ...tour.gallery, ...(byStyle[tour.style] ?? []), ...shared];
  const seen = new Set<string>();
  const images: string[] = [];
  for (const src of pool) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    images.push(src);
    if (images.length === LIMIT) break;
  }
  return images;
}

export function TourAlbum({ title, images }: { title: string; images: string[] }) {
  const slides = images.filter(Boolean);
  const count = slides.length;
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [playId, setPlayId] = useState(0);
  const touchX = useRef<number | null>(null);
  const timer = useRef(0);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function go(next: number, step?: 1 | -1) {
    if (count < 2) return;
    const target = (next + count) % count;
    if (target === index) return;
    const forward = (target - index + count) % count;
    const backward = (index - target + count) % count;
    setDir(step ?? (forward <= backward ? 1 : -1));
    setPlayId((id) => id + 1);
    setLeaving(index);
    setIndex(target);
    const rail = railRef.current;
    const track = trackRef.current;
    const thumb = track?.children[target] as HTMLElement | undefined;
    if (rail && thumb) {
      const max = Math.max(0, rail.scrollHeight - rail.clientHeight);
      const desired = thumb.offsetTop - (rail.clientHeight - thumb.offsetHeight) / 2;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rail.scrollTo({
        top: Math.min(max, Math.max(0, desired)),
        behavior: reduce ? "auto" : "smooth",
      });
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLeaving(null), MOVE);
  }

  if (count === 0) return null;

  return (
    <section
      className={cx("tour-album", leaving != null && "is-moving", playId % 2 === 1 && "is-play-b")}
      data-dir={dir}
      aria-roledescription="carousel"
      aria-label={t("gallery.album")}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1, 1);
        if (event.key === "ArrowLeft") go(index - 1, -1);
      }}
    >
      <p className="tour-album__kicker">{t("gallery.album")}</p>
      <div className="tour-album__layout">
        <div
          className="tour-album__stage"
          onTouchStart={(event) => {
            touchX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchX.current;
            const end = event.changedTouches[0]?.clientX;
            touchX.current = null;
            if (start == null || end == null) return;
            const delta = end - start;
            if (Math.abs(delta) < 48) return;
            go(index + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
          }}
        >
          {slides.map((src, slideIndex) => (
            <div
              key={`${src}-${slideIndex}`}
              className={cx(
                "tour-album__frame",
                slideIndex === index && "is-on",
                slideIndex === leaving && "is-leaving",
              )}
            >
              <div className="tour-album__photo">
                <MediaImage
                  src={src}
                  alt={slideIndex === index ? title : ""}
                  fill
                  sizes="(min-width: 1024px) 50vw, 80vw"
                  priority={slideIndex === 0}
                />
              </div>
            </div>
          ))}
          {count > 1 ? (
            <div className="tour-album__nav">
              <button type="button" onClick={() => go(index - 1, -1)} aria-label={t("gallery.prev")}>
                <ChevronLeft />
              </button>
              <button type="button" onClick={() => go(index + 1, 1)} aria-label={t("gallery.next")}>
                <ChevronRight />
              </button>
              <p>
                {String(index + 1).padStart(2, "0")}
                <span>/</span>
                {String(count).padStart(2, "0")}
              </p>
            </div>
          ) : null}
        </div>
        {count > 1 ? (
          <div className="tour-album__rail" ref={railRef}>
            <div
              className="tour-album__track"
              role="tablist"
              aria-label={t("gallery.photos")}
              ref={trackRef}
            >
            {slides.map((src, slideIndex) => {
              const on = slideIndex === index;
              return (
                <button
                  key={`${src}-${slideIndex}`}
                  type="button"
                  role="tab"
                  aria-label={t("gallery.photo", { n: slideIndex + 1 })}
                  aria-selected={on}
                  className={cx("tour-album__thumb", on && "is-on")}
                  onClick={() => go(slideIndex)}
                >
                  <MediaImage src={src} alt="" fill sizes="120px" />
                  <span className="tour-album__shade" aria-hidden />
                </button>
              );
            })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
