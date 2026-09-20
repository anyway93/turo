import "./section.scss";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Eyebrow } from "@/components/widgets/eyebrow";

type SectionProps = {
  id?: string;
  label?: string;
  title: string;
  text?: string;
  children?: ReactNode;
  className?: string;
};

export function Section({
  id,
  label,
  title,
  text,
  children,
  className,
}: SectionProps) {
  const hasIntro = Boolean(label || title || text);

  return (
    <section id={id} className={cx("section", className)}>
      {hasIntro ? (
        <header className="section__head">
          {label ? <Eyebrow className="section__label">{label}</Eyebrow> : null}
          <h2 className="section__title">{title}</h2>
          {text ? <p className="section__text">{text}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
