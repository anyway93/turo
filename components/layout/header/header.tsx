"use client";
import "./header.scss";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button, IconButton } from "@/components/ui";
import { Wrapper } from "@/components/layout/wrapper";
import { cx } from "@/lib/cx";

const links = [
  { href: "/#tours", label: "Туры" },
  { href: "/#create", label: "Создать тур" },
  { href: "/#how", label: "Как это работает" },
];

export function Header() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    let on = false;

    const apply = () => {
      const y = window.scrollY;
      const next = on ? y > 18 : y > 56;
      if (next !== on) {
        on = next;
        setScrolled(next);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cx(
        "site-header",
        (!overlay || scrolled) && "is-scrolled",
        open && "is-open",
      )}
    >
      <Wrapper className="site-header__inner">
        <Link href="/" className="site-header__logo">
          Turo
        </Link>
        <nav className="site-header__nav" aria-label="Основное меню">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <Button asChild variant="ghost" size="sm" className="site-header__login">
            <Link href="/#auth">Войти</Link>
          </Button>
          <Button asChild size="sm" variant="cta">
            <Link href="/#create">Разместить тур</Link>
          </Button>
          <IconButton
            label={open ? "Закрыть меню" : "Открыть меню"}
            variant="ghost"
            size="icon"
            className="site-header__menu"
            aria-expanded={open}
            aria-controls="site-header-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </IconButton>
        </div>
      </Wrapper>
      <div
        className={cx("site-header__mobile", open && "is-open")}
        id="site-header-mobile"
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="/#auth" onClick={() => setOpen(false)}>
          Войти
        </Link>
        <Button asChild variant="cta" size="sm">
          <Link href="/#create" onClick={() => setOpen(false)}>
            Разместить тур
          </Link>
        </Button>
      </div>
    </header>
  );
}
