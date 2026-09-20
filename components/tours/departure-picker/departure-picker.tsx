"use client";
import "./departure-picker.scss";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { addDaysIso, parseYmd, todayIso, tripEnd, upcomingWeekdays } from "@/data/dates";
import { useLocale } from "@/lib/locale";
import { cx } from "@/lib/cx";

const WEEK = [1, 2, 3, 4, 5, 6, 0] as const;

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: startPad }, () => null);
  for (let day = 1; day <= days; day += 1) {
    cells.push(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function uniqueSorted(dates: string[]) {
  return [...new Set(dates)].sort();
}

export function DeparturePicker({
  mode,
  durationDays,
  dates,
  value,
  seats = 0,
  taken = {},
  onDatesChange,
  onValueChange,
}: {
  mode: "edit" | "pick";
  durationDays: number;
  dates: string[];
  value?: string;
  seats?: number;
  taken?: Record<string, number>;
  onDatesChange?: (next: string[]) => void;
  onValueChange?: (iso: string) => void;
}) {
  const { t, range, day, monthTitle, locale } = useLocale();
  const min = todayIso();
  const seed = value || dates[0] || min;
  const seedDate = parseYmd(seed);
  const [cursor, setCursor] = useState({
    year: seedDate.getFullYear(),
    month: seedDate.getMonth(),
  });

  const cells = useMemo(
    () => monthCells(cursor.year, cursor.month),
    [cursor.month, cursor.year],
  );

  const selected = useMemo(() => new Set(dates), [dates]);

  const headers = useMemo(() => {
    const tag = locale === "en" ? "en-GB" : "ru-RU";
    return WEEK.map((weekday) =>
      new Date(2026, 5, weekday === 0 ? 7 : weekday).toLocaleDateString(tag, {
        weekday: "short",
      }),
    );
  }, [locale]);

  function shift(delta: number) {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  function toggle(iso: string) {
    if (mode !== "edit" || iso < min) return;
    const next = selected.has(iso) ? dates.filter((item) => item !== iso) : [...dates, iso];
    onDatesChange?.(uniqueSorted(next));
  }

  function pick(iso: string) {
    if (mode !== "pick") return;
    if (!selected.has(iso)) return;
    if (seats > 0 && (taken[iso] ?? 0) >= seats) return;
    onValueChange?.(iso);
  }

  function addWeekday(weekday: number) {
    onDatesChange?.(uniqueSorted([...dates, ...upcomingWeekdays(weekday, 8, min)]));
  }

  function addFortnight() {
    const origin = dates[0] ?? upcomingWeekdays(6, 1, min)[0];
    const extra = Array.from({ length: 6 }, (_, index) => addDaysIso(origin, index * 14));
    onDatesChange?.(uniqueSorted([...dates, ...extra]));
  }

  return (
    <div className={cx("dep-pick", mode === "pick" && "dep-pick_pick")}>
      {mode === "edit" ? (
        <p className="dep-pick__hint">{t("create.datesHint")}</p>
      ) : (
        <p className="dep-pick__hint">{t("tour.pickDate")}</p>
      )}

      <div className="dep-pick__nav">
        <button type="button" className="dep-pick__shift" onClick={() => shift(-1)} aria-label={t("create.datesPrev")}>
          <ChevronLeft />
        </button>
        <p className="dep-pick__month">{monthTitle(cursor.year, cursor.month)}</p>
        <button type="button" className="dep-pick__shift" onClick={() => shift(1)} aria-label={t("create.datesNext")}>
          <ChevronRight />
        </button>
      </div>

      <div className="dep-pick__week" aria-hidden>
        {headers.map((label, index) => (
          <span key={WEEK[index]}>{label}</span>
        ))}
      </div>

      <div className="dep-pick__grid">
        {cells.map((iso, index) => {
          if (!iso) return <span key={`e-${index}`} className="dep-pick__cell dep-pick__cell_empty" />;
          const on = selected.has(iso);
          const isValue = value === iso;
          const past = iso < min;
          const sold = seats > 0 && (taken[iso] ?? 0) >= seats;
          const left = seats > 0 ? Math.max(0, seats - (taken[iso] ?? 0)) : 0;
          const disabled = mode === "edit" ? past : !on || sold;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              className={cx(
                "dep-pick__cell",
                on && "is-on",
                isValue && "is-value",
                past && "is-past",
                sold && on && "is-sold",
              )}
              onClick={() => (mode === "edit" ? toggle(iso) : pick(iso))}
            >
              <span>{Number(iso.slice(8))}</span>
              {mode === "pick" && on && !sold ? <em>{left}</em> : null}
            </button>
          );
        })}
      </div>

      {mode === "edit" ? (
        <div className="dep-pick__rhythm">
          <span>{t("create.rhythm")}</span>
          <button type="button" onClick={() => addWeekday(5)}>
            {t("create.rhythmFri")}
          </button>
          <button type="button" onClick={() => addWeekday(6)}>
            {t("create.rhythmSat")}
          </button>
          <button type="button" onClick={() => addWeekday(0)}>
            {t("create.rhythmSun")}
          </button>
          <button type="button" onClick={addFortnight}>
            {t("create.rhythm14")}
          </button>
          {dates.length > 0 ? (
            <button type="button" className="dep-pick__clear" onClick={() => onDatesChange?.([])}>
              {t("create.datesClear")}
            </button>
          ) : null}
        </div>
      ) : null}

      <ul className="dep-pick__list">
        {dates.length === 0 ? (
          <li className="dep-pick__empty">{t("create.datesEmpty")}</li>
        ) : (
          dates.map((iso) => {
            const sold = seats > 0 && (taken[iso] ?? 0) >= seats;
            const left = seats > 0 ? Math.max(0, seats - (taken[iso] ?? 0)) : 0;
            return (
              <li key={iso}>
                <button
                  type="button"
                  className={cx("dep-pick__chip", value === iso && "is-value", sold && "is-sold")}
                  disabled={mode === "pick" && sold}
                  onClick={() => (mode === "edit" ? toggle(iso) : pick(iso))}
                >
                  <strong>{day(iso)}</strong>
                  <span>{range(iso, tripEnd(iso, durationDays))}</span>
                  {mode === "pick" ? (
                    <em>{sold ? t("tour.seatsClosed") : t("tour.seatsOpen", { n: left })}</em>
                  ) : null}
                </button>
                {mode === "edit" ? (
                  <button
                    type="button"
                    className="dep-pick__x"
                    aria-label={t("create.removeDate")}
                    onClick={() => onDatesChange?.(dates.filter((item) => item !== iso))}
                  >
                    <X />
                  </button>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
