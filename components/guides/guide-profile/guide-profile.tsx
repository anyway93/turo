"use client";
import "./guide-profile.scss";

import { Wrapper } from "@/components/layout/wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { initials } from "@/data";
import { TourCard } from "@/components/tours/tour-card";
import { useTuro } from "@/lib/turo-store";

export function GuideProfile({ id }: { id: string }) {
  const { userById, tours } = useTuro();
  const guide = userById(id);
  const hosted = tours.filter((item) => item.organizerId === id);

  if (!guide) {
    return (
      <Wrapper className="guide-profile">
        <h1>Гид не найден</h1>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="guide-profile">
      <header>
        <Avatar size="lg">
          {guide.avatar ? <AvatarImage src={guide.avatar} alt="" /> : null}
          <AvatarFallback>{initials(guide.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p>
            {guide.city}, {guide.country}
            {guide.yearsGuiding ? ` · ${guide.yearsGuiding} лет с группами` : ""}
          </p>
          <h1>{guide.name}</h1>
          <p>{guide.bio}</p>
          <p className="guide-profile__meta">
            {guide.languages.join(" · ")} · {guide.rating.toFixed(1)} · {guide.reviewsCount} отзывов
          </p>
        </div>
      </header>
      <h2>Маршруты</h2>
      <div className="guide-profile__grid">
        {hosted.map((tour, index) => (
          <TourCard key={tour.slug} tour={tour} index={index} />
        ))}
      </div>
    </Wrapper>
  );
}
