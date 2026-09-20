"use client";
import "./footer.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrapper } from "@/components/layout/wrapper";
import { useLocale } from "@/lib/locale";

export function Footer() {
  const pathname = usePathname();
  const { t } = useLocale();
  if (pathname.startsWith("/messages")) return null;

  return (
    <footer className="site-footer">
      <Wrapper>
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <p className="site-footer__logo">Turo</p>
          <p className="site-footer__lead">{t("footer.lead")}</p>
        </div>
        <div>
          <p className="site-footer__label">{t("footer.platform")}</p>
          <Link href="/tours/">{t("footer.catalog")}</Link>
          <Link href="/create/">{t("footer.create")}</Link>
          <Link href="/#how">{t("footer.how")}</Link>
        </div>
        <div>
          <p className="site-footer__label">{t("footer.account")}</p>
          <Link href="/login/">{t("footer.login")}</Link>
          <Link href="/register/">{t("footer.register")}</Link>
          <Link href="/account/bookings/">{t("footer.bookings")}</Link>
        </div>
        <div>
          <p className="site-footer__label">{t("footer.docs")}</p>
          <Link href="/terms/">{t("footer.terms")}</Link>
          <a className="is-copy" href="mailto:hello@turo.travel">hello@turo.travel</a>
          <p>{t("footer.hours")}</p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Turo</span>
      </div>
      </Wrapper>
    </footer>
  );
}
