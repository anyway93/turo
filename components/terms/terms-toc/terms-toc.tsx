"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { useLocale } from "@/lib/locale";

type TocItem = {
  id: string;
  num: string;
  heading: string;
};

export function TermsToc({ items }: { items: TocItem[] }) {
  const { t } = useLocale();
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const ids = items.map((item) => item.id);

    const update = () => {
      const line = 128;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const node = document.getElementById(`article-${id}`);
        if (!node) continue;
        if (node.getBoundingClientRect().top - line <= 0) current = id;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  useEffect(() => {
    const link = document.querySelector<HTMLElement>(`[data-toc="${active}"]`);
    link?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <nav className="terms-page__toc" aria-label={t("terms.toc")}>
      <p>{t("terms.toc")}</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#article-${item.id}`}
              data-toc={item.id}
              className={cx(active === item.id && "is-active")}
              aria-current={active === item.id ? "location" : undefined}
            >
              <span>{item.num}</span>
              {item.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
