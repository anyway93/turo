import "./wrapper.scss";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

type WrapperProps = ComponentProps<"div">;

export function Wrapper({ className, ...props }: WrapperProps) {
  return <div className={cx("wrapper", className)} {...props} />;
}
