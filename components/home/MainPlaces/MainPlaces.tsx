import "./MainPlaces.scss";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { PlaceCard, PlaceCardGroup } from "@/components/widgets/place-card";
import { places } from "@/components/home/content";

export function MainPlaces() {
  return (
    <section className="main-places" id="places">
      <header className="main-places__head">
        <Eyebrow>Направления</Eyebrow>
        <h2 className="main-places__title">Куда уезжают чаще</h2>
        <p className="main-places__text">
          Не реклама стран — живые сборы людей. Карточка ведёт на этот маршрут.
        </p>
      </header>
      <PlaceCardGroup>
        {places.map((place, index) => (
          <PlaceCard
            key={place.name}
            featured={index === 0}
            {...place}
          />
        ))}
      </PlaceCardGroup>
    </section>
  );
}
