"use client";
import "./hero-slider.scss";

import { MediaImage } from "@/components/widgets/media-image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, IconButton, Pager } from "@/components/ui";
import { Wrapper } from "@/components/layout/wrapper";
import { cx } from "@/lib/cx";
import { useLocale } from "@/lib/locale";

export const popularTours = [
  {
    id: "santorini",
    days: 7,
    price: 89900,
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1920&q=75",
  },
  {
    id: "alps",
    days: 8,
    price: 124000,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=75",
  },
  {
    id: "bali",
    days: 10,
    price: 97500,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=75",
  },
  {
    id: "iceland",
    days: 9,
    price: 156000,
    image:
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1920&q=75",
  },
] as const;

const INTERVAL = 7000;
const DURATION = 820;
const COPY_IN = Math.round(DURATION * 0.58);
const PARALLAX = 0.24;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

export function HeroSlider() {
  const { t, money } = useLocale();
  const count = popularTours.length;
  const trackSlides = useMemo(
    () => [popularTours[count - 1], ...popularTours, popularTours[0]],
    [count],
  );

  const [pos, setPos] = useState(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [instant, setInstant] = useState(false);
  const [armed, setArmed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [width, setWidth] = useState(0);
  const [shown, setShown] = useState<(typeof popularTours)[number]>(popularTours[0]);
  const stageRef = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const posRef = useRef(1);
  const settledPos = useRef<number | null>(null);
  const touchX = useRef<number | null>(null);
  const copyTimer = useRef<number>(0);
  const settleTimer = useRef<number>(0);

  const tourAt = useCallback(
    (index: number) => popularTours[((index - 1) % count + count) % count],
    [count],
  );

  useLayoutEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => setWidth(el.getBoundingClientRect().width);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (width === 0 || armed) return;
    const id = window.requestAnimationFrame(() => setArmed(true));
    return () => window.cancelAnimationFrame(id);
  }, [width, armed]);

  useEffect(() => {
    if (!instant) return;
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setInstant(false);
        locked.current = false;
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [instant]);

  const revealCopy = useCallback(() => {
    window.clearTimeout(copyTimer.current);
    setShown(tourAt(posRef.current));
    setLeaving(false);
  }, [tourAt]);

  const finishMove = useCallback(() => {
    const current = posRef.current;
    if (settledPos.current === current) return;
    settledPos.current = current;
    window.clearTimeout(settleTimer.current);
    revealCopy();

    if (current === 0) {
      setInstant(true);
      setPos(count);
      return;
    }
    if (current === count + 1) {
      setInstant(true);
      setPos(1);
      return;
    }
    locked.current = false;
  }, [count, revealCopy]);

  const startMove = useCallback(
    (direction: 1 | -1, delta: number) => {
      locked.current = true;
      settledPos.current = null;
      setDir(direction);
      setLeaving(true);
      setPos((value) => value + delta);
      window.clearTimeout(copyTimer.current);
      window.clearTimeout(settleTimer.current);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      copyTimer.current = window.setTimeout(revealCopy, reduced ? 0 : COPY_IN);
      settleTimer.current = window.setTimeout(finishMove, reduced ? 0 : DURATION + 80);
    },
    [finishMove, revealCopy],
  );

  const go = useCallback((direction: 1 | -1) => {
    if (locked.current) return;
    startMove(direction, direction);
  }, [startMove]);

  const goTo = useCallback(
    (target: number) => {
      if (locked.current) return;
      const current = ((posRef.current - 1) % count + count) % count;
      if (target === current) return;

      const forward = (target - current + count) % count;
      const backward = (current - target + count) % count;
      const direction: 1 | -1 = forward <= backward ? 1 : -1;
      startMove(direction, direction === 1 ? forward : -backward);
    },
    [count, startMove],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!locked.current) go(1);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [go]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) {
      touchX.current = null;
      return;
    }
    touchX.current = event.clientX;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (touchX.current == null) return;
    const delta = event.clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(delta) < 56) return;
    go(delta < 0 ? 1 : -1);
  };

  const onTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;

    finishMove();
  };

  useEffect(
    () => () => {
      window.clearTimeout(copyTimer.current);
      window.clearTimeout(settleTimer.current);
    },
    [],
  );

  const slide = shown;
  const motion =
    instant || !armed ? "none" : `transform ${DURATION}ms ${EASE}`;

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label={t("hero.label")}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        touchX.current = null;
      }}
    >
      <div className="hero__stage" ref={stageRef}>
        <div
          className="hero__track"
          style={{
            transform: `translate3d(${-pos * width}px, 0, 0)`,
            transition: motion,
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {trackSlides.map((tour, i) => (
            <div className="hero__slide" key={`${tour.id}-${i}`} aria-hidden={i !== pos}>
              <div
                className="hero__media"
                style={{
                  transform: `translate3d(${(pos - i) * width * PARALLAX}px, 0, 0)`,
                  transition: motion,
                }}
              >
                <MediaImage
                  src={tour.image}
                  alt={t(`hero.${tour.id}.title`)}
                  fill
                  priority
                  quality={75}
                  sizes="100vw"
                  draggable={false}
                  className="hero__image"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="hero__veil" />
      </div>

      <Wrapper className="hero__shell">
        <div className="hero__content">
          <div
            className={cx("hero__copy", dir === 1 ? "is-next" : "is-prev", leaving && "is-leaving")}
            key={slide.id}
          >
            <p className="hero__kicker">
              {t("hero.kicker")} · 0{popularTours.indexOf(slide) + 1} / 0{count}
            </p>
            <h1 className="hero__title">{t(`hero.${slide.id}.title`)}</h1>
            <p className="hero__meta">
              {t(`hero.${slide.id}.place`)}
              <span />
              {t("hero.days", { n: slide.days })}
              <span />
              {t("hero.from", { price: money(slide.price) })}
            </p>
            <div className="hero__cta">
              <Button asChild size="lg" variant="cta">
                <Link href={`/tours/${slide.id}/`}>{t("hero.book")}</Link>
              </Button>
              <Button asChild size="lg" variant="glass">
                <Link href="/tours/">{t("hero.all")}</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="hero__bar">
          <Pager
            className="hero__pager"
            durationMs={INTERVAL}
            active={popularTours.indexOf(slide)}
            onSelect={goTo}
            items={popularTours.map((tour) => ({
              id: tour.id,
              label: t(`hero.${tour.id}.title`),
            }))}
          />

          <div className="hero__controls">
            <IconButton
              label={t("hero.prev")}
              variant="glass-tile"
              size="icon-xl"
              onClick={() => go(-1)}
            >
              <ArrowLeft />
            </IconButton>
            <IconButton
              label={t("hero.next")}
              variant="glass-tile"
              size="icon-xl"
              onClick={() => go(1)}
            >
              <ArrowRight />
            </IconButton>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
