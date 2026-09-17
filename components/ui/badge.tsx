import * as React from "react";
import { Slot } from "radix-ui";
import { cx } from "@/lib/cx";

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "outline" | "cta" | "gold" | "soft";
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      className={cx(
        "badge",
        variant !== "default" && `badge_variant_${variant}`,
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
