"use client"

import * as React from "react"
import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "not-last:border-b transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-open:border-primary/15",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between rounded-xl border border-transparent py-3.5 text-left text-sm font-medium outline-none transition-[color,background-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-open:text-primary",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="pointer-events-none ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-open/accordion-trigger:rotate-180 group-data-open/accordion-trigger:text-primary"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-4 text-muted-foreground [&_a]:text-primary [&_a]:hover:text-cta [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
