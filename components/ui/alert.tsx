import * as React from "react";
import { cx } from "@/lib/cx";

function Alert({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "destructive" }) {
  return (
    <div
      role="alert"
      className={cx("alert", variant !== "default" && `alert_${variant}`, className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cx("alert__title", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cx("alert__description", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
