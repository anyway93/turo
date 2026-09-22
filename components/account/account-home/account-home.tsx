"use client";
import "./account-home.scss";

import Link from "next/link";
import { Wrapper } from "@/components/layout/wrapper";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { initials, tourPath, tripEnd } from "@/data";
import { accountNav, canHost, canModerate } from "@/lib/access";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";

export function AccountNav() {
  const { t } = useLocale();
  const { user } = useTuro();
  if (!user) return null;
  const items = accountNav(user.role);
  return (
    <nav className="account-nav" aria-label={t("account.nav")}>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}

function Denied() {
  const { t } = useLocale();
  return (
    <Wrapper className="account-home">
      <AccountNav />
      <h1>{t("account.denied")}</h1>
      <p>{t("account.deniedText")}</p>
    </Wrapper>
  );
}

export function AccountHome() {
  const { user, ready, logout, bookings, tours, users } = useTuro();
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

  const mine = bookings.filter((item) => item.userId === user.id && item.status !== "cancelled");
  const hosted = tours.filter((item) => item.organizerId === user.id);
  const guestSeats = bookings
    .filter(
      (item) =>
        item.status !== "cancelled" && hosted.some((tour) => tour.slug === item.tourSlug),
    )
    .reduce((sum, item) => sum + item.guests, 0);

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <header className="account-home__head">
        <Avatar size="lg">
          {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="account-home__role">{t(`role.${user.role}`)}</p>
          <h1>{user.name}</h1>
          <p>
            {tx(user.city)} · {user.email}
          </p>
          <p>{tx(user.bio)}</p>
        </div>
      </header>
      <div className="account-home__stats">
        {user.role === "traveler" ? (
          <article>
            <strong>{mine.length}</strong>
            <span>{t("account.bookingsCount")}</span>
          </article>
        ) : null}
        {canHost(user.role) ? (
          <article>
            <strong>{user.role === "admin" ? tours.length : hosted.length}</strong>
            <span>{t("account.toursCount")}</span>
          </article>
        ) : null}
        {user.role === "organizer" ? (
          <article>
            <strong>{guestSeats}</strong>
            <span>{t("account.guestCount")}</span>
          </article>
        ) : null}
        {user.role === "admin" ? (
          <article>
            <strong>{users.length}</strong>
            <span>{t("account.userCount")}</span>
          </article>
        ) : null}
      </div>
      <div className="account-home__actions">
        {user.role === "traveler" ? (
          <Button asChild variant="cta">
            <Link href="/tours/">{t("home.toursAll")}</Link>
          </Button>
        ) : null}
        {canHost(user.role) ? (
          <Button asChild variant="cta">
            <Link href="/create/">{t("account.newTour")}</Link>
          </Button>
        ) : null}
        {canModerate(user.role) ? (
          <Button asChild variant="outline">
            <Link href="/account/users/">{t("account.users")}</Link>
          </Button>
        ) : null}
        <Button variant="outline" onClick={logout}>
          {t("account.logout")}
        </Button>
      </div>
    </Wrapper>
  );
}

export function AccountBookings() {
  const { user, ready, bookings, tours, userById } = useTuro();
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
  if (user.role === "organizer") return <Denied />;

  const rows =
    user.role === "admin"
      ? bookings
      : bookings.filter((item) => item.userId === user.id);

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <h1>{user.role === "admin" ? t("account.allBookings") : t("account.bookings")}</h1>
      {rows.length === 0 ? (
        <p>{t("account.bookingsEmpty")}</p>
      ) : (
        <ul className="account-home__list">
          {rows.map((item) => {
            const tour = tours.find((entry) => entry.slug === item.tourSlug);
            const guest = userById(item.userId);
            return (
              <li key={item.id}>
                <div>
                  <strong>{tour ? tx(tour.title) : item.tourSlug}</strong>
                  <span>
                    {user.role === "admin" && guest ? `${guest.name} · ` : null}
                    {t("account.guests", { n: item.guests })} · {money(item.total)} · {t(`status.${item.status}`)}
                  </span>
                  {tour && item.departureStart ? (
                    <em>{range(item.departureStart, tripEnd(item.departureStart, tour.durationDays))}</em>
                  ) : null}
                </div>
                {tour ? <Link href={tourPath(tour)}>{t("account.open")}</Link> : null}
              </li>
            );
          })}
        </ul>
      )}
    </Wrapper>
  );
}

export function AccountTours() {
  const { user, ready, tours, bookings, userById } = useTuro();
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
  if (!canHost(user.role)) return <Denied />;

  const hosted = user.role === "admin" ? tours : tours.filter((item) => item.organizerId === user.id);

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <div className="account-home__title-row">
        <h1>{user.role === "admin" ? t("account.toursAll") : t("account.tours")}</h1>
        <Button asChild variant="cta" size="sm">
          <Link href="/create/">{t("account.newTour")}</Link>
        </Button>
      </div>
      {hosted.length === 0 ? (
        <p>{t("account.toursEmpty")}</p>
      ) : (
        <ul className="account-home__list">
          {hosted.map((tour) => {
            const guests = bookings
              .filter((item) => item.tourSlug === tour.slug && item.status !== "cancelled")
              .reduce((sum, item) => sum + item.guests, 0);
            const host = userById(tour.organizerId);
            return (
              <li key={tour.slug}>
                <Link href={`/account/tours/${tour.slug}/`} className="account-home__hit">
                  <strong>{tx(tour.title)}</strong>
                  <span>
                    {user.role === "admin" && host ? `${host.name} · ` : null}
                    {tx(tour.city)} · {t("account.seats", { taken: tour.seatsTaken, total: tour.seats })}
                    {" · "}
                    {t("account.guests", { n: guests })}
                  </span>
                </Link>
                <Link href={tourPath(tour)}>{t("account.card")}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </Wrapper>
  );
}
