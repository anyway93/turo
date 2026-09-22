"use client";
import "./auth-screen.scss";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Wrapper } from "@/components/layout/wrapper";
import {
  Button,
  Field,
  FieldLabel,
  Input,
} from "@/components/ui";
import { demoAccounts } from "@/data";
import { cx } from "@/lib/cx";
import { useTuro } from "@/lib/turo-store";
import { useLocale } from "@/lib/locale";
import type { UserRole } from "@/data";

function nextPath(search: ReturnType<typeof useSearchParams>) {
  const raw = search.get("next");
  if (!raw || !raw.startsWith("/")) return "/account/";
  return raw;
}

export function LoginScreen() {
  const { login, ready } = useTuro();
  const { t } = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("anna@turo.travel");
  const [password, setPassword] = useState("turo123");

  function submit() {
    const result = login(email, password);
    if (!result.ok) {
      toast.error(t(result.error ?? "error.badCredentials"));
      return;
    }
    toast.success(t("auth.in"));
    router.push(nextPath(search));
  }

  return (
    <Wrapper className="auth-screen">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <h1>{t("auth.loginTitle")}</h1>
        <p>{t("auth.loginLead")}</p>
        <Field>
          <FieldLabel>{t("auth.email")}</FieldLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>{t("auth.password")}</FieldLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Button type="submit" variant="cta" size="lg" disabled={!ready}>
          {t("auth.loginTitle")}
        </Button>
        <p className="auth-screen__alt">
          {t("auth.noProfile")} <Link href={`/register/${search.toString() ? `?${search.toString()}` : ""}`}>{t("auth.register")}</Link>
        </p>
      </form>
      <aside>
        <p className="auth-screen__kicker">{t("auth.quick")}</p>
        {demoAccounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => {
              setEmail(account.email);
              setPassword(account.password);
              const result = login(account.email, account.password);
              if (result.ok) {
                toast.success(t(`auth.${account.key}`));
                router.push(nextPath(search));
              }
            }}
          >
            <strong>{t(`auth.${account.key}`)}</strong>
            <span>{t(`auth.${account.key}Hint`)}</span>
          </button>
        ))}
      </aside>
    </Wrapper>
  );
}

export function RegisterScreen() {
  const { register, ready } = useTuro();
  const { t } = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const asked = search.get("role");
  const [role, setRole] = useState<Exclude<UserRole, "admin">>(
    asked === "organizer" ? "organizer" : "traveler",
  );

  function submit() {
    const result = register({ name, email, password, city, role });
    if (!result.ok) {
      toast.error(t(result.error ?? "error.emailTaken"));
      return;
    }
    toast.success(t("auth.created"));
    router.push(nextPath(search));
  }

  return (
    <Wrapper className="auth-screen">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <h1>{t("auth.registerTitle")}</h1>
        <p>{t("auth.registerLead")}</p>
        <div className="auth-screen__roles" role="radiogroup" aria-label={t("auth.rolePick")}>
          <button
            type="button"
            className={cx(role === "traveler" && "is-on")}
            aria-checked={role === "traveler"}
            role="radio"
            onClick={() => setRole("traveler")}
          >
            <strong>{t("auth.asTraveler")}</strong>
            <span>{t("auth.asTravelerHint")}</span>
          </button>
          <button
            type="button"
            className={cx(role === "organizer" && "is-on")}
            aria-checked={role === "organizer"}
            role="radio"
            onClick={() => setRole("organizer")}
          >
            <strong>{t("auth.asOrganizer")}</strong>
            <span>{t("auth.asOrganizerHint")}</span>
          </button>
        </div>
        <Field>
          <FieldLabel>{t("auth.name")}</FieldLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>{t("auth.city")}</FieldLabel>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel>{t("auth.email")}</FieldLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>{t("auth.password")}</FieldLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <p className="auth-screen__legal">
          {t("auth.legal")} <Link href="/terms/">{t("auth.terms")}</Link>.
        </p>
        <Button type="submit" variant="cta" size="lg" disabled={!ready}>
          {t("auth.createProfile")}
        </Button>
        <p className="auth-screen__alt">
          {t("auth.have")} <Link href={`/login/${search.toString() ? `?${search.toString()}` : ""}`}>{t("auth.loginTitle")}</Link>
        </p>
      </form>
    </Wrapper>
  );
}
