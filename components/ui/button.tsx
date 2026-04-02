import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
}

export function buttonClassName(variant: ButtonProps["variant"] = "default", className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-pine text-white hover:bg-pine/90": variant === "default",
      "bg-white text-ink shadow-sm ring-1 ring-black/5 hover:bg-mist": variant === "secondary",
      "border border-slate/20 bg-transparent text-ink hover:bg-white/70": variant === "outline",
      "bg-transparent text-slate hover:bg-white/70": variant === "ghost",
    },
    className,
  );
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return <button className={buttonClassName(variant, className)} {...props} />;
}
