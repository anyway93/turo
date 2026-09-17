import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none select-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_oklch(0.42_0.075_188/_0.7)] hover:bg-primary/90",
        outline:
          "border-border/80 bg-background/70 backdrop-blur-sm hover:border-primary/30 hover:bg-muted hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)]",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/18",
        cta: "bg-cta text-cta-foreground shadow-[0_12px_28px_-12px_oklch(0.6_0.14_45/_0.75)] hover:bg-cta/90",
        soft: "bg-primary/10 text-primary hover:bg-primary/16",
        gold: "bg-gold text-gold-foreground shadow-[0_10px_24px_-12px_oklch(0.76_0.13_80/_0.65)] hover:bg-gold/90",
        glass:
          "border-white/50 bg-white/45 text-foreground shadow-[0_8px_30px_-18px_oklch(0.24_0.03_185/_0.4)] backdrop-blur-xl hover:bg-white/70",
        inverse:
          "bg-foreground text-background hover:bg-foreground/90",
        text: "px-0 text-primary hover:text-cta",
      },
      size: {
        default:
          "h-10 gap-1.5 rounded-full px-4 text-sm has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5",
        xs: "h-7 gap-1 rounded-full px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-full px-3 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 rounded-full px-5 text-sm",
        xl: "h-12 gap-2 rounded-full px-6 text-base",
        icon: "size-10 rounded-full",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
