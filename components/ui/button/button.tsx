import "./button.scss";
import * as React from "react";
import { Slot } from "radix-ui";
import { cx } from "@/lib/cx";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "cta"
  | "soft"
  | "gold"
  | "glass"
  | "inverse"
  | "text";

type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "xl"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cx(
        "button",
        `button_variant_${variant}`,
        `button_size_${size}`,
        className,
      )}
      {...props}
    />
  );
}

export { Button };
export type { ButtonVariant, ButtonSize };
