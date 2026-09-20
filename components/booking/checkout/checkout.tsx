"use client";
import "./checkout.scss";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Wrapper } from "@/components/layout/wrapper";
import { Button, Field, FieldLabel, Input } from "@/components/ui";
import { formatRange, money, seatsLeft, tourPath } from "@/data";
import { useTuro } from "@/lib/turo-store";

export function Checkout({ slug }: { slug: string }) {
  const router = useRouter();
  const { tourBySlug, user, book, ready } = useTuro();
  const tour = tourBySlug(slug);
  const [guests, setGuests] = useState(1);
  const [card, setCard] = useState("4242424242424242");
  const [name, setName] = useState(user?.name ?? "");
  const [busy, setBusy] = useState(false);

  if (!ready) return <Wrapper className="checkout">Загрузка…</Wrapper>;

  if (!tour) {
    return (
      <Wrapper className="checkout">
        <h1>Тур не найден</h1>
        <Button asChild>
          <Link href="/tours/">В каталог</Link>
        </Button>
      </Wrapper>
    );
  }

  const left = seatsLeft(tour);

  if (!user) {
    const next = `/book/?slug=${tour.slug}`;
    return (
      <Wrapper className="checkout">
        <h1>Сначала войдите</h1>
        <p>Бронь и оплата доступны после входа. Это учебный платёж, карта не списывается.</p>
        <div className="checkout__row">
          <Button asChild variant="cta">
            <Link href={`/login/?next=${encodeURIComponent(next)}`}>Войти</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/register/?next=${encodeURIComponent(next)}`}>Регистрация</Link>
          </Button>
        </div>
      </Wrapper>
    );
  }

  const total = tour.price * guests;

  function onPay() {
    if (!tour) return;
    setBusy(true);
    const last4 = card.replace(/\D/g, "").slice(-4);
    const result = book({ tourSlug: tour.slug, guests, cardLast4: last4 || "0000" });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Оплачено. Чат с организатором открыт.");
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
          <h1>Оплата тура</h1>
          <p className="checkout__hint">
            Учебный платёж: любые 16 цифр. Деньги не списываются. После «оплаты» откроется личный чат
            с гидом.
          </p>
          <Field>
            <FieldLabel>Имя как в паспорте</FieldLabel>
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </Field>
          <Field>
            <FieldLabel>Гостей</FieldLabel>
            <Input
              type="number"
              min={1}
              max={Math.max(1, left)}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel>Номер карты</FieldLabel>
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
              <FieldLabel>Срок</FieldLabel>
              <Input placeholder="12 / 28" defaultValue="12 / 28" />
            </Field>
            <Field>
              <FieldLabel>CVC</FieldLabel>
              <Input placeholder="123" defaultValue="123" />
            </Field>
          </div>
          <Button type="submit" variant="cta" size="lg" disabled={busy || left < 1}>
            Оплатить {money(total)}
          </Button>
          <p className="checkout__legal">
            Нажимая кнопку, вы принимаете{" "}
            <Link href="/terms/">пользовательское соглашение</Link>.
          </p>
        </form>
        <aside>
          <p className="checkout__kicker">Вы бронируете</p>
          <h2>{tour.title}</h2>
          <p>
            {tour.city}, {tour.country}
          </p>
          <p>{formatRange(tour.startDate, tour.endDate)}</p>
          <p>{left > 0 ? `${left} мест свободно` : "Мест нет"}</p>
          <p className="checkout__sum">
            {guests} × {money(tour.price)}
          </p>
          <Link href={tourPath(tour)}>Вернуться к описанию</Link>
        </aside>
      </div>
    </Wrapper>
  );
}
