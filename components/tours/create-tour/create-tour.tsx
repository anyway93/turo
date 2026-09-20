"use client";
import "./create-tour.scss";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Wrapper } from "@/components/layout/wrapper";
import {
  Button,
  Field,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { continents, tourPath, tourStyles } from "@/data";
import { coverPool } from "@/data/media/photos";
import type { Continent, Difficulty, TourStyle } from "@/data";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";

export function CreateTourForm() {
  const { user, createTour, ready } = useTuro();
  const { t } = useLocale();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState<Continent>("Европа");
  const [style, setStyle] = useState<TourStyle>("природа");
  const [difficulty, setDifficulty] = useState<Difficulty>("лёгкий");
  const [days, setDays] = useState(7);
  const [price, setPrice] = useState(59000);
  const [seats, setSeats] = useState(8);
  const [start, setStart] = useState("2026-08-01");
  const [cover, setCover] = useState(coverPool[0]);
  const [plan, setPlan] = useState("");

  const slug = useMemo(
    () =>
      title
        .toLowerCase()
        .replace(/[^a-zа-я0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48) || "my-tour",
    [title],
  );

  useEffect(() => {
    setPlan((current) => current || t("create.defaultPlan"));
  }, [t]);

  if (!ready) return <Wrapper className="create-tour">{t("create.loading")}</Wrapper>;

  if (!user) {
    return (
      <Wrapper className="create-tour">
        <h1>{t("create.needAuth")}</h1>
        <p>{t("create.needAuthText")}</p>
        <Button asChild variant="cta">
          <Link href="/register/?next=/create/">{t("create.createAccount")}</Link>
        </Button>
      </Wrapper>
    );
  }

  function onSubmit() {
    const itinerary = plan
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => ({
        day: index + 1,
        title: line.replace(/^день\s*\d+\s*[:.—-]?\s*/i, "") || `День ${index + 1}`,
        text: "Авторский день: темп и остановки гид уточнит в чате перед выездом.",
      }));
    const end = new Date(start);
    end.setDate(end.getDate() + Math.max(days - 1, 0));
    const result = createTour({
      slug,
      title: title.trim(),
      subtitle: subtitle.trim() || "Авторский маршрут на Turo.",
      country: country.trim() || "—",
      city: city.trim() || "—",
      continent,
      destinationSlug: slug,
      durationDays: days,
      price,
      seats,
      startDate: start,
      endDate: end.toISOString().slice(0, 10),
      difficulty,
      style,
      tags: [style, city.toLowerCase() || "авторский"],
      cover,
      gallery: [cover, coverPool[1], coverPool[2], coverPool[3]],
      included: ["Работа гида", "Программа по дням", "Чат после оплаты"],
      excluded: ["Перелёт", "Страховка", "Личные траты"],
      itinerary:
        itinerary.length > 0
          ? itinerary
          : [{ day: 1, title: "Старт", text: "Встреча и короткий выход." }],
      meetingPoint: "Уточним в чате за 3 дня",
      cancellation: "Бесплатная отмена за 14 дней",
    });
    if (!result.ok || !result.tour) {
      toast.error(t(result.error ?? "error.loginToPublish"));
      return;
    }
    toast.success(t("create.published"));
    router.push(tourPath(result.tour));
  }

  return (
    <Wrapper className="create-tour">
      <form
        className="create-tour__form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <h1>{t("create.title")}</h1>
        <p className="create-tour__lead">{t("create.lead")}</p>
        <Field>
          <FieldLabel>{t("create.name")}</FieldLabel>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>{t("create.about")}</FieldLabel>
          <Textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} rows={3} />
        </Field>
        <div className="create-tour__grid">
          <Field>
            <FieldLabel>{t("create.city")}</FieldLabel>
            <Input value={city} onChange={(event) => setCity(event.target.value)} required />
          </Field>
          <Field>
            <FieldLabel>{t("create.country")}</FieldLabel>
            <Input value={country} onChange={(event) => setCountry(event.target.value)} required />
          </Field>
        </div>
        <div className="create-tour__grid">
          <Field>
            <FieldLabel>{t("create.region")}</FieldLabel>
            <Select value={continent} onValueChange={(value) => setContinent(value as Continent)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {continents.map((item) => (
                  <SelectItem key={item} value={item}>
                    {t(`continent.${item}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>{t("create.style")}</FieldLabel>
            <Select value={style} onValueChange={(value) => setStyle(value as TourStyle)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tourStyles.map((item) => (
                  <SelectItem key={item} value={item}>
                    {t(`style.${item}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>{t("create.difficulty")}</FieldLabel>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="лёгкий">{t("diff.лёгкий")}</SelectItem>
                <SelectItem value="средний">{t("diff.средний")}</SelectItem>
                <SelectItem value="сложный">{t("diff.сложный")}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="create-tour__grid">
          <Field>
            <FieldLabel>{t("create.days")}</FieldLabel>
            <Input type="number" min={2} max={21} value={days} onChange={(e) => setDays(Number(e.target.value))} />
          </Field>
          <Field>
            <FieldLabel>{t("create.price")}</FieldLabel>
            <Input type="number" min={1000} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </Field>
          <Field>
            <FieldLabel>{t("create.seats")}</FieldLabel>
            <Input type="number" min={2} max={20} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
          </Field>
          <Field>
            <FieldLabel>{t("create.start")}</FieldLabel>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
        </div>
        <Field>
          <FieldLabel>{t("create.plan")}</FieldLabel>
          <Textarea rows={6} value={plan} onChange={(event) => setPlan(event.target.value)} />
        </Field>
        <fieldset className="create-tour__covers">
          <legend>{t("create.cover")}</legend>
          <div>
            {coverPool.slice(0, 12).map((src) => (
              <button
                key={src}
                type="button"
                className={cover === src ? "is-on" : undefined}
                onClick={() => setCover(src)}
                style={{ backgroundImage: `url(${src})` }}
                aria-label={t("create.pickPhoto")}
              />
            ))}
          </div>
        </fieldset>
        <Button type="submit" variant="cta" size="lg">
          {t("create.publish")}
        </Button>
      </form>
    </Wrapper>
  );
}
