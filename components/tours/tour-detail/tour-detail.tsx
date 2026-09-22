"use client";
import "./tour-detail.scss";

import Link from "next/link";
import { useMemo } from "react";
import { Wrapper } from "@/components/layout/wrapper";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { TourGallery } from "@/components/tours/tour-gallery";
import { TourAlbum, tourAlbum } from "@/components/tours/tour-album";
import { ReviewCard } from "@/components/tours/review-card";
import { bookPath, initials, leftover, reviewsForTour } from "@/data";
import { canBook, canManageTour } from "@/lib/access";
import { tourLetter } from "@/lib/tour-letter";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";

export function TourDetail({ slug }: { slug: string }) {
  const { tourBySlug, userById, user, bookings, conversations } = useTuro();
  const { t, tx, money, locale } = useLocale();
  const tour = tourBySlug(slug);
  const reviews = useMemo(() => (tour ? reviewsForTour(tour.slug) : []), [tour]);

  if (!tour) {
    return (
      <Wrapper className="tour-detail tour-detail_empty">
        <h1>{t("tour.missing")}</h1>
        <p>{t("tour.missingText")}</p>
        <Button asChild>
          <Link href="/tours/">{t("tour.toCatalog")}</Link>
        </Button>
      </Wrapper>
    );
  }

  const organizer = userById(tour.organizerId);
  const letter = tourLetter({
    locale,
    title: tx(tour.title),
    subtitle: tx(tour.subtitle),
    city: tx(tour.city),
    country: tx(tour.country),
    days: tour.durationDays,
    seats: tour.seats,
    style: t(`style.${tour.style}`),
    styleKey: tour.style,
    difficulty: t(`diff.${tour.difficulty}`),
    meeting: tx(tour.meetingPoint),
    cancellation: tx(tour.cancellation),
    included: tour.included.map((item) => tx(item)),
    excluded: tour.excluded.map((item) => tx(item)),
    host: organizer?.name ?? "",
  });
  const open = leftover(tour) > 0;
  const mine = bookings.some(
    (item) =>
      user &&
      item.userId === user.id &&
      item.tourSlug === tour.slug &&
      item.status !== "cancelled",
  );
  const chat = conversations.find(
    (item) => item.tourSlug === tour.slug && item.travelerId === user?.id,
  );
  const gallery = [tour.cover, ...tour.gallery.filter((src) => src !== tour.cover)];

  return (
    <article className="tour-detail">
      <TourGallery title={tx(tour.title)} images={gallery} />

      <Wrapper className="tour-detail__layout">
        <div className="tour-detail__main">
          <p className="tour-detail__place">
            {t(`continent.${tour.continent}`)} · {tx(tour.city)}, {tx(tour.country)}
          </p>
          <h1 className="tour-detail__title">{tx(tour.title)}</h1>
          <p className="tour-detail__lead">{tx(tour.subtitle)}</p>
          <div className="tour-detail__chips">
            <Badge variant="soft">{t("tour.days", { n: tour.durationDays })}</Badge>
            <Badge variant="outline">{t(`diff.${tour.difficulty}`)}</Badge>
            <Badge variant="outline">{t(`style.${tour.style}`)}</Badge>
            {tour.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tx(tag)}
              </Badge>
            ))}
          </div>

          <dl className="tour-detail__facts">
            <div>
              <dt>{t("tour.duration")}</dt>
              <dd>{t("tour.days", { n: tour.durationDays })}</dd>
            </div>
            <div>
              <dt>{t("tour.dates")}</dt>
              <dd>{t("tour.datesOpen", { n: tour.departures.length })}</dd>
            </div>
            <div>
              <dt>{t("tour.seats")}</dt>
              <dd>{open ? t("tour.group", { n: tour.seats }) : t("tour.seatsClosed")}</dd>
            </div>
            <div>
              <dt>{t("tour.rating")}</dt>
              <dd>
                {tour.rating.toFixed(1)} · {t("tour.reviews", { n: tour.reviewsCount })}
              </dd>
            </div>
            <div>
              <dt>{t("tour.meet")}</dt>
              <dd>{tx(tour.meetingPoint)}</dd>
            </div>
          </dl>

          <section className="tour-detail__letter">
            <p className="tour-detail__letter-kicker">{t("tour.letterKicker")}</p>
            {letter.map((paragraph) => (
              <p key={paragraph} className="tour-detail__script">
                {paragraph}
              </p>
            ))}
          </section>

          <TourAlbum title={tx(tour.title)} images={tourAlbum(tour)} />

          <Tabs defaultValue="plan" className="tour-detail__tabs">
            <TabsList>
              <TabsTrigger value="plan">{t("tour.tabPlan")}</TabsTrigger>
              <TabsTrigger value="inc">{t("tour.tabInc")}</TabsTrigger>
              <TabsTrigger value="rev">{t("tour.tabRev", { n: reviews.length })}</TabsTrigger>
            </TabsList>
            <TabsContent value="plan">
              <ol className="tour-detail__days">
                {tour.itinerary.map((day) => (
                  <li key={day.day}>
                    <span>{t("tour.day", { n: day.day })}</span>
                    <h3>{tx(day.title)}</h3>
                    <p>{tx(day.text)}</p>
                  </li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="inc">
              <div className="tour-detail__split">
                <div>
                  <h3>{t("tour.included")}</h3>
                  <ul>
                    {tour.included.map((item) => (
                      <li key={item}>{tx(item)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>{t("tour.excluded")}</h3>
                  <ul>
                    {tour.excluded.map((item) => (
                      <li key={item}>{tx(item)}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="tour-detail__note">{tx(tour.cancellation)}.</p>
            </TabsContent>
            <TabsContent value="rev">
              <div className="tour-detail__reviews">
                {reviews.length === 0 ? (
                  <p>{t("tour.noReviews")}</p>
                ) : (
                  reviews.map((review) => {
                    const author = userById(review.userId);
                    return (
                      <ReviewCard
                        key={review.id}
                        author={author?.name ?? t("tour.guest")}
                        rating={review.rating}
                        date={review.date}
                        title={tx(review.title)}
                        text={tx(review.text)}
                      />
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="tour-detail__aside">
          <p className="tour-detail__price">{money(tour.price)}</p>
          <p className="tour-detail__per">{t("tour.perPerson")}</p>
          {organizer ? (
            <Link href={`/guides/${organizer.id}/`} className="tour-detail__host">
              <Avatar>
                {organizer.avatar ? <AvatarImage src={organizer.avatar} alt="" /> : null}
                <AvatarFallback>{initials(organizer.name)}</AvatarFallback>
              </Avatar>
              <span>
                <strong>{organizer.name}</strong>
                <em>
                  {tx(organizer.city)} · {organizer.rating.toFixed(1)}
                </em>
              </span>
            </Link>
          ) : null}
          {canManageTour(user, tour.organizerId) ? (
            <Button asChild variant="cta" size="lg">
              <Link href={`/account/tours/${tour.slug}/`}>{t("tour.manage")}</Link>
            </Button>
          ) : !user || canBook(user.role) ? (
            mine ? (
              <Button asChild variant="cta" size="lg">
                <Link href={chat ? `/messages/?c=${chat.id}` : "/messages/"}>{t("tour.write")}</Link>
              </Button>
            ) : (
              <Button asChild variant="cta" size="lg" disabled={!open}>
                <Link href={bookPath(tour)}>{open ? t("tour.pay") : t("tour.seatsClosed")}</Link>
              </Button>
            )
          ) : (
            <p className="tour-detail__lock">{t("tour.hostNote")}</p>
          )}
          <Button asChild variant="outline">
            <Link href={user && !canBook(user.role) ? "/account/tours/" : "/tours/"}>
              {user?.role === "admin" ? t("tour.manageAll") : user?.role === "organizer" ? t("header.myTours") : t("tour.other")}
            </Link>
          </Button>
        </aside>
      </Wrapper>
    </article>
  );
}
