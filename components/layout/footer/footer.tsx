"use client";
import "./footer.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrapper } from "@/components/layout/wrapper";
import { headerLinks } from "@/lib/access";
import { useLocale } from "@/lib/locale";
import { useTuro } from "@/lib/turo-store";

export function Footer() {
  const pathname = usePathname();
  const { t } = useLocale();
  const { user, ready } = useTuro();
  if (pathname.startsWith("/messages")) return null;

  const role = ready ? (user?.role ?? null) : null;
  const platform = headerLinks(role);

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
          {platform.map((link) => (
            <Link key={link.href} href={link.href}>
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
        <div>
          <p className="site-footer__label">{t("footer.account")}</p>
          {user ? (
            <Link href="/account/">{t("header.account")}</Link>
          ) : (
            <>
              <Link href="/login/">{t("footer.login")}</Link>
              <Link href="/register/">{t("footer.register")}</Link>
            </>
          )}
          {role === "traveler" ? <Link href="/account/bookings/">{t("footer.bookings")}</Link> : null}
          {role === "admin" ? <Link href="/account/bookings/">{t("account.allBookings")}</Link> : null}
          {user ? <Link href="/messages/">{t("header.messages")}</Link> : null}
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
