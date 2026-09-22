"use client";
import "./messages-app.scss";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Textarea,
} from "@/components/ui";
import { initials, tourPath } from "@/data";
import { useTuro } from "@/lib/turo-store";
import { cx } from "@/lib/cx";
import { useLocale } from "@/lib/locale";

export function MessagesApp() {
  const { user, ready, conversations, messages, tours, userById, sendMessage } = useTuro();
  const { t, tx, line } = useLocale();
  const search = useSearchParams();
  const router = useRouter();
  const activeId = search.get("c");
  const [draft, setDraft] = useState("");

  const mine = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return conversations;
    return conversations.filter(
      (item) => item.travelerId === user.id || item.organizerId === user.id,
    );
  }, [conversations, user]);

  const isOrganizerView = !!user && (user.role === "organizer" || user.role === "admin");

  const groups = useMemo(() => {
    if (!user || !isOrganizerView) return [];
    const hostChats =
      user.role === "admin" ? mine : mine.filter((item) => item.organizerId === user.id);
    const map = new Map<string, typeof hostChats>();
    for (const chat of hostChats) {
      const list = map.get(chat.tourSlug) ?? [];
      list.push(chat);
      map.set(chat.tourSlug, list);
    }
    return [...map.entries()].map(([tourSlug, chats]) => ({
      tour: tours.find((item) => item.slug === tourSlug),
      chats,
    }));
  }, [isOrganizerView, mine, tours, user]);

  const travelerChats = useMemo(() => {
    if (!user || user.role === "admin") return [];
    return mine.filter((item) => item.travelerId === user.id);
  }, [mine, user]);

  const active = mine.find((item) => item.id === activeId) ?? null;
  const thread = useMemo(
    () =>
      messages
        .filter((item) => item.conversationId === active?.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [active?.id, messages],
  );

  if (!ready) return <div className="messages-app">{t("messages.loading")}</div>;

  if (!user) {
    return (
      <div className="messages-app messages-app_gate">
        <h1>{t("messages.gateTitle")}</h1>
        <p>{t("messages.gateText")}</p>
        <Button asChild variant="cta">
          <Link href="/login/?next=/messages/">{t("messages.login")}</Link>
        </Button>
      </div>
    );
  }

  const peerId = active
    ? user.role === "admin"
      ? active.travelerId
      : active.travelerId === user.id
        ? active.organizerId
        : active.travelerId
    : null;
  const peer = peerId ? userById(peerId) : undefined;
  const hostName =
    user.role === "admin" && active ? userById(active.organizerId)?.name : undefined;
  const activeTour = active ? tours.find((item) => item.slug === active.tourSlug) : undefined;

  function open(id: string) {
    router.replace(`/messages/?c=${id}`, { scroll: false });
  }

  function send() {
    if (!active || !draft.trim()) return;
    sendMessage(active.id, draft);
    setDraft("");
  }

  return (
    <div className="messages-app">
      <aside className="messages-app__list">
        <h1>{t("messages.title")}</h1>
        {isOrganizerView && groups.length > 0 ? (
          <div className="messages-app__groups">
            <p className="messages-app__label">{t("messages.byTours")}</p>
            {groups.map(({ tour, chats }) => (
              <section key={tour?.slug ?? chats[0]?.id}>
                <h2>{tour ? tx(tour.title) : t("messages.tour")}</h2>
                {chats.map((chat) => {
                  const guest = userById(chat.travelerId);
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      className={cx(active?.id === chat.id && "is-on")}
                      onClick={() => open(chat.id)}
                    >
                      <span>{guest?.name ?? t("messages.guest")}</span>
                      <em>{t("messages.one")}</em>
                    </button>
                  );
                })}
              </section>
            ))}
          </div>
        ) : null}

        {travelerChats.length > 0 ? (
          <div className="messages-app__groups">
            {isOrganizerView ? <p className="messages-app__label">{t("messages.myTrips")}</p> : null}
            {travelerChats.map((chat) => {
              const host = userById(chat.organizerId);
              const tour = tours.find((item) => item.slug === chat.tourSlug);
              return (
                <button
                  key={chat.id}
                  type="button"
                  className={cx("messages-app__row", active?.id === chat.id && "is-on")}
                  onClick={() => open(chat.id)}
                >
                  <span>{host?.name ?? t("messages.guide")}</span>
                  <em>{tour ? tx(tour.title) : ""}</em>
                </button>
              );
            })}
          </div>
        ) : null}

        {mine.length === 0 ? (
          <p className="messages-app__empty">
            {user.role === "admin"
              ? t("messages.emptyAdmin")
              : user.role === "organizer"
                ? t("messages.emptyHost")
                : t("messages.empty")}
          </p>
        ) : null}
      </aside>

      <section className="messages-app__thread">
        {!active ? (
          <div className="messages-app__placeholder">
            {t("messages.pick")}
          </div>
        ) : (
          <>
            <header>
              <Avatar>
                {peer?.avatar ? <AvatarImage src={peer.avatar} alt="" /> : null}
                <AvatarFallback>{initials(peer?.name ?? "?")}</AvatarFallback>
              </Avatar>
              <div>
                <strong>{peer?.name}</strong>
                {hostName ? <span>{t("messages.withHost", { name: hostName })}</span> : null}
                {activeTour ? (
                  <Link href={tourPath(activeTour)}>{tx(activeTour.title)}</Link>
                ) : (
                  <span>{t("messages.tour")}</span>
                )}
              </div>
            </header>
            <div className="messages-app__log">
              {thread.map((item) => (
                <p
                  key={item.id}
                  className={cx(
                    "messages-app__bubble",
                    item.senderId === user.id && "is-mine",
                  )}
                >
                  {line(item.text)}
                </p>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <Textarea
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t("messages.ph")}
              />
              <Button type="submit" variant="cta">
                {t("messages.send")}
              </Button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
