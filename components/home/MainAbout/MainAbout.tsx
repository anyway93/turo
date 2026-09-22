"use client";
import "./MainAbout.scss";
import { Eyebrow } from "@/components/widgets/eyebrow";
import { MediaCard, MediaCardGroup } from "@/components/widgets/media-card";
import { paths } from "@/components/home/content";
import { useLocale } from "@/lib/locale";
import { useTuro } from "@/lib/turo-store";

export function MainAbout() {
  const { t } = useLocale();
  const { user, ready } = useTuro();
  const role = ready ? (user?.role ?? null) : null;

  const title =
    role === "traveler"
      ? t("home.travelerTitle")
      : role === "organizer"
        ? t("home.organizerTitle")
        : role === "admin"
          ? t("home.adminTitle")
          : t("home.aboutTitle");
  const text =
    role === "traveler"
      ? t("home.travelerText")
      : role === "organizer"
        ? t("home.organizerText")
        : role === "admin"
          ? t("home.adminText")
          : t("home.aboutText");

  const cards =
    role === "admin"
      ? [
          {
            href: "/account/tours/",
            image: paths[0].image,
            kicker: t("path.adminToursKicker"),
            title: t("path.adminToursTitle"),
            text: t("path.adminToursText"),
            action: t("path.adminToursAction"),
          },
          {
            href: "/account/users/",
            image: paths[1].image,
            kicker: t("path.adminUsersKicker"),
            title: t("path.adminUsersTitle"),
            text: t("path.adminUsersText"),
            action: t("path.adminUsersAction"),
            accent: true,
          },
        ]
      : [
          ...(!role || role === "traveler"
            ? [
                {
                  href: "/tours/",
                  image: paths[0].image,
                  kicker: t("path.travelKicker"),
                  title: t("path.travelTitle"),
                  text: t("path.travelText"),
                  action: t("path.travelAction"),
                },
              ]
            : []),
          ...(!role || role === "organizer"
            ? [
                {
                  href: "/create/",
                  image: paths[1].image,
                  kicker: t("path.guideKicker"),
                  title: t("path.guideTitle"),
                  text: t("path.guideText"),
                  action: t("path.guideAction"),
                  accent: true,
                  id: "create",
                },
              ]
            : []),
        ];

  return (
    <section className="main-about" id="paths">
      <header className="main-about__head">
        <Eyebrow>{t("home.aboutKicker")}</Eyebrow>
        <h2 className="main-about__title">{title}</h2>
        <p className="main-about__text">{text}</p>
      </header>
      <MediaCardGroup className={cards.length === 1 ? "is-single" : undefined}>
        {cards.map((card, index) => (
          <MediaCard
            key={card.href}
            href={card.href}
            image={card.image}
            index={`0${index + 1}`}
            id={"id" in card ? card.id : undefined}
            accent={"accent" in card ? card.accent : undefined}
            kicker={card.kicker}
            title={card.title}
            text={card.text}
            action={card.action}
          />
        ))}
      </MediaCardGroup>
    </section>
  );
}
