import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const cardVariants = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden text-sm text-card-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [--card-spacing:--spacing(5)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3.5)] *:[img:first-child]:rounded-t-[inherit] *:[img:last-child]:rounded-b-[inherit]",
  {
    variants: {
      variant: {
        default: "rounded-3xl bg-card ring-1 ring-foreground/8",
        elevated:
          "rounded-3xl bg-card shadow-[0_24px_60px_-28px_oklch(0.24_0.03_185/_0.38)] ring-1 ring-foreground/5",
        glass:
          "rounded-3xl bg-card/60 ring-1 ring-white/60 backdrop-blur-xl",
        outline: "rounded-3xl bg-transparent ring-1 ring-border",
        muted: "rounded-3xl bg-muted ring-0",
        dark: "rounded-3xl bg-foreground text-background ring-0 [&_[data-slot=card-description]]:text-background/65 [&_[data-slot=card-footer]]:border-background/10 [&_[data-slot=card-footer]]:bg-background/8",
        interactive:
          "rounded-3xl bg-card ring-1 ring-foreground/8 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-30px_oklch(0.24_0.03_185/_0.5)] hover:ring-primary/15",
      },
      size: {
        default: "",
        sm: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-[inherit] px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-display text-xl leading-snug font-semibold tracking-tight group-data-[size=sm]/card:text-base",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-[inherit] border-t border-foreground/6 bg-muted/35 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
