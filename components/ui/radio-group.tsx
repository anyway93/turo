"use client"

import * as React from "react"
import { cn } from "cn"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-2.5", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-5 shrink-0 items-center justify-center rounded-full border-[2.5px] border-input bg-card outline-none transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] after:absolute after:-inset-2 hover:border-primary/50 hover:shadow-[0_8px_18px_-12px_oklch(0.42_0.075_188/_0.5)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:shadow-[0_10px_22px_-10px_oklch(0.42_0.075_188/_0.65)] data-checked:hover:border-primary active:scale-90",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        forceMount
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=checked]:scale-100 data-[state=checked]:opacity-100 data-[state=unchecked]:scale-50 data-[state=unchecked]:opacity-0"
      >
        <span className="size-2 rounded-full bg-primary-foreground shadow-[0_0_0_1px_oklch(1_0_0_/_0.12)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
