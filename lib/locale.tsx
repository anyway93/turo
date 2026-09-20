"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "ru" | "en";

const KEY = "turo-locale";

const dict = {
  ru: {
    header: {
      tours: "Туры",
      create: "Создать тур",
      how: "Как это работает",
      login: "Войти",
      account: "Кабинет",
      bookings: "Мои брони",
      messages: "Сообщения",
      publish: "Разместить тур",
      logout: "Выйти",
      menu: "Основное меню",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
      lang: "Язык",
    },
    footer: {
      lead: "Маршруты от гидов и путешественников. Вы выбираете. Или придумываете сами.",
      platform: "Платформа",
      catalog: "Каталог туров",
      create: "Создать тур",
      how: "Как это работает",
      account: "Аккаунт",
      login: "Войти",
      register: "Регистрация",
      bookings: "Мои брони",
      docs: "Документы",
      terms: "Пользовательское соглашение",
      hours: "Пн–Вс, 10:00–21:00",
    },
  },
  en: {
    header: {
      tours: "Tours",
      create: "Create a tour",
      how: "How it works",
      login: "Sign in",
      account: "Account",
      bookings: "My trips",
      messages: "Messages",
      publish: "List a tour",
      logout: "Log out",
      menu: "Main menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      lang: "Language",
    },
    footer: {
      lead: "Routes from guides and travellers. You choose. Or you invent your own.",
      platform: "Platform",
      catalog: "Tour catalog",
      create: "Create a tour",
      how: "How it works",
      account: "Account",
      login: "Sign in",
      register: "Register",
      bookings: "My trips",
      docs: "Legal",
      terms: "Terms of service",
      hours: "Mon–Sun, 10:00–21:00",
    },
  },
} as const;

function get(source: unknown, path: string): string {
  return path.split(".").reduce<unknown>((node, key) => {
    if (node && typeof node === "object" && key in node) {
      return (node as Record<string, unknown>)[key];
    }
    return "";
  }, source) as string;
}

type LocaleApi = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (path: string) => string;
};

const LocaleContext = createContext<LocaleApi | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "en" || saved === "ru") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleApi>(
    () => ({
      locale,
      setLocale,
      t: (path) => get(dict[locale], path) || get(dict.ru, path),
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
