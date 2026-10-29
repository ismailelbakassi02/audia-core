import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-950",
        primary: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-950",
        destructive: "bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-950",
        outline: "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
        ghost: "text-slate-300 hover:bg-slate-800 hover:text-white",
        link: "text-emerald-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6 text-sm font-bold",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
