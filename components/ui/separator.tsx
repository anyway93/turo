import * as React from "react";
import { cx } from "@/lib/cx";

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cx("separator", className)} {...props} />;
}

export { Separator };
