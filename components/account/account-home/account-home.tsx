"use client";
import "./account-home.scss";

import Link from "next/link";
import { Wrapper } from "@/components/layout/wrapper";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { initials, tourPath, tripEnd } from "@/data";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";

export function AccountNav() {
  const { t } = useLocale();
  const items = [
    { href: "/account/", label: t("account.profile") },
    { href: "/account/bookings/", label: t("account.bookings") },
    { href: "/account/tours/", label: t("account.tours") },
    { href: "/messages/", label: t("account.messages") },
  ];
  return (
    <nav className="account-nav" aria-label={t("account.nav")}>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AccountHome() {
  const { user, ready, logout, bookings, tours } = useTuro();
  const { t, tx } = useLocale();

  if (!ready) return <Wrapper className="account-home">{t("account.loading")}</Wrapper>;
  if (!user) {
    return (
      <Wrapper className="account-home">
        <h1>{t("account.title")}</h1>
        <p>{t("account.lead")}</p>
        <Button asChild variant="cta">
          <Link href="/login/?next=/account/">{t("account.login")}</Link>
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
            {tx(user.city)} · {user.email}
          </p>
          <p>{tx(user.bio)}</p>
        </div>
      </header>
      <div className="account-home__stats">
        <article>
          <strong>{mine.length}</strong>
          <span>{t("account.bookingsCount")}</span>
        </article>
        <article>
          <strong>{hosted.length}</strong>
          <span>{t("account.toursCount")}</span>
        </article>
        <article>
          <strong>{t("account.both")}</strong>
          <span>{t("account.profileKind")}</span>
        </article>
      </div>
      <Button variant="outline" onClick={logout}>
        {t("account.logout")}
      </Button>
    </Wrapper>
  );
}

export function AccountBookings() {
  const { user, ready, bookings, tours } = useTuro();
  const { t, tx, money, range } = useLocale();
  if (!ready) return null;
  if (!user) {
    return (
      <Wrapper className="account-home">
        <Button asChild>
          <Link href="/login/?next=/account/bookings/">{t("account.login")}</Link>
        </Button>
      </Wrapper>
    );
  }
  const mine = bookings.filter((item) => item.userId === user.id);

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <h1>{t("account.bookings")}</h1>
      {mine.length === 0 ? (
        <p>{t("account.bookingsEmpty")}</p>
      ) : (
        <ul className="account-home__list">
          {mine.map((item) => {
            const tour = tours.find((entry) => entry.slug === item.tourSlug);
            return (
              <li key={item.id}>
                <div>
                  <strong>{tour ? tx(tour.title) : item.tourSlug}</strong>
                  <span>
                    {t("account.guests", { n: item.guests })} · {money(item.total)} · {t(`status.${item.status}`)}
                  </span>
                  {tour && item.departureStart ? (
                    <em>{range(item.departureStart, tripEnd(item.departureStart, tour.durationDays))}</em>
                  ) : null}
                </div>
                {tour ? (
                  <Link href={tourPath(tour)}>{t("account.open")}</Link>
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
  const { t, tx } = useLocale();
  if (!ready) return null;
  if (!user) {
    return (
      <Wrapper className="account-home">
        <Button asChild>
          <Link href="/login/?next=/account/tours/">{t("account.login")}</Link>
        </Button>
      </Wrapper>
    );
  }
  const hosted = tours.filter((item) => item.organizerId === user.id);

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <div className="account-home__title-row">
        <h1>{t("account.tours")}</h1>
        <Button asChild variant="cta" size="sm">
          <Link href="/create/">{t("account.newTour")}</Link>
        </Button>
      </div>
      {hosted.length === 0 ? (
        <p>{t("account.toursEmpty")}</p>
      ) : (
        <ul className="account-home__list">
          {hosted.map((tour) => (
            <li key={tour.slug}>
              <div>
                <strong>{tx(tour.title)}</strong>
                <span>
                  {tx(tour.city)} · {t("account.seats", { taken: tour.seatsTaken, total: tour.seats })}
                </span>
              </div>
              <Link href={tourPath(tour)}>{t("account.card")}</Link>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
