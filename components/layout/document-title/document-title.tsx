"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/locale";

export function DocumentTitle() {
  const pathname = usePathname();
  const { t } = useLocale();

  useEffect(() => {
    const path = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
    let title = t("meta.home");
    if (path === "/tours") title = t("meta.catalog");
    else if (path.startsWith("/tours/")) title = t("meta.tour");
    else if (path === "/create") title = t("meta.create");
    else if (path === "/login") title = t("meta.login");
    else if (path === "/register") title = t("meta.register");
    else if (path === "/account") title = t("meta.account");
    else if (path === "/account/bookings") title = t("meta.bookings");
    else if (path === "/account/tours") title = t("meta.tours");
    else if (path === "/messages") title = t("meta.messages");
    else if (path === "/terms") title = t("meta.terms");
    else if (path === "/ui") title = t("meta.ui");
    else if (path.startsWith("/guides/")) title = t("meta.guide");
    else if (path === "/book" || path === "/tour") title = t("meta.tour");
    document.title = title;
  }, [pathname, t]);

  return null;
}
