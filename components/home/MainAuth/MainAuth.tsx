"use client";
import "./MainAuth.scss";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useLocale } from "@/lib/locale";
import { useTuro } from "@/lib/turo-store";

export function MainAuth() {
  const { t } = useLocale();
  const { user, ready } = useTuro();
  const role = ready ? (user?.role ?? null) : null;

  if (role === "traveler") {
    return (
      <section className="main-auth" id="auth">
        <div>
          <h2 className="main-auth__title">{t("home.laneTravelerTitle")}</h2>
          <p className="main-auth__text">{t("home.laneTravelerText")}</p>
        </div>
        <div className="main-auth__actions">
          <Button asChild variant="cta" size="lg">
            <Link href="/account/bookings/">{t("home.laneTravelerGo")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/tours/">{t("home.toursAll")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (role === "organizer") {
    return (
      <section className="main-auth" id="auth">
        <div>
          <h2 className="main-auth__title">{t("home.laneOrganizerTitle")}</h2>
          <p className="main-auth__text">{t("home.laneOrganizerText")}</p>
        </div>
        <div className="main-auth__actions">
          <Button asChild variant="cta" size="lg">
            <Link href="/create/">{t("account.newTour")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/account/tours/">{t("home.laneOrganizerGo")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (role === "admin") {
    return (
      <section className="main-auth" id="auth">
        <div>
          <h2 className="main-auth__title">{t("home.laneAdminTitle")}</h2>
          <p className="main-auth__text">{t("home.laneAdminText")}</p>
        </div>
        <div className="main-auth__actions">
          <Button asChild variant="cta" size="lg">
            <Link href="/account/users/">{t("home.laneAdminGo")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/account/tours/">{t("home.adminToursAll")}</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="main-auth" id="auth">
      <div>
        <h2 className="main-auth__title">{t("home.authTitle")}</h2>
        <p className="main-auth__text">{t("home.authText")}</p>
      </div>
      <div className="main-auth__actions">
        <Button asChild variant="cta" size="lg">
          <Link href="/register/?role=traveler">{t("home.asTraveler")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/register/?role=organizer">{t("home.asOrganizer")}</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/login/">{t("home.authHave")}</Link>
        </Button>
      </div>
    </section>
  );
}
