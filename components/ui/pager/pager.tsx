import "./pager.scss";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/cx";

export type PagerItem = {
  id: string;
  label: string;
};

type PagerProps = {
  items: PagerItem[];
  active: number;
  onSelect: (index: number) => void;
  durationMs?: number;
  className?: string;
};

export function Pager({
  items,
  active,
  onSelect,
  durationMs = 7000,
  className,
}: PagerProps) {
  return (
    <div
      className={cx("pager", className)}
      role="tablist"
      style={{ "--pager-duration": `${durationMs}ms` } as CSSProperties}
    >
      {items.map((item, index) => (
        <Button
          key={item.id}
          type="button"
          variant="ghost"
          role="tab"
          aria-selected={index === active}
          aria-label={item.label}
          className={cx("pager__dot", index === active && "is-active")}
          onClick={() => onSelect(index)}
        >
          <span />
        </Button>
      ))}
    </div>
  );
}
