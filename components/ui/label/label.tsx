"use client";
import "./label.scss";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cx } from "@/lib/cx";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cx("label", className)} {...props} />;
}

export { Label };
