"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cx } from "@/lib/cx";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cx("tabs", className)} {...props} />;
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cx("tabs__list", className)} {...props} />;
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger className={cx("tabs__trigger", className)} {...props} />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content className={cx("tabs__content", className)} {...props} />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
