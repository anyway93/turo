"use client";
import "./switch.scss";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cx } from "@/lib/cx";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root className={cx("switch", className)} {...props}>
      <SwitchPrimitive.Thumb className="switch__thumb" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
