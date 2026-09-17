"use client";

import * as React from "react";
import { cx } from "@/lib/cx";
import { Label } from "@/components/ui/label";

function Field({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cx("field", className)} {...props} />;
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cx("field__group", className)} {...props} />;
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label className={cx("field__label", className)} {...props} />;
}

export { Field, FieldGroup, FieldLabel };
