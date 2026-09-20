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

export function MessagesApp() {
  const { user, ready, conversations, messages, tours, userById, sendMessage } = useTuro();
  const search = useSearchParams();
  const router = useRouter();
  const activeId = search.get("c");
  const [draft, setDraft] = useState("");

  const mine = useMemo(() => {
    if (!user) return [];
    return conversations.filter(
      (item) => item.travelerId === user.id || item.organizerId === user.id,
    );
  }, [conversations, user]);

  const isOrganizerView = !!user && mine.some((item) => item.organizerId === user.id);

  const groups = useMemo(() => {
    if (!user) return [];
    const hostChats = mine.filter((item) => item.organizerId === user.id);
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
  }, [mine, tours, user]);

  const travelerChats = useMemo(() => {
    if (!user) return [];
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

  if (!ready) return <div className="messages-app">Загрузка…</div>;

  if (!user) {
    return (
      <div className="messages-app messages-app_gate">
        <h1>Чат после входа</h1>
        <p>Переписка открывается гостю после оплаты. Организатору — по каждому туру отдельно.</p>
        <Button asChild variant="cta">
          <Link href="/login/?next=/messages/">Войти</Link>
        </Button>
      </div>
    );
  }

  const peerId = active
    ? active.travelerId === user.id
      ? active.organizerId
      : active.travelerId
    : null;
  const peer = peerId ? userById(peerId) : undefined;
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
        <h1>Сообщения</h1>
        {isOrganizerView && groups.length > 0 ? (
          <div className="messages-app__groups">
            <p className="messages-app__label">По турам</p>
            {groups.map(({ tour, chats }) => (
              <section key={tour?.slug ?? chats[0]?.id}>
                <h2>{tour?.title ?? "Тур"}</h2>
                {chats.map((chat) => {
                  const guest = userById(chat.travelerId);
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      className={cx(active?.id === chat.id && "is-on")}
                      onClick={() => open(chat.id)}
                    >
                      <span>{guest?.name ?? "Гость"}</span>
                      <em>1 на 1</em>
                    </button>
                  );
                })}
              </section>
            ))}
          </div>
        ) : null}

        {travelerChats.length > 0 ? (
          <div className="messages-app__groups">
            {isOrganizerView ? <p className="messages-app__label">Мои поездки</p> : null}
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
                  <span>{host?.name ?? "Гид"}</span>
                  <em>{tour?.title}</em>
                </button>
              );
            })}
          </div>
        ) : null}

        {mine.length === 0 ? (
          <p className="messages-app__empty">Пока тихо. Чат появится, когда вы оплатите тур.</p>
        ) : null}
      </aside>

      <section className="messages-app__thread">
        {!active ? (
          <div className="messages-app__placeholder">
            Выберите человека слева. Это всегда диалог один на один, не общая лента группы.
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
                {activeTour ? (
                  <Link href={tourPath(activeTour)}>{activeTour.title}</Link>
                ) : (
                  <span>Тур</span>
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
                  {item.text}
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
                placeholder="Сообщение только этому человеку"
              />
              <Button type="submit" variant="cta">
                Отправить
              </Button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
