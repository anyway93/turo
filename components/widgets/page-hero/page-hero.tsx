import "./page-hero.scss";
import type { ReactNode } from "react";
import { Wrapper } from "@/components/layout/wrapper";
import { Eyebrow } from "@/components/widgets/eyebrow";

type PageHeroProps = {
  kicker?: string;
  title: string;
  text?: string;
  actions?: ReactNode;
};

export function PageHero({ kicker, title, text, actions }: PageHeroProps) {
  return (
    <section className="page-hero">
      <Wrapper>
        {kicker ? <Eyebrow>{kicker}</Eyebrow> : null}
        <h1 className="page-hero__title">{title}</h1>
        {text ? <p className="page-hero__text">{text}</p> : null}
        {actions ? <div className="page-hero__actions">{actions}</div> : null}
      </Wrapper>
    </section>
  );
}
