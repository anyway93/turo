"use client";
import "./MainPlaces.scss";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { PlaceCard, PlaceCardGroup } from "@/components/widgets/place-card";
import { places } from "@/components/home/content";
import { useLocale } from "@/lib/locale";
import { useTuro } from "@/lib/turo-store";

export function MainPlaces() {
  const { t, tx } = useLocale();
  const { user, ready } = useTuro();
  const role = ready ? (user?.role ?? null) : null;
  if (role === "organizer" || role === "admin") return null;
  return (
    <section className="main-places" id="places">
      <header className="main-places__head">
        <Eyebrow>{t("home.placesKicker")}</Eyebrow>
        <h2 className="main-places__title">{t("home.placesTitle")}</h2>
        <p className="main-places__text">{t("home.placesText")}</p>
      </header>
      <PlaceCardGroup>
        {places.map((place, index) => (
          <PlaceCard
            key={place.name}
            featured={index === 0}
            href={place.href}
            image={place.image}
            name={tx(place.name)}
          />
        ))}
      </PlaceCardGroup>
    </section>
  );
}
