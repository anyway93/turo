"use client";
import "./footer.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrapper } from "@/components/layout/wrapper";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/messages")) return null;

  return (
    <footer className="site-footer">
      <Wrapper>
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <p className="site-footer__logo">Turo</p>
          <p className="site-footer__lead">
            Маршруты от гидов и путешественников. Вы выбираете. Или придумываете
            сами.
          </p>
        </div>
        <div>
          <p className="site-footer__label">Платформа</p>
          <Link href="/tours/">Каталог туров</Link>
          <Link href="/create/">Создать тур</Link>
          <Link href="/#how">Как это работает</Link>
        </div>
        <div>
          <p className="site-footer__label">Аккаунт</p>
          <Link href="/login/">Войти</Link>
          <Link href="/register/">Регистрация</Link>
          <Link href="/account/bookings/">Мои брони</Link>
        </div>
        <div>
          <p className="site-footer__label">Документы</p>
          <Link href="/terms/">Пользовательское соглашение</Link>
          <a className="is-copy" href="mailto:hello@turo.travel">hello@turo.travel</a>
          <p>Пн–Вс, 10:00–21:00</p>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Turo</span>
      </div>
      </Wrapper>
    </footer>
  );
}
