"use client";
import "./account-home.scss";

import Link from "next/link";
import { Wrapper } from "@/components/layout/wrapper";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { formatRange, initials, money, tourPath } from "@/data";
import { useTuro } from "@/lib/turo-store";

const nav = [
  { href: "/account/", label: "Профиль" },
  { href: "/account/bookings/", label: "Мои брони" },
  { href: "/account/tours/", label: "Мои туры" },
  { href: "/messages/", label: "Сообщения" },
];

export function AccountNav() {
  return (
    <nav className="account-nav" aria-label="Кабинет">
      {nav.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AccountHome() {
  const { user, ready, logout, bookings, tours } = useTuro();

  if (!ready) return <Wrapper className="account-home">Загрузка…</Wrapper>;
  if (!user) {
    return (
      <Wrapper className="account-home">
        <h1>Кабинет</h1>
        <p>Войдите, чтобы видеть брони, свои туры и чаты.</p>
        <Button asChild variant="cta">
          <Link href="/login/?next=/account/">Войти</Link>
        </Button>
      </Wrapper>
    );
  }

  const mine = bookings.filter((item) => item.userId === user.id);
  const hosted = tours.filter((item) => item.organizerId === user.id);

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <header className="account-home__head">
        <Avatar size="lg">
          {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1>{user.name}</h1>
          <p>
            {user.city} · {user.email}
          </p>
          <p>{user.bio}</p>
        </div>
      </header>
      <div className="account-home__stats">
        <article>
          <strong>{mine.length}</strong>
          <span>броней</span>
        </article>
        <article>
          <strong>{hosted.length}</strong>
          <span>опубликованных туров</span>
        </article>
        <article>
          <strong>гость и гид</strong>
          <span>профиль</span>
        </article>
      </div>
      <Button variant="outline" onClick={logout}>
        Выйти
      </Button>
    </Wrapper>
  );
}

export function AccountBookings() {
  const { user, ready, bookings, tours } = useTuro();
  if (!ready) return null;
  if (!user) {
    return (
      <Wrapper className="account-home">
        <Button asChild>
          <Link href="/login/?next=/account/bookings/">Войти</Link>
        </Button>
      </Wrapper>
    );
  }
  const mine = bookings.filter((item) => item.userId === user.id);

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <h1>Мои брони</h1>
      {mine.length === 0 ? (
        <p>Пока пусто. Выберите тур в каталоге и оплатите — здесь появится запись.</p>
      ) : (
        <ul className="account-home__list">
          {mine.map((item) => {
            const tour = tours.find((entry) => entry.slug === item.tourSlug);
            return (
              <li key={item.id}>
                <div>
                  <strong>{tour?.title ?? item.tourSlug}</strong>
                  <span>
                    {item.guests} чел. · {money(item.total)} · {item.status}
                  </span>
                  {tour ? <em>{formatRange(tour.startDate, tour.endDate)}</em> : null}
                </div>
                {tour ? (
                  <Link href={tourPath(tour)}>Открыть</Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Wrapper>
  );
}

export function AccountTours() {
  const { user, ready, tours } = useTuro();
  if (!ready) return null;
  if (!user) {
    return (
      <Wrapper className="account-home">
        <Button asChild>
          <Link href="/login/?next=/account/tours/">Войти</Link>
        </Button>
      </Wrapper>
    );
  }
  const hosted = tours.filter((item) => item.organizerId === user.id);

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <div className="account-home__title-row">
        <h1>Мои туры</h1>
        <Button asChild variant="cta" size="sm">
          <Link href="/create/">Новый тур</Link>
        </Button>
      </div>
      {hosted.length === 0 ? (
        <p>Вы ещё не публиковали маршруты.</p>
      ) : (
        <ul className="account-home__list">
          {hosted.map((tour) => (
            <li key={tour.slug}>
              <div>
                <strong>{tour.title}</strong>
                <span>
                  {tour.city} · {tour.seatsTaken}/{tour.seats} мест
                </span>
              </div>
              <Link href={tourPath(tour)}>Карточка</Link>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
