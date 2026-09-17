import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const textareaVariants = cva(
  "flex field-sizing-content min-h-28 w-full border bg-clip-padding px-3.5 py-3 text-base outline-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-muted-foreground focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "rounded-2xl border-input/80 bg-card/80 focus-visible:border-primary/40 focus-visible:ring-primary/20",
        filled:
          "rounded-2xl border-transparent bg-muted focus-visible:border-primary/30 focus-visible:bg-card focus-visible:ring-primary/20",
        soft: "rounded-2xl border-primary/15 bg-primary/5 focus-visible:border-primary/40 focus-visible:ring-primary/15",
        ghost:
          "rounded-2xl border-transparent bg-transparent hover:bg-muted/70 focus-visible:bg-muted focus-visible:ring-primary/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }
