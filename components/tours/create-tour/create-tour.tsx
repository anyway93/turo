"use client";
import "./create-tour.scss";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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

export function CreateTourForm() {
  const { user, createTour, ready } = useTuro();
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
  const [plan, setPlan] = useState("День 1: встреча\nДень 2: основной трек\nДень 3: свободный ритм");

  const slug = useMemo(
    () =>
      title
        .toLowerCase()
        .replace(/[^a-zа-я0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48) || "my-tour",
    [title],
  );

  if (!ready) return <Wrapper className="create-tour">Загрузка…</Wrapper>;

  if (!user) {
    return (
      <Wrapper className="create-tour">
        <h1>Нужен вход</h1>
        <p>Опубликовать маршрут можно после входа. С того же аккаунта можно и покупать чужие туры.</p>
        <Button asChild variant="cta">
          <Link href="/register/?next=/create/">Создать аккаунт</Link>
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
      toast.error(result.error);
      return;
    }
    toast.success("Тур опубликован");
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
        <h1>Разместить тур</h1>
        <p className="create-tour__lead">
          Коротко: куда, когда, сколько стоит, сколько мест. После публикации люди смогут оплатить и
          написать вам в чат — по этому маршруту отдельно.
        </p>
        <Field>
          <FieldLabel>Название</FieldLabel>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>Коротко о маршруте</FieldLabel>
          <Textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} rows={3} />
        </Field>
        <div className="create-tour__grid">
          <Field>
            <FieldLabel>Город</FieldLabel>
            <Input value={city} onChange={(event) => setCity(event.target.value)} required />
          </Field>
          <Field>
            <FieldLabel>Страна</FieldLabel>
            <Input value={country} onChange={(event) => setCountry(event.target.value)} required />
          </Field>
        </div>
        <div className="create-tour__grid">
          <Field>
            <FieldLabel>Регион</FieldLabel>
            <Select value={continent} onValueChange={(value) => setContinent(value as Continent)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {continents.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Формат</FieldLabel>
            <Select value={style} onValueChange={(value) => setStyle(value as TourStyle)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tourStyles.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Сложность</FieldLabel>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="лёгкий">лёгкий</SelectItem>
                <SelectItem value="средний">средний</SelectItem>
                <SelectItem value="сложный">сложный</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="create-tour__grid">
          <Field>
            <FieldLabel>Дней</FieldLabel>
            <Input type="number" min={2} max={21} value={days} onChange={(e) => setDays(Number(e.target.value))} />
          </Field>
          <Field>
            <FieldLabel>Цена, ₽</FieldLabel>
            <Input type="number" min={1000} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </Field>
          <Field>
            <FieldLabel>Мест</FieldLabel>
            <Input type="number" min={2} max={20} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
          </Field>
          <Field>
            <FieldLabel>Старт</FieldLabel>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
        </div>
        <Field>
          <FieldLabel>Программа по дням (каждый день с новой строки)</FieldLabel>
          <Textarea rows={6} value={plan} onChange={(event) => setPlan(event.target.value)} />
        </Field>
        <fieldset className="create-tour__covers">
          <legend>Обложка</legend>
          <div>
            {coverPool.slice(0, 12).map((src) => (
              <button
                key={src}
                type="button"
                className={cover === src ? "is-on" : undefined}
                onClick={() => setCover(src)}
                style={{ backgroundImage: `url(${src})` }}
                aria-label="Выбрать фото"
              />
            ))}
          </div>
        </fieldset>
        <Button type="submit" variant="cta" size="lg">
          Опубликовать
        </Button>
      </form>
    </Wrapper>
  );
}
