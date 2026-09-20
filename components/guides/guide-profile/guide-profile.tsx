"use client";
import "./guide-profile.scss";

import { Wrapper } from "@/components/layout/wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { initials } from "@/data";
import { TourCard } from "@/components/tours/tour-card";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";

export function GuideProfile({ id }: { id: string }) {
  const { userById, tours } = useTuro();
  const { t, tx } = useLocale();
  const guide = userById(id);
  const hosted = tours.filter((item) => item.organizerId === id);

  if (!guide) {
    return (
      <Wrapper className="guide-profile">
        <h1>{t("guide.missing")}</h1>
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
            {tx(guide.city)}, {tx(guide.country)}
            {guide.yearsGuiding ? ` · ${t("guide.years", { n: guide.yearsGuiding })}` : ""}
          </p>
          <h1>{guide.name}</h1>
          <p>{tx(guide.bio)}</p>
          <p className="guide-profile__meta">
            {guide.languages.map((lang) => tx(lang)).join(" · ")} · {guide.rating.toFixed(1)} · {t("guide.reviews", { n: guide.reviewsCount })}
          </p>
        </div>
      </header>
      <h2>{t("guide.routes")}</h2>
      <div className="guide-profile__grid">
        {hosted.map((tour, index) => (
          <TourCard key={tour.slug} tour={tour} index={index} />
        ))}
      </div>
    </Wrapper>
  );
}
