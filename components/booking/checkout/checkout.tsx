"use client";
import "./checkout.scss";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wrapper } from "@/components/layout/wrapper";
import { Button, Field, FieldLabel, Input } from "@/components/ui";
import { leftover, nextOpenStart, takenMap, tourPath, tripEnd } from "@/data";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";
import { DeparturePicker } from "@/components/tours/departure-picker";

export function Checkout({ slug, date: dateQuery }: { slug: string; date?: string }) {
  const router = useRouter();
  const { tourBySlug, user, book, ready } = useTuro();
  const { t, tx, money, range } = useLocale();
  const tour = tourBySlug(slug);
  const [guests, setGuests] = useState(1);
  const [card, setCard] = useState("4242424242424242");
  const [name, setName] = useState(user?.name ?? "");
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState(dateQuery ?? "");

  useEffect(() => {
    if (!tour) return;
    setDate((current) => {
      const next = current || dateQuery || nextOpenStart(tour) || "";
      return tour.departures.some((item) => item.start === next) ? next : (nextOpenStart(tour) ?? "");
    });
  }, [dateQuery, tour]);

  if (!ready) return <Wrapper className="checkout">{t("checkout.loading")}</Wrapper>;

  if (!tour) {
    return (
      <Wrapper className="checkout">
        <h1>{t("checkout.missing")}</h1>
        <Button asChild>
          <Link href="/tours/">{t("checkout.catalog")}</Link>
        </Button>
      </Wrapper>
    );
  }

  const left = leftover(tour, date);

  if (!user) {
    const next = `/book/?slug=${tour.slug}${date ? `&date=${date}` : ""}`;
    return (
      <Wrapper className="checkout">
        <h1>{t("checkout.loginTitle")}</h1>
        <p>{t("checkout.loginText")}</p>
        <div className="checkout__row">
          <Button asChild variant="cta">
            <Link href={`/login/?next=${encodeURIComponent(next)}`}>{t("checkout.login")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/register/?next=${encodeURIComponent(next)}`}>{t("checkout.register")}</Link>
          </Button>
        </div>
      </Wrapper>
    );
  }

  const total = tour.price * guests;

  function onPay() {
    if (!tour || !date) return;
    setBusy(true);
    const last4 = card.replace(/\D/g, "").slice(-4);
    const result = book({
      tourSlug: tour.slug,
      guests,
      cardLast4: last4 || "0000",
      departureStart: date,
    });
    setBusy(false);
    if (!result.ok) {
      toast.error(t(result.error ?? "error.loginToPay"));
      return;
    }
    toast.success(t("checkout.paid"));
    router.push(result.conversationId ? `/messages/?c=${result.conversationId}` : "/account/bookings/");
  }

  return (
    <Wrapper className="checkout">
      <div className="checkout__grid">
        <form
          className="checkout__form"
          onSubmit={(event) => {
            event.preventDefault();
            onPay();
          }}
        >
          <h1>{t("checkout.title")}</h1>
          <p className="checkout__hint">{t("checkout.hint")}</p>
          <Field>
            <FieldLabel>{t("checkout.date")}</FieldLabel>
            <DeparturePicker
              mode="pick"
              durationDays={tour.durationDays}
              dates={tour.departures.map((item) => item.start)}
              value={date}
              seats={tour.seats}
              taken={takenMap(tour)}
              onValueChange={setDate}
            />
          </Field>
          <Field>
            <FieldLabel>{t("checkout.passport")}</FieldLabel>
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </Field>
          <Field>
            <FieldLabel>{t("checkout.guests")}</FieldLabel>
            <Input
              type="number"
              min={1}
              max={Math.max(1, left)}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel>{t("checkout.card")}</FieldLabel>
            <Input
              inputMode="numeric"
              autoComplete="cc-number"
              value={card}
              onChange={(event) => setCard(event.target.value)}
              required
            />
          </Field>
          <div className="checkout__split">
            <Field>
              <FieldLabel>{t("checkout.exp")}</FieldLabel>
              <Input placeholder="12 / 28" defaultValue="12 / 28" />
            </Field>
            <Field>
              <FieldLabel>{t("checkout.cvc")}</FieldLabel>
              <Input placeholder="123" defaultValue="123" />
            </Field>
          </div>
          <Button type="submit" variant="cta" size="lg" disabled={busy || left < 1 || !date}>
            {t("checkout.pay", { sum: money(total) })}
          </Button>
          <p className="checkout__legal">
            {t("checkout.legal")}{" "}
            <Link href="/terms/">{t("checkout.terms")}</Link>.
          </p>
        </form>
        <aside>
          <p className="checkout__kicker">{t("checkout.kicker")}</p>
          <h2>{tx(tour.title)}</h2>
          <p>
            {tx(tour.city)}, {tx(tour.country)}
          </p>
          <p>{date ? range(date, tripEnd(date, tour.durationDays)) : t("checkout.date")}</p>
          <p>{left > 0 ? t("checkout.seats", { n: left }) : t("checkout.noSeats")}</p>
          <p className="checkout__sum">
            {t("checkout.times", { n: guests, price: money(tour.price) })}
          </p>
          <Link href={tourPath(tour)}>{t("checkout.back")}</Link>
        </aside>
      </div>
    </Wrapper>
  );
}
