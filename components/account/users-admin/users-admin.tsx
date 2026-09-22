"use client";
import "../account-home/account-home.scss";
import "./users-admin.scss";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { AccountNav } from "@/components/account/account-home/account-home";
import { Wrapper } from "@/components/layout/wrapper";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Field,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { initials } from "@/data";
import type { User, UserRole } from "@/data";
import { canModerate } from "@/lib/access";
import { useLocale } from "@/lib/locale";
import { useTuro } from "@/lib/turo-store";

const roles: UserRole[] = ["traveler", "organizer", "admin"];

function UserCard({
  person,
  self,
}: {
  person: User;
  self: boolean;
}) {
  const { updateUser, deleteUser } = useTuro();
  const { t } = useLocale();
  const [name, setName] = useState(person.name);
  const [city, setCity] = useState(person.city);
  const [bio, setBio] = useState(person.bio);
  const [role, setRole] = useState<UserRole>(person.role);
  const [confirm, setConfirm] = useState(false);

  function save() {
    const result = updateUser(person.id, { name, city, bio, role: self ? person.role : role });
    if (!result.ok) {
      toast.error(t(result.error ?? "error.forbidden"));
      return;
    }
    toast.success(t("account.saved"));
  }

  function remove() {
    const result = deleteUser(person.id);
    if (!result.ok) {
      toast.error(t(result.error ?? "error.forbidden"));
      return;
    }
    toast.success(t("account.removed"));
  }

  return (
    <form
      className="users-admin__card"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <header>
        <Avatar>
          {person.avatar ? <AvatarImage src={person.avatar} alt="" /> : null}
          <AvatarFallback>{initials(person.name)}</AvatarFallback>
        </Avatar>
        <div>
          <strong>{person.name}</strong>
          <span>{person.email}</span>
          {self ? <em>{t("account.you")}</em> : null}
        </div>
      </header>
      <Field>
        <FieldLabel>{t("auth.name")}</FieldLabel>
        <Input value={name} onChange={(event) => setName(event.target.value)} required />
      </Field>
      <Field>
        <FieldLabel>{t("auth.city")}</FieldLabel>
        <Input value={city} onChange={(event) => setCity(event.target.value)} />
      </Field>
      <Field>
        <FieldLabel>{t("account.bio")}</FieldLabel>
        <Textarea value={bio} rows={3} onChange={(event) => setBio(event.target.value)} />
      </Field>
      <Field>
        <FieldLabel>{t("account.roleLabel")}</FieldLabel>
        {self ? (
          <p className="users-admin__locked">{t(`role.${person.role}`)}. {t("account.roleLocked")}</p>
        ) : (
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((item) => (
                <SelectItem key={item} value={item}>
                  {t(`role.${item}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>
      <div className="users-admin__bar">
        <Button type="submit" variant="cta" size="sm">
          {t("account.save")}
        </Button>
        {self ? null : confirm ? (
          <>
            <Button type="button" variant="destructive" size="sm" onClick={remove}>
              {t("account.confirmRemove")}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setConfirm(false)}>
              {t("account.cancel")}
            </Button>
          </>
        ) : (
          <Button type="button" variant="destructive" size="sm" onClick={() => setConfirm(true)}>
            {t("account.remove")}
          </Button>
        )}
      </div>
    </form>
  );
}

export function UsersAdmin() {
  const { user, ready, users } = useTuro();
  const { t } = useLocale();
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [query, setQuery] = useState("");

  if (!ready) return <Wrapper className="account-home">{t("account.loading")}</Wrapper>;
  if (!user) {
    return (
      <Wrapper className="account-home">
        <Button asChild>
          <Link href="/login/?next=/account/users/">{t("account.login")}</Link>
        </Button>
      </Wrapper>
    );
  }
  if (!canModerate(user.role)) {
    return (
      <Wrapper className="account-home">
        <AccountNav />
        <h1>{t("account.denied")}</h1>
        <p>{t("account.deniedText")}</p>
      </Wrapper>
    );
  }

  const needle = query.trim().toLowerCase();
  const ordered = [...users]
    .filter((person) => (roleFilter === "all" ? true : person.role === roleFilter))
    .filter((person) => {
      if (!needle) return true;
      return `${person.name} ${person.email} ${person.city}`.toLowerCase().includes(needle);
    })
    .sort((a, b) => {
      const rank = (role: UserRole) => (role === "admin" ? 0 : role === "organizer" ? 1 : 2);
      return rank(a.role) - rank(b.role) || a.name.localeCompare(b.name, "ru");
    });

  return (
    <Wrapper className="account-home">
      <AccountNav />
      <h1>{t("account.users")}</h1>
      <p className="users-admin__lead">{t("home.adminText")}</p>
      <div className="users-admin__tools">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("account.findUser")}
          aria-label={t("account.findUser")}
        />
        <div className="users-admin__filters" role="radiogroup" aria-label={t("account.roleLabel")}>
          {(["all", ...roles] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={roleFilter === item}
              className={roleFilter === item ? "is-on" : undefined}
              onClick={() => setRoleFilter(item)}
            >
              {item === "all" ? t("account.filterAll") : t(`role.${item}`)}
            </button>
          ))}
        </div>
      </div>
      {ordered.length === 0 ? (
        <p className="users-admin__lead">{t("account.usersEmpty")}</p>
      ) : (
        <div className="users-admin">
          {ordered.map((person) => (
            <UserCard key={person.id} person={person} self={person.id === user.id} />
          ))}
        </div>
      )}
    </Wrapper>
  );
}
