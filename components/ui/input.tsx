import * as React from "react";
import { cx } from "@/lib/cx";

function Input({
  className,
  type,
  variant = "default",
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & {
  variant?: "default" | "filled" | "soft" | "ghost" | "glass";
  size?: "sm" | "default" | "lg" | "xl";
}) {
  return (
    <input
      type={type}
      className={cx(
        "input",
        variant !== "default" && `input_variant_${variant}`,
        size !== "default" && `input_size_${size}`,
        className,
      )}
      {...props}
    />
  );
}

export { Input };
