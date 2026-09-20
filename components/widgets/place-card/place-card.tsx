import "./place-card.scss";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { cx } from "@/lib/cx";

type PlaceCardProps = {
  href: string;
  name: string;
  image: string;
  featured?: boolean;
};

export function PlaceCard({ href, name, image, featured }: PlaceCardProps) {
  return (
    <Link href={href} className={cx("place-card", featured && "place-card_featured")}>
      <div className="place-card__media">
        <Image src={image} alt={name} fill sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
      <span className="place-card__name">{name}</span>
    </Link>
  );
}

export function PlaceCardGroup({ children }: { children: ReactNode }) {
  return <div className="place-card-group">{children}</div>;
}
