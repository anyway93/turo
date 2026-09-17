"use client"

import * as React from "react"
import { cn } from "cn"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer relative flex size-6 shrink-0 items-center justify-center rounded-[8px] border-[2.5px] border-input bg-card outline-none transition-[background-color,border-color,box-shadow,transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] after:absolute after:-inset-2 hover:border-primary/50 hover:shadow-[0_8px_18px_-12px_oklch(0.42_0.075_188/_0.55)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-[0_10px_22px_-10px_oklch(0.42_0.075_188/_0.7)] data-checked:hover:border-primary active:scale-90",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        forceMount
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=checked]:scale-100 data-[state=checked]:opacity-100 data-[state=unchecked]:scale-50 data-[state=unchecked]:opacity-0"
      >
        <CheckIcon className="size-4" strokeWidth={3.2} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
