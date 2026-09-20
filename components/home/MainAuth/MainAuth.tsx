"use client";
import "./MainAuth.scss";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useLocale } from "@/lib/locale";

export function MainAuth() {
  const { t } = useLocale();
  return (
    <section className="main-auth" id="auth">
      <div>
        <h2 className="main-auth__title">{t("home.authTitle")}</h2>
        <p className="main-auth__text">{t("home.authText")}</p>
      </div>
      <div className="main-auth__actions">
        <Button asChild variant="cta" size="lg">
          <Link href="/register/">{t("home.authCreate")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login/">{t("home.authHave")}</Link>
        </Button>
      </div>
    </section>
  );
}
