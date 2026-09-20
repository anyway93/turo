import "./typography.scss";
import * as React from "react";
import { cx } from "@/lib/cx";

export type SizeVariant = "60" | "48" | "32" | "20" | "16" | "14" | "12";
export type ColorVariant =
  | "default"
  | "muted"
  | "primary"
  | "cta"
  | "gold"
  | "inverse"
  | "white"
  | "destructive"
  | "secondary";

const titleTag: Record<SizeVariant, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  "60": "h1",
  "48": "h1",
  "32": "h2",
  "20": "h3",
  "16": "h4",
  "14": "h5",
  "12": "h6",
};

function toSize(variant: SizeVariant | number | undefined, fallback: SizeVariant) {
  if (variant == null) return fallback;
  return String(variant) as SizeVariant;
}

function Title({
  className,
  variant = "32",
  color = "default",
  as,
  ...props
}: Omit<React.ComponentProps<"h1">, "color"> & {
  variant?: SizeVariant | number;
  color?: ColorVariant;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}) {
  const size = toSize(variant, "32");
  const Comp = as ?? titleTag[size];

  return (
    <Comp
      className={cx("title", `title_variant_${size}`, `title_color_${color}`, className)}
      {...props}
    />
  );
}

function Text({
  className,
  variant = "16",
  color = "muted",
  as = "p",
  ...props
}: {
  className?: string;
  variant?: SizeVariant | number;
  color?: ColorVariant;
  as?: "p" | "span" | "div" | "label";
} & Omit<React.ComponentPropsWithoutRef<"p">, "color" | "className">) {
  const Comp = as as React.ElementType;
  const size = toSize(variant, "16");

  return (
    <Comp
      className={cx("text", `text_variant_${size}`, `text_color_${color}`, className)}
      {...props}
    />
  );
}

export { Title, Text };
