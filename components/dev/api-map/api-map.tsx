"use client";

import "./api-map.scss";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Wrapper } from "@/components/layout/wrapper";
import { Button, Input } from "@/components/ui";
import { apiEndpoints, apiGroups, fetchSnippet, type ApiEndpoint } from "./endpoints";

const accounts = [
  ["anna@turo.travel", "путешественник"],
  ["elena@turo.travel", "организатор"],
  ["admin@turo.travel", "админ"],
];

export function ApiMap() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof apiGroups)[number] | "all">("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return apiEndpoints.filter((item) => {
      if (group !== "all" && item.group !== group) return false;
      if (!needle) return true;
      return [item.title, item.path, item.method, item.access, item.note, item.errors]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [group, query]);

  async function copy(endpoint: ApiEndpoint) {
    try {
      await navigator.clipboard.writeText(fetchSnippet(endpoint));
      toast.success("Запрос скопирован");
    } catch {
      toast.error("Не удалось скопировать");
    }
  }

  return (
    <div className="api-map">
      <Wrapper>
        <header className="api-map__intro">
          <p className="api-map__eyebrow">Для фронта</p>
          <h1>Запросы API</h1>
          <p className="api-map__lead">
            Слэш в конце адреса обязателен. Во всех запросах нужен <code>credentials: &quot;include&quot;</code> — сессия
            лежит в cookie. Демо-пароль у готовых аккаунтов: <code>turo123</code>.
          </p>
          <ul className="api-map__accounts">
            {accounts.map(([email, role]) => (
              <li key={email}>
                <code>{email}</code>
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </header>

        <div className="api-map__tools">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Найти по адресу или названию"
            aria-label="Поиск запроса"
          />
          <div className="api-map__filters" role="tablist" aria-label="Группы запросов">
            <button
              type="button"
              className="api-map__filter"
              data-active={group === "all"}
              onClick={() => setGroup("all")}
            >
              Все
            </button>
            {apiGroups.map((item) => (
              <button
                key={item}
                type="button"
                className="api-map__filter"
                data-active={group === item}
                onClick={() => setGroup(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="api-map__list">
          {visible.map((endpoint, index) => (
            <article
              key={endpoint.id}
              className="api-map__card"
              style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
            >
              <div className="api-map__card-head">
                <div>
                  <p className="api-map__method" data-method={endpoint.method}>
                    {endpoint.method}
                  </p>
                  <h2>{endpoint.title}</h2>
                  <p className="api-map__path">
                    <code>{endpoint.path}</code>
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => copy(endpoint)}>
                  Копировать fetch
                </Button>
              </div>
              <p className="api-map__access">{endpoint.access}</p>
              {endpoint.note ? <p className="api-map__note">{endpoint.note}</p> : null}
              {endpoint.body ? (
                <pre>
                  <span>Тело</span>
                  {endpoint.body}
                </pre>
              ) : null}
              <pre>
                <span>Ответ</span>
                {endpoint.response}
              </pre>
              {endpoint.errors ? <p className="api-map__errors">{endpoint.errors}</p> : null}
            </article>
          ))}
          {visible.length === 0 ? <p className="api-map__empty">Такого запроса нет.</p> : null}
        </div>
      </Wrapper>
    </div>
  );
}
