import "./eyebrow.scss";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

type EyebrowProps = ComponentProps<"p"> & {
  as?: "p" | "span";
};

export function Eyebrow({ as: Comp = "p", className, ...props }: EyebrowProps) {
  return <Comp className={cx("eyebrow", className)} {...props} />;
}
