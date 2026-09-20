"use client";
import "./tour-gallery.scss";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { MediaImage } from "@/components/widgets/media-image";
import { cx } from "@/lib/cx";

const INTERVAL = 6500;
const FADE = 1200;
const RING_R = 37;
const RING_C = 2 * Math.PI * RING_R;

export function TourGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const slides = images.filter(Boolean);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [playId, setPlayId] = useState(0);
  const [armed, setArmed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const touchX = useRef<number | null>(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const remaining = useRef(INTERVAL);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setArmed(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const go = useCallback(
    (next: number, step?: 1 | -1) => {
      if (count < 2) return;
      const target = (next + count) % count;
      const current = indexRef.current;
      if (target === current) return;
      remaining.current = INTERVAL;
      if (step) {
        setDir(step);
      } else if (current === count - 1 && target === 0) {
        setDir(1);
      } else if (current === 0 && target === count - 1) {
        setDir(-1);
      } else {
        const forward = (target - current + count) % count;
        const backward = (current - target + count) % count;
        setDir(forward <= backward ? 1 : -1);
      }
      setPlayId((id) => id + 1);
      setLeaving(current);
      setIndex(target);
    },
    [count],
  );

  useEffect(() => {
    if (leaving == null) return;
    const id = window.setTimeout(() => setLeaving(null), FADE);
    return () => window.clearTimeout(id);
  }, [leaving]);

  useEffect(() => {
    if (paused || reduce || count < 2) return;
    const wait = remaining.current;
    const start = performance.now();
    const id = window.setTimeout(() => {
      remaining.current = INTERVAL;
      go(indexRef.current + 1, 1);
    }, wait);
    return () => {
      window.clearTimeout(id);
      if (pausedRef.current) {
        remaining.current = Math.max(40, wait - (performance.now() - start));
      }
    };
  }, [count, go, index, paused, reduce]);

  if (count === 0) return null;

  return (
    <section
      className={cx(
        "tour-gallery",
        armed && "is-armed",
        leaving != null && "is-moving",
        playId % 2 === 1 && "is-play-b",
        paused && "is-paused",
        reduce && "is-reduce",
      )}
      data-dir={dir}
      style={{ "--autoplay": `${INTERVAL}ms` } as CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
        go(indexRef.current + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
      }}
    >
      {slides.map((src, slideIndex) => (
        <div
          key={`${src}-${slideIndex}`}
          className={cx(
            "tour-gallery__slide",
            slideIndex === index && "is-on",
            slideIndex === leaving && "is-leaving",
          )}
        >
          <div className="tour-gallery__photo">
            <MediaImage
              src={src}
              alt={slideIndex === index ? title : ""}
              fill
              priority={slideIndex === 0}
              sizes="116vw"
            />
          </div>
          <div className="tour-gallery__mist" aria-hidden />
        </div>
      ))}

      <div className="tour-gallery__veil" aria-hidden />
      <div className="tour-gallery__dim" aria-hidden />

      {count > 1 ? (
        <>
          <div className="tour-gallery__progress" aria-hidden>
            <span key={index} />
          </div>

          <div className="tour-gallery__bar">
            <p className="tour-gallery__count">
              {String(index + 1).padStart(2, "0")}
              <span>/</span>
              {String(count).padStart(2, "0")}
            </p>

            <div className="tour-gallery__dock">
              <div className="tour-gallery__thumbs" role="tablist" aria-label="Фото тура">
                {slides.map((src, slideIndex) => {
                  const on = slideIndex === index;
                  return (
                    <button
                      key={`${src}-${slideIndex}`}
                      type="button"
                      role="tab"
                      aria-label={`Фото ${slideIndex + 1}`}
                      aria-selected={on}
                      className={cx("tour-gallery__thumb", on && "is-on")}
                      onClick={() => go(slideIndex)}
                    >
                      <span className="tour-gallery__orb">
                        <MediaImage src={src} alt="" fill sizes="80px" />
                      </span>
                      <svg
                        className="tour-gallery__ring"
                        viewBox="0 0 80 80"
                        aria-hidden
                      >
                        <circle
                          className="tour-gallery__ring-track"
                          cx="40"
                          cy="40"
                          r={RING_R}
                        />
                        {on ? (
                          <circle
                            key={index}
                            className="tour-gallery__ring-run"
                            cx="40"
                            cy="40"
                            r={RING_R}
                            style={
                              {
                                "--ring": RING_C,
                                strokeDasharray: RING_C,
                                strokeDashoffset: RING_C,
                              } as CSSProperties
                            }
                          />
                        ) : null}
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
