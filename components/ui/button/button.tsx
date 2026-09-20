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
  | "glass-tile"
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
  | "icon-lg"
  | "icon-xl";

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
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

function IconButton({
  label,
  variant = "glass",
  size = "icon",
  ...props
}: Omit<ButtonProps, "aria-label" | "asChild"> & { label: string }) {
  return (
    <Button type="button" variant={variant} size={size} aria-label={label} {...props} />
  );
}

export { Button, IconButton };
export type { ButtonVariant, ButtonSize, ButtonProps };
