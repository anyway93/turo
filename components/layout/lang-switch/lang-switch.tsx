"use client";
import "./lang-switch.scss";

import { useLocale } from "@/lib/locale";
import { cx } from "@/lib/cx";

export function LangSwitch() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="lang-switch" role="radiogroup" aria-label={t("header.lang")}>
      <button
        type="button"
        role="radio"
        aria-checked={locale === "ru"}
        className={cx("lang-switch__opt", locale === "ru" && "is-on")}
        onClick={() => setLocale("ru")}
      >
        RU
      </button>
      <i className="lang-switch__sep" aria-hidden />
      <button
        type="button"
        role="radio"
        aria-checked={locale === "en"}
        className={cx("lang-switch__opt", locale === "en" && "is-on")}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
    </div>
  );
}
