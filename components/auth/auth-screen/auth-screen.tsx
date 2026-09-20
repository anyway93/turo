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
import { useTuro } from "@/lib/turo-store";

function nextPath(search: ReturnType<typeof useSearchParams>) {
  const raw = search.get("next");
  if (!raw || !raw.startsWith("/")) return "/account/";
  return raw;
}

export function LoginScreen() {
  const { login, ready } = useTuro();
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("anna@turo.travel");
  const [password, setPassword] = useState("turo123");

  function submit() {
    const result = login(email, password);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Вы вошли");
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
        <h1>Войти</h1>
        <p>Демо-пароль у всех готовых аккаунтов: turo123</p>
        <Field>
          <FieldLabel>Почта</FieldLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>Пароль</FieldLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Button type="submit" variant="cta" size="lg" disabled={!ready}>
          Войти
        </Button>
        <p className="auth-screen__alt">
          Нет профиля? <Link href={`/register/${search.toString() ? `?${search.toString()}` : ""}`}>Регистрация</Link>
        </p>
      </form>
      <aside>
        <p className="auth-screen__kicker">Быстрый вход</p>
        {demoAccounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => {
              setEmail(account.email);
              setPassword(account.password);
              const result = login(account.email, account.password);
              if (result.ok) {
                toast.success(account.label);
                router.push(nextPath(search));
              }
            }}
          >
            <strong>{account.label}</strong>
            <span>{account.hint}</span>
          </button>
        ))}
      </aside>
    </Wrapper>
  );
}

export function RegisterScreen() {
  const { register, ready } = useTuro();
  const router = useRouter();
  const search = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");

  function submit() {
    const result = register({ name, email, password, city });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Профиль создан");
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
        <h1>Регистрация</h1>
        <p>Один профиль: можно ездить, можно публиковать свои туры и писать гостям.</p>
        <Field>
          <FieldLabel>Имя</FieldLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>Город</FieldLabel>
          <Input value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel>Почта</FieldLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field>
          <FieldLabel>Пароль</FieldLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <p className="auth-screen__legal">
          Регистрируясь, вы принимаете <Link href="/terms/">пользовательское соглашение</Link>.
        </p>
        <Button type="submit" variant="cta" size="lg" disabled={!ready}>
          Создать профиль
        </Button>
        <p className="auth-screen__alt">
          Уже есть? <Link href={`/login/${search.toString() ? `?${search.toString()}` : ""}`}>Войти</Link>
        </p>
      </form>
    </Wrapper>
  );
}
