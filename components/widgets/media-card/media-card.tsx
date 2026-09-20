import "./media-card.scss";
import type { ReactNode } from "react";
import { MediaImage } from "@/components/widgets/media-image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowUpRight } from "lucide-react";

type MediaCardProps = {
  href: string;
  image: string;
  index: string;
  kicker: string;
  title: string;
  text: string;
  action: string;
  accent?: boolean;
  id?: string;
};

export function MediaCard({
  href,
  image,
  index,
  kicker,
  title,
  text,
  action,
  accent,
  id,
}: MediaCardProps) {
  return (
    <Link href={href} className="media-card" id={id}>
      <div className="media-card__media">
        <MediaImage src={image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="media-card__veil" />
      <div className="media-card__dim" />
      <div className="media-card__top">
        <span>{index}</span>
        <p className="media-card__kicker">{kicker}</p>
      </div>
      <div className="media-card__body">
        <h3 className="media-card__title">{title}</h3>
        <p className="media-card__text">{text}</p>
        <Button asChild variant={accent ? "cta" : "glass"} size="sm">
          <span>
            {action}
            <ArrowUpRight />
          </span>
        </Button>
      </div>
    </Link>
  );
}

export function MediaCardGroup({ children }: { children: ReactNode }) {
  return <div className="media-card-group">{children}</div>;
}
