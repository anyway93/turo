import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const inputVariants = cva(
  "w-full min-w-0 border bg-clip-padding text-base outline-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border-input/80 bg-card/80 backdrop-blur-sm focus-visible:border-primary/40 focus-visible:ring-primary/20",
        filled:
          "border-transparent bg-muted focus-visible:border-primary/30 focus-visible:bg-card focus-visible:ring-primary/20",
        soft: "border-primary/15 bg-primary/5 focus-visible:border-primary/40 focus-visible:ring-primary/15",
        ghost:
          "border-transparent bg-transparent hover:bg-muted/70 focus-visible:bg-muted focus-visible:ring-primary/15",
        glass:
          "border-white/50 bg-white/40 backdrop-blur-xl focus-visible:border-white focus-visible:ring-white/40",
      },
      size: {
        sm: "h-8 rounded-full px-3 text-sm",
        default: "h-10 rounded-full px-3.5",
        lg: "h-12 rounded-full px-4 text-[0.95rem]",
        xl: "h-14 rounded-full px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  variant,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
