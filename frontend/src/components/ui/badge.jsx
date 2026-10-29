import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        success: "border-transparent bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        secondary: "border-transparent bg-slate-800 text-slate-300 border-slate-700",
        destructive: "border-transparent bg-rose-500/15 text-rose-400 border-rose-500/30",
        warning: "border-transparent bg-amber-500/15 text-amber-400 border-amber-500/30",
        outline: "text-slate-300 border-slate-700 bg-slate-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
