import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import * as React from "react";

const typeColor = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  cta: "text-cta",
  gold: "text-gold",
  inverse: "text-primary-foreground",
  white: "text-white",
  destructive: "text-destructive",
  secondary: "text-secondary-foreground",
} as const;

const titleVariants = cva("text-balance", {
  variants: {
    variant: {
      "60": "font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.75rem]",
      "48": "font-display text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.028em] sm:text-[3rem]",
      "32": "font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2rem]",
      "20": "font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.015em]",
      "16": "font-sans text-base font-semibold leading-snug",
      "14": "font-sans text-sm font-semibold leading-snug",
      "12": "font-sans text-xs font-semibold uppercase tracking-[0.14em]",
    },
    color: typeColor,
  },
  defaultVariants: {
    variant: "32",
    color: "default",
  },
});

const textVariants = cva("text-pretty", {
  variants: {
    variant: {
      "60": "font-display text-[2.5rem] font-medium leading-[1.08] sm:text-[3.75rem]",
      "48": "font-display text-[2.25rem] font-medium leading-[1.12] sm:text-[3rem]",
      "32": "font-display text-[1.75rem] font-medium leading-snug sm:text-[2rem]",
      "20": "font-sans text-xl font-normal leading-relaxed",
      "16": "font-sans text-base font-normal leading-relaxed",
      "14": "font-sans text-sm font-normal leading-relaxed",
      "12": "font-sans text-xs font-medium leading-relaxed tracking-[0.01em]",
    },
    color: typeColor,
  },
  defaultVariants: {
    variant: "16",
    color: "default",
  },
});

type SizeVariant = NonNullable<VariantProps<typeof titleVariants>["variant"]>;
type ColorVariant = NonNullable<VariantProps<typeof titleVariants>["color"]>;

const titleTag: Record<SizeVariant, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  "60": "h1",
  "48": "h1",
  "32": "h2",
  "20": "h3",
  "16": "h4",
  "14": "h5",
  "12": "h6",
};

function toSize(variant: SizeVariant | number | undefined): SizeVariant {
  if (variant == null) return "32";
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
  const size = toSize(variant);
  const Comp = as ?? titleTag[size];

  return (
    <Comp
      data-slot="title"
      className={cn(titleVariants({ variant: size, color }), className)}
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

  return (
    <Comp
      data-slot="text"
      className={cn(
        textVariants({ variant: toSize(variant), color }),
        className,
      )}
      {...props}
    />
  );
}

export { Title, Text, titleVariants, textVariants, typeColor };
export type { SizeVariant, ColorVariant };
