"use client";
import "./tours-catalog.scss";

import { useMemo, useState } from "react";
import { Wrapper } from "@/components/layout/wrapper";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { continents, tourStyles } from "@/data";
import { TourCard } from "@/components/tours/tour-card";
import { useTuro } from "@/lib/turo-store";

export function ToursCatalog({
  destination,
}: {
  destination?: string;
}) {
  const { tours } = useTuro();
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("all");
  const [style, setStyle] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [place, setPlace] = useState(destination ?? "all");

  const places = useMemo(() => {
    const unique = new Map<string, string>();
    for (const tour of tours) {
      unique.set(tour.destinationSlug, `${tour.city}, ${tour.country}`);
    }
    return [...unique.entries()];
  }, [tours]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((tour) => {
      if (continent !== "all" && tour.continent !== continent) return false;
      if (style !== "all" && tour.style !== style) return false;
      if (difficulty !== "all" && tour.difficulty !== difficulty) return false;
      if (place !== "all" && tour.destinationSlug !== place) return false;
      if (!q) return true;
      return [tour.title, tour.subtitle, tour.city, tour.country, ...tour.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [continent, difficulty, place, query, style, tours]);

  return (
    <Wrapper className="tours-catalog">
      <div className="tours-catalog__filters">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск: Киото, фьорды, еда…"
          aria-label="Поиск туров"
        />
        <Select value={place} onValueChange={setPlace}>
          <SelectTrigger aria-label="Направление">
            <SelectValue placeholder="Куда" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все направления</SelectItem>
            {places.map(([slug, label]) => (
              <SelectItem key={slug} value={slug}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={continent} onValueChange={setContinent}>
          <SelectTrigger aria-label="Континент">
            <SelectValue placeholder="Континент" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все регионы</SelectItem>
            {continents.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={style} onValueChange={setStyle}>
          <SelectTrigger aria-label="Формат">
            <SelectValue placeholder="Формат" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Любой формат</SelectItem>
            {tourStyles.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger aria-label="Сложность">
            <SelectValue placeholder="Сложность" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Любая сложность</SelectItem>
            <SelectItem value="лёгкий">лёгкий</SelectItem>
            <SelectItem value="средний">средний</SelectItem>
            <SelectItem value="сложный">сложный</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="tours-catalog__count">{filtered.length} туров</p>
      {filtered.length === 0 ? (
        <p className="tours-catalog__empty">Ничего не нашли. Снимите фильтр или измените запрос.</p>
      ) : (
        <div className="tours-catalog__grid">
          {filtered.map((tour, index) => (
            <TourCard key={tour.slug} tour={tour} index={index} />
          ))}
        </div>
      )}
    </Wrapper>
  );
}
