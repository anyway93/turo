"use client";
import "./header.scss";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
} from "@/components/ui";
import { Wrapper } from "@/components/layout/wrapper";
import { LangSwitch } from "@/components/layout/lang-switch";
import { initials } from "@/data";
import { cx } from "@/lib/cx";
import { useLocale } from "@/lib/locale";
import { useTuro } from "@/lib/turo-store";

export function Header() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, ready } = useTuro();
  const { t } = useLocale();
  const router = useRouter();

  const links = [
    { href: "/tours/", label: t("header.tours") },
    { href: "/create/", label: t("header.create") },
    { href: "/#how", label: t("header.how") },
  ];

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
        <nav className="site-header__nav" aria-label={t("header.menu")}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <LangSwitch />
          {ready && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="site-header__user">
                <Avatar>
                  {user.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push("/account/")}>
                  {t("header.account")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/account/bookings/")}>
                  {t("header.bookings")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/messages/")}>
                  {t("header.messages")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/create/")}>
                  {t("header.publish")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => logout()}>{t("header.logout")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm" className="site-header__login">
              <Link href="/login/">{t("header.login")}</Link>
            </Button>
          )}
          <IconButton
            label={open ? t("header.closeMenu") : t("header.openMenu")}
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
        <Link href={user ? "/account/" : "/login/"} onClick={() => setOpen(false)}>
          {user ? t("header.account") : t("header.login")}
        </Link>
      </div>
    </header>
  );
}
