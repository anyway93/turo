import "./MainAbout.scss";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { MediaCard, MediaCardGroup } from "@/components/widgets/media-card";
import { paths } from "@/components/home/content";

export function MainAbout() {
  return (
    <section className="main-about" id="tours">
      <header className="main-about__head">
        <Eyebrow>Платформа</Eyebrow>
        <h2 className="main-about__title">Два пути в одну дорогу</h2>
        <p className="main-about__text">
          Можно выбрать готовый маршрут. Можно собрать свой и открыть его для
          других. Без каталожного шума — только место, даты и люди.
        </p>
      </header>
      <MediaCardGroup>
        {paths.map((path) => (
          <MediaCard key={path.index} {...path} />
        ))}
      </MediaCardGroup>
    </section>
  );
}
