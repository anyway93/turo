"use client";
import "./tours-catalog.scss";

import { useMemo, useState } from "react";
import { Wrapper } from "@/components/layout/wrapper";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { continents, tourStyles } from "@/data";
import { TourCard } from "@/components/tours/tour-card";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";
import { PageHero } from "@/components/widgets/page-hero";

export function ToursCatalog({
  destination,
}: {
  destination?: string;
}) {
  const { tours, user } = useTuro();
  const { t, tx } = useLocale();
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("all");
  const [style, setStyle] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [place, setPlace] = useState(destination ?? "all");

  const places = useMemo(() => {
    const unique = new Map<string, string>();
    for (const tour of tours) {
      unique.set(tour.destinationSlug, `${tx(tour.city)}, ${tx(tour.country)}`);
    }
    return [...unique.entries()];
  }, [tours, tx]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((tour) => {
      if (continent !== "all" && tour.continent !== continent) return false;
      if (style !== "all" && tour.style !== style) return false;
      if (difficulty !== "all" && tour.difficulty !== difficulty) return false;
      if (place !== "all" && tour.destinationSlug !== place) return false;
      if (!q) return true;
      const hay = [
        tour.title,
        tour.subtitle,
        tour.city,
        tour.country,
        ...tour.tags,
        tx(tour.title),
        tx(tour.subtitle),
        tx(tour.city),
        tx(tour.country),
        ...tour.tags.map((tag) => tx(tag)),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [continent, difficulty, place, query, style, tours, tx]);

  return (
    <>
    <PageHero
      kicker={t("catalog.kicker")}
      title={t("catalog.title")}
      text={
        user?.role === "admin"
          ? t("catalog.textAdmin")
          : user?.role === "organizer"
            ? t("catalog.textHost")
            : t("catalog.text")
      }
    />
    <Wrapper className="tours-catalog">
      <div className="tours-catalog__filters">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("catalog.search")}
          aria-label={t("catalog.searchAria")}
        />
        <Select value={place} onValueChange={setPlace}>
          <SelectTrigger aria-label={t("catalog.place")}>
            <SelectValue placeholder={t("catalog.placePh")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("catalog.allPlaces")}</SelectItem>
            {places.map(([slug, label]) => (
              <SelectItem key={slug} value={slug}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={continent} onValueChange={setContinent}>
          <SelectTrigger aria-label={t("catalog.continent")}>
            <SelectValue placeholder={t("catalog.continent")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("catalog.allRegions")}</SelectItem>
            {continents.map((item) => (
              <SelectItem key={item} value={item}>
                {t(`continent.${item}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger aria-label={t("catalog.style")}>
            <SelectValue placeholder={t("catalog.style")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("catalog.allStyles")}</SelectItem>
            {tourStyles.map((item) => (
              <SelectItem key={item} value={item}>
                {t(`style.${item}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger aria-label={t("catalog.difficulty")}>
            <SelectValue placeholder={t("catalog.difficulty")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("catalog.allDiff")}</SelectItem>
            <SelectItem value="лёгкий">{t("diff.лёгкий")}</SelectItem>
            <SelectItem value="средний">{t("diff.средний")}</SelectItem>
            <SelectItem value="сложный">{t("diff.сложный")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="tours-catalog__count">{t("catalog.count", { n: filtered.length })}</p>
      {filtered.length === 0 ? (
        <p className="tours-catalog__empty">{t("catalog.empty")}</p>
      ) : (
        <div className="tours-catalog__grid">
          {filtered.map((tour, index) => (
            <TourCard key={tour.slug} tour={tour} index={index} />
          ))}
        </div>
      )}
    </Wrapper>
    </>
  );
}
