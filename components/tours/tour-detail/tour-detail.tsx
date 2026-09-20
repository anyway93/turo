"use client";
import "./tour-detail.scss";

import { MediaImage } from "@/components/widgets/media-image";
import Link from "next/link";
import { useMemo, useState } from "react";
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
import {
  bookPath,
  formatRange,
  initials,
  money,
  reviewsForTour,
  seatsLeft,
} from "@/data";
import { useTuro } from "@/lib/turo-store";
import { cx } from "@/lib/cx";

export function TourDetail({ slug }: { slug: string }) {
  const { tourBySlug, userById, user, bookings, conversations } = useTuro();
  const tour = tourBySlug(slug);
  const [photo, setPhoto] = useState(0);
  const reviews = useMemo(() => (tour ? reviewsForTour(tour.slug) : []), [tour]);

  if (!tour) {
    return (
      <Wrapper className="tour-detail tour-detail_empty">
        <h1>Тур не найден</h1>
        <p>Возможно, это черновик с другого устройства. Вернитесь в каталог.</p>
        <Button asChild>
          <Link href="/tours/">К каталогу</Link>
        </Button>
      </Wrapper>
    );
  }

  const organizer = userById(tour.organizerId);
  const left = seatsLeft(tour);
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
  const current = gallery[photo] ?? tour.cover;

  return (
    <article className="tour-detail">
      <div className="tour-detail__gallery">
        <div className="tour-detail__stage">
          <MediaImage src={current} alt={tour.title} fill sizes="100vw" priority />
        </div>
        <div className="tour-detail__thumbs">
          {gallery.slice(0, 5).map((src, index) => (
            <button
              key={src + index}
              type="button"
              className={cx("tour-detail__thumb", photo === index && "is-on")}
              onClick={() => setPhoto(index)}
            >
              <MediaImage src={src} alt="" fill sizes="120px" />
            </button>
          ))}
        </div>
      </div>

      <Wrapper className="tour-detail__layout">
        <div>
          <p className="tour-detail__place">
            {tour.continent} · {tour.city}, {tour.country}
          </p>
          <h1 className="tour-detail__title">{tour.title}</h1>
          <p className="tour-detail__lead">{tour.subtitle}</p>
          <div className="tour-detail__chips">
            <Badge variant="soft">{tour.durationDays} дней</Badge>
            <Badge variant="outline">{tour.difficulty}</Badge>
            <Badge variant="outline">{tour.style}</Badge>
            {tour.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <Tabs defaultValue="plan" className="tour-detail__tabs">
            <TabsList>
              <TabsTrigger value="plan">Программа</TabsTrigger>
              <TabsTrigger value="inc">Что входит</TabsTrigger>
              <TabsTrigger value="rev">Отзывы ({reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="plan">
              <ol className="tour-detail__days">
                {tour.itinerary.map((day) => (
                  <li key={day.day}>
                    <span>День {day.day}</span>
                    <h3>{day.title}</h3>
                    <p>{day.text}</p>
                  </li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="inc">
              <div className="tour-detail__split">
                <div>
                  <h3>Включено</h3>
                  <ul>
                    {tour.included.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Не включено</h3>
                  <ul>
                    {tour.excluded.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="tour-detail__note">
                Встреча: {tour.meetingPoint}. {tour.cancellation}.
              </p>
            </TabsContent>
            <TabsContent value="rev">
              <div className="tour-detail__reviews">
                {reviews.length === 0 ? (
                  <p>Отзывов пока нет — тур новый или только с этой площадки.</p>
                ) : (
                  reviews.map((review) => {
                    const author = userById(review.userId);
                    return (
                      <article key={review.id}>
                        <header>
                          <strong>{author?.name ?? "Гость"}</strong>
                          <span>
                            {review.rating.toFixed(1)} · {review.date}
                          </span>
                        </header>
                        <h3>{review.title}</h3>
                        <p>{review.text}</p>
                      </article>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="tour-detail__aside">
          <p className="tour-detail__price">{money(tour.price)}</p>
          <p className="tour-detail__per">за человека</p>
          <p className="tour-detail__dates">{formatRange(tour.startDate, tour.endDate)}</p>
          <p className="tour-detail__seats">
            {left > 0 ? `Свободно ${left} из ${tour.seats}` : "Набор закрыт"}
          </p>
          {organizer ? (
            <Link href={`/guides/${organizer.id}/`} className="tour-detail__host">
              <Avatar>
                {organizer.avatar ? <AvatarImage src={organizer.avatar} alt="" /> : null}
                <AvatarFallback>{initials(organizer.name)}</AvatarFallback>
              </Avatar>
              <span>
                <strong>{organizer.name}</strong>
                <em>
                  {organizer.city} · {organizer.rating.toFixed(1)}
                </em>
              </span>
            </Link>
          ) : null}
          {mine ? (
            <Button asChild variant="cta" size="lg">
              <Link href={chat ? `/messages/?c=${chat.id}` : "/messages/"}>Написать гиду</Link>
            </Button>
          ) : (
            <Button asChild variant="cta" size="lg" disabled={left === 0}>
              <Link href={bookPath(tour)}>Оплатить и записаться</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/tours/">Другие туры</Link>
          </Button>
        </aside>
      </Wrapper>
    </article>
  );
}
