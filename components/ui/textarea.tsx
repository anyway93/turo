import * as React from "react";
import { cx } from "@/lib/cx";

function Textarea({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"textarea"> & {
  variant?: "default" | "filled" | "soft" | "ghost";
}) {
  return (
    <textarea
      className={cx(
        "textarea",
        variant !== "default" && `textarea_variant_${variant}`,
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
