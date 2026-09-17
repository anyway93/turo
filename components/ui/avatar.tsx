"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cx } from "@/lib/cx";

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { size?: "default" | "lg" }) {
  return (
    <AvatarPrimitive.Root
      className={cx("avatar", size === "lg" && "avatar_lg", className)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cx(className)} {...props} />;
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback className={cx("avatar__fallback", className)} {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
