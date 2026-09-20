"use client";
import "./MainAbout.scss";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { MediaCard, MediaCardGroup } from "@/components/widgets/media-card";
import { paths } from "@/components/home/content";
import { useLocale } from "@/lib/locale";

export function MainAbout() {
  const { t } = useLocale();
  return (
    <section className="main-about" id="tours">
      <header className="main-about__head">
        <Eyebrow>{t("home.aboutKicker")}</Eyebrow>
        <h2 className="main-about__title">{t("home.aboutTitle")}</h2>
        <p className="main-about__text">{t("home.aboutText")}</p>
      </header>
      <MediaCardGroup>
        {paths.map((path) => (
          <MediaCard
            key={path.index}
            href={path.href}
            image={path.image}
            index={path.index}
            id={"id" in path ? path.id : undefined}
            accent={"accent" in path ? path.accent : undefined}
            kicker={t(path.index === "01" ? "path.travelKicker" : "path.guideKicker")}
            title={t(path.index === "01" ? "path.travelTitle" : "path.guideTitle")}
            text={t(path.index === "01" ? "path.travelText" : "path.guideText")}
            action={t(path.index === "01" ? "path.travelAction" : "path.guideAction")}
          />
        ))}
      </MediaCardGroup>
    </section>
  );
}
