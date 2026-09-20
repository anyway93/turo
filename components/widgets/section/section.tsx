import "./section.scss";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Eyebrow } from "@/components/widgets/eyebrow";

type AsideItem = {
  index: string;
  label: string;
};

type SectionProps = {
  id?: string;
  label?: string;
  title: string;
  text?: string;
  aside?: AsideItem[];
  children?: ReactNode;
  className?: string;
};

export function Section({
  id,
  label,
  title,
  text,
  aside,
  children,
  className,
}: SectionProps) {
  const hasIntro = Boolean(label || title || text || aside?.length);

  return (
    <section id={id} className={cx("section", className)}>
      {hasIntro ? (
        <header className="section__head">
          <div>
            {label ? (
              <Eyebrow className="section__label">{label}</Eyebrow>
            ) : null}
            <h2 className="section__title">{title}</h2>
            {text ? <p className="section__text">{text}</p> : null}
          </div>
          {aside?.length ? (
            <p className="section__aside">
              {aside.map((item) => (
                <span key={item.index}>
                  <b>{item.index}</b>
                  {item.label}
                </span>
              ))}
            </p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
